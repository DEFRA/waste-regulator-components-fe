import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { marked } from 'marked'
import * as prettier from 'prettier'
import { nunjucksTestEnv } from '#test-helpers/component-helpers.js'
import { resolveReleaseTag as resolveGitReleaseTag } from './detect-bump.js'
import { DEFAULT_ROOT_DIR, compileDesignSystemScss } from './sass-config.js'

const require = createRequire(import.meta.url)

/**
 * Writes a file atomically via a temporary sibling file so concurrent readers
 * never observe a partially written or truncated file.
 * @param {string} destPath
 * @param {(tempPath: string) => void} writeTemp
 */
function writeFileAtomically(destPath, writeTemp) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  const tempPath = `${destPath}.${process.pid}.${crypto.randomUUID()}.tmp`
  writeTemp(tempPath)
  fs.renameSync(tempPath, destPath)
}

export function buildDocsStyles({
  rootDir = DEFAULT_ROOT_DIR,
  scssPath = path.join(rootDir, 'docs/assets/scss/docs.scss'),
  outputCssPath = path.join(rootDir, 'docs/assets/css/docs.css')
} = {}) {
  const source = fs.readFileSync(scssPath, 'utf8')
  const css = compileDesignSystemScss(source, {
    rootDir,
    assetsPath: '../',
    extraLoadPaths: [path.dirname(scssPath)]
  })

  writeFileAtomically(outputCssPath, (tempPath) => {
    fs.writeFileSync(tempPath, css)
  })
  return css
}

export function copyDocsImages({
  rootDir = DEFAULT_ROOT_DIR,
  srcImagesDir = path.join(rootDir, 'dist/wrc/assets/images'),
  destImagesDir = path.join(rootDir, 'docs/assets/images')
} = {}) {
  fs.mkdirSync(destImagesDir, { recursive: true })

  const entries = fs.readdirSync(srcImagesDir, { withFileTypes: true })
  const copied = entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort()

  for (const fileName of copied) {
    writeFileAtomically(path.join(destImagesDir, fileName), (tempPath) => {
      fs.copyFileSync(path.join(srcImagesDir, fileName), tempPath)
    })
  }

  return copied
}

export function resolveReleaseTag(rootDir = DEFAULT_ROOT_DIR) {
  return resolveGitReleaseTag(rootDir)
}

export function writeDocsReleaseData({
  rootDir = DEFAULT_ROOT_DIR,
  releaseDataPath = path.join(rootDir, 'docs/_data/release.yml')
} = {}) {
  const releaseTag = resolveReleaseTag(rootDir)
  writeFileAtomically(releaseDataPath, (tempPath) => {
    fs.writeFileSync(tempPath, `tag: ${releaseTag}\n`)
  })
  return releaseTag
}

export function parseFrontmatter(markdown) {
  const normalized = markdown.replaceAll('\r\n', '\n')
  if (!normalized.startsWith('---\n')) {
    return { data: {}, body: normalized }
  }

  const closeIndex = normalized.indexOf('\n---', 4)
  if (closeIndex === -1) {
    return { data: {}, body: normalized }
  }

  const afterClose = normalized.slice(closeIndex + 4)
  if (afterClose !== '' && !afterClose.startsWith('\n')) {
    return { data: {}, body: normalized }
  }

  const parsed = yaml.load(normalized.slice(4, closeIndex))
  const data =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  const body = afterClose.startsWith('\n') ? afterClose.slice(1) : afterClose

  return { data, body }
}

// Browser scripts used by the docs and example pages, as in the GOV.UK Design System
const DOCS_SCRIPTS = [
  'govuk-frontend/dist/govuk/govuk-frontend.min.js',
  'clipboard/dist/clipboard.min.js',
  'iframe-resizer/js/iframeResizer.min.js',
  'iframe-resizer/js/iframeResizer.contentWindow.min.js'
]

export function copyDocsScripts({
  rootDir = DEFAULT_ROOT_DIR,
  destJsDir = path.join(rootDir, 'docs/assets/js')
} = {}) {
  return DOCS_SCRIPTS.map((modulePath) => {
    const destPath = path.join(destJsDir, path.basename(modulePath))
    writeFileAtomically(destPath, (tempPath) => {
      fs.copyFileSync(require.resolve(modulePath), tempPath)
    })
    return path.basename(modulePath)
  })
}

/**
 * Standalone page loaded in the docs example iframe, so component styles and
 * landmarks (h1, header, footer) stay isolated from the documentation page.
 * The <html> element skips govuk-template because its forced overflow-y: scroll
 * would show an empty scrollbar inside the iframe, and the example is wrapped so
 * full-page rules (such as the sticky footer's body:has(> footer)) don't stretch
 * it to the iframe height.
 * @param {string} slug
 * @param {string} html
 */
function renderExamplePage(slug, html) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${slug} example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../css/docs.css">
  </head>
  <body class="govuk-template__body defra-internal">
    <script>document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');</script>
    <div class="wrc-docs-example-page">
${html}
    </div>
    <script src="../js/iframeResizer.contentWindow.min.js"></script>
    <script type="module">
      import { initAll } from '../js/govuk-frontend.min.js'
      initAll()
    </script>
  </body>
</html>
`
}

/**
 * Renders each docs/_examples/<slug>.njk into an iframe page and records its
 * source and formatted HTML in docs/_data/examples.json for the layout tabs.
 *
 * Optional frontmatter in an example file:
 * - context: variables the example code reads (e.g. csrfToken, pagination)
 * - htmlNote / nunjucksNote: Markdown shown above the code in that tab
 * A plain HTML example (no Nunjucks tags) gets no Nunjucks tab.
 */
export async function buildDocsExamples({
  rootDir = DEFAULT_ROOT_DIR,
  examplesDir = path.join(rootDir, 'docs/_examples'),
  outputDataPath = path.join(rootDir, 'docs/_data/examples.json'),
  outputPagesDir = path.join(rootDir, 'docs/assets/examples')
} = {}) {
  const fileNames = fs
    .readdirSync(examplesDir)
    .filter((fileName) => fileName.endsWith('.njk'))
    .sort()

  // Examples are independent, so format them in parallel; Promise.all keeps file order
  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = path.basename(fileName, '.njk')
      const { data, body } = parseFrontmatter(
        fs.readFileSync(path.join(examplesDir, fileName), 'utf8')
      )
      const source = body.trim()
      const rendered = nunjucksTestEnv.renderString(source, data.context ?? {})
      // The preview gets the exact output; the code panel gets it formatted to read
      const html = (
        await prettier.format(rendered, {
          parser: 'html',
          htmlWhitespaceSensitivity: 'ignore'
        })
      ).trim()

      writeFileAtomically(
        path.join(outputPagesDir, `${slug}.html`),
        (tempPath) => {
          fs.writeFileSync(tempPath, renderExamplePage(slug, rendered))
        }
      )
      return [
        slug,
        {
          html,
          nunjucks: /{[{%]/.test(source) ? source : undefined,
          htmlNote: data.htmlNote && marked.parse(data.htmlNote),
          nunjucksNote: data.nunjucksNote && marked.parse(data.nunjucksNote)
        }
      ]
    })
  )
  const examples = Object.fromEntries(entries)

  writeFileAtomically(outputDataPath, (tempPath) => {
    fs.writeFileSync(tempPath, `${JSON.stringify(examples, null, 2)}\n`)
  })
  return Object.keys(examples)
}

export async function buildDocs(options = {}) {
  const css = buildDocsStyles(options)
  const images = copyDocsImages(options)
  const releaseTag = writeDocsReleaseData(options)
  copyDocsScripts(options)
  const examples = await buildDocsExamples(options)
  return { css, images, releaseTag, examples }
}

/* v8 ignore start */
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { images, releaseTag, examples } = await buildDocs()
  console.log(
    `Docs CSS, ${images.length} images, ${examples.length} examples and release data (${releaseTag}) built successfully in docs/`
  )
}
/* v8 ignore stop */
