import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

import {
  buildDocs,
  buildDocsExamples,
  buildDocsStyles,
  copyDocsImages,
  copyDocsScripts,
  resolveReleaseTag,
  writeDocsReleaseData
} from '../../scripts/build-docs.js'
import { resolveGitBinary } from '../../scripts/detect-bump.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')
const docsDir = path.join(repoRoot, 'docs')

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath)
    }
    return entry.name.endsWith('.md') ? [fullPath] : []
  })
}

describe('Documentation build and structure', () => {
  const tempDirs = []

  afterEach(() => {
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true })
    }
  })

  test('buildDocs builds CSS and copies images cleanly', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-docs-test-'))
    tempDirs.push(tempDir)

    const outputCssPath = path.join(tempDir, 'assets/css/docs.css')
    const destImagesDir = path.join(tempDir, 'assets/images')
    const releaseDataPath = path.join(tempDir, '_data/release.yml')
    const customCss = buildDocsStyles({ outputCssPath })
    expect(fs.existsSync(outputCssPath)).toBe(true)
    expect(customCss).toContain('.wrc-docs-layout')

    const isolatedResult = await buildDocs({
      outputCssPath,
      destImagesDir,
      releaseDataPath,
      destJsDir: path.join(tempDir, 'assets/js'),
      outputDataPath: path.join(tempDir, '_data/examples.json'),
      outputPagesDir: path.join(tempDir, 'assets/examples')
    })
    expect(isolatedResult.examples).toContain('heading')
    expect(isolatedResult.images).toEqual([
      'apple-touch-icon.png',
      'favicon.ico',
      'favicon.svg',
      'govuk-crest.svg'
    ])
    expect(isolatedResult.releaseTag).toMatch(/^v\d+\.\d+\.\d+$/)
    expect(fs.readFileSync(releaseDataPath, 'utf8')).toBe(
      `tag: ${isolatedResult.releaseTag}\n`
    )
    expect(fs.existsSync(path.join(destImagesDir, 'govuk-crest.svg'))).toBe(
      true
    )

    const defaultResult = await buildDocs()
    expect(defaultResult.css).toContain('.wrc-docs-layout')
    expect(defaultResult.css).toContain('#00a33b')
    expect(defaultResult.releaseTag).toBe(resolveReleaseTag())
    expect(defaultResult.images).toEqual([
      'apple-touch-icon.png',
      'favicon.ico',
      'favicon.svg',
      'govuk-crest.svg'
    ])

    const css = fs.readFileSync(outputCssPath, 'utf8')
    expect(css).toContain('arial, sans-serif')
    expect(css).not.toContain('GDS Transport')
    expect(css).toContain('#00a33b')
    expect(css).toContain('.defra-internal-header')
    expect(css).toContain('.defra-internal-service-header')
    expect(css).toContain('.defra-internal-footer')
    expect(css).toContain('.wrc-docs-layout')
    expect(css).toContain('.wrc-docs-sidebar')
    expect(css).toContain('.wrc-docs-content')
    expect(css).toContain('url("../images/govuk-crest.svg")')
    expect(css).not.toContain('url("/assets/images/')
  })

  test('copyDocsImages skips hidden files and subdirectories', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-images-test-'))
    tempDirs.push(tempDir)

    const srcImagesDir = path.join(tempDir, 'src')
    const destImagesDir = path.join(tempDir, 'dest')
    fs.mkdirSync(path.join(srcImagesDir, 'nested-dir'), { recursive: true })
    fs.writeFileSync(path.join(srcImagesDir, '.DS_Store'), 'ignored')
    fs.writeFileSync(path.join(srcImagesDir, 'logo.svg'), '<svg></svg>')
    fs.writeFileSync(path.join(srcImagesDir, 'icon.png'), 'pngdata')

    const copied = copyDocsImages({ srcImagesDir, destImagesDir })
    expect(copied).toEqual(['icon.png', 'logo.svg'])
    expect(fs.existsSync(path.join(destImagesDir, '.DS_Store'))).toBe(false)
    expect(fs.existsSync(path.join(destImagesDir, 'nested-dir'))).toBe(false)
    expect(fs.readFileSync(path.join(destImagesDir, 'logo.svg'), 'utf8')).toBe(
      '<svg></svg>'
    )
  })

  test('resolveReleaseTag and writeDocsReleaseData fall back to package.json when no git tag exists', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-release-tag-'))
    tempDirs.push(tempDir)

    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ version: '1.2.3' })
    )

    const releaseDataPath = path.join(tempDir, '_data/release.yml')
    expect(resolveReleaseTag(tempDir)).toBe('v1.2.3')
    expect(writeDocsReleaseData({ rootDir: tempDir, releaseDataPath })).toBe(
      'v1.2.3'
    )
    expect(fs.readFileSync(releaseDataPath, 'utf8')).toBe('tag: v1.2.3\n')
    expect(writeDocsReleaseData()).toBe(resolveReleaseTag())
  })

  test('resolveReleaseTag and writeDocsReleaseData prefer the latest git tag over package.json', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-release-tag-'))
    tempDirs.push(tempDir)

    const gitBin = resolveGitBinary()
    const runGit = (args) =>
      execFileSync(gitBin, args, { cwd: tempDir, stdio: 'ignore' })

    runGit(['init', '-b', 'main'])
    runGit(['config', 'user.name', 'Test User'])
    runGit(['config', 'user.email', 'test@example.com'])
    runGit(['config', 'commit.gpgsign', 'false'])
    runGit(['config', 'tag.gpgsign', 'false'])

    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ version: '0.1.0' })
    )

    runGit(['commit', '--allow-empty', '-m', 'chore: release'])
    runGit(['tag', 'v2.3.4'])

    const releaseDataPath = path.join(tempDir, '_data/release.yml')
    expect(resolveReleaseTag(tempDir)).toBe('v2.3.4')
    expect(writeDocsReleaseData({ rootDir: tempDir, releaseDataPath })).toBe(
      'v2.3.4'
    )
    expect(fs.readFileSync(releaseDataPath, 'utf8')).toBe('tag: v2.3.4\n')
  })

  test('buildDocsExamples renders each example into an iframe page and data file', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-examples-test-'))
    tempDirs.push(tempDir)

    const examplesDir = path.join(tempDir, '_examples')
    const outputDataPath = path.join(tempDir, '_data/examples.json')
    const outputPagesDir = path.join(tempDir, 'assets/examples')
    fs.mkdirSync(examplesDir)
    fs.writeFileSync(
      path.join(examplesDir, 'heading.njk'),
      '{% from "wrc/components/heading/macro.njk" import wrcHeading %}\n{{ wrcHeading({ text: "Title <b>", caption: "Caption" }) }}\n'
    )
    fs.writeFileSync(path.join(examplesDir, 'README.md'), 'ignored')
    fs.writeFileSync(
      path.join(examplesDir, 'csrf.njk'),
      [
        '---',
        'nunjucksNote: Takes positional arguments `(token, id)`.',
        'htmlNote: Hidden from view.',
        'context:',
        '  csrfToken: abc-123',
        '---',
        '{% from "wrc/components/csrf-field/macro.njk" import wrcCsrfField %}',
        '{{ wrcCsrfField(csrfToken) }}'
      ].join('\n')
    )
    fs.writeFileSync(path.join(examplesDir, 'plain.njk'), '<p>Plain HTML</p>\n')

    const slugs = await buildDocsExamples({
      examplesDir,
      outputDataPath,
      outputPagesDir
    })
    expect(slugs).toEqual(['csrf', 'heading', 'plain'])

    const data = JSON.parse(fs.readFileSync(outputDataPath, 'utf8'))
    expect(data.heading.nunjucks).toMatch(/^\{% from .*wrcHeading\(/s)
    expect(data.heading.html).toContain('govuk-heading-xl')
    expect(data.heading.html).toContain('Title &lt;b&gt;')
    expect(data.heading).not.toHaveProperty('nunjucksNote')

    expect(data.csrf.html).toContain('value="abc-123"')
    expect(data.csrf.nunjucks).not.toContain('nunjucksNote')
    expect(data.csrf.nunjucksNote).toBe(
      '<p>Takes positional arguments <code>(token, id)</code>.</p>\n'
    )
    expect(data.csrf.htmlNote).toBe('<p>Hidden from view.</p>\n')

    expect(data.plain).toEqual({ html: '<p>Plain HTML</p>' })

    const $ = cheerio.load(
      fs.readFileSync(path.join(outputPagesDir, 'heading.html'), 'utf8')
    )
    expect($('link[rel="stylesheet"]').attr('href')).toBe('../css/docs.css')
    expect(
      $('body > .wrc-docs-example-page h1.govuk-heading-xl').text()
    ).toContain('Title <b>')
    expect($('script[type="module"]').html()).toContain(
      '../js/govuk-frontend.min.js'
    )
    expect(
      $('script[src="../js/iframeResizer.contentWindow.min.js"]').length
    ).toBe(1)
  })

  test('copyDocsScripts copies the browser scripts for the docs and examples', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-js-test-'))
    tempDirs.push(tempDir)

    expect(copyDocsScripts({ destJsDir: tempDir })).toEqual([
      'govuk-frontend.min.js',
      'clipboard.min.js',
      'iframeResizer.min.js',
      'iframeResizer.contentWindow.min.js'
    ])
    expect(
      fs.readFileSync(path.join(tempDir, 'govuk-frontend.min.js'), 'utf8')
    ).toContain('initAll')
  })

  test('every visual component page has a rendered example', () => {
    // These render nothing visible, so their pages keep plain code blocks
    const nonVisual = new Set(['index', 'csrf-field', 'google-analytics'])
    const slugs = fs
      .readdirSync(path.join(docsDir, 'components'))
      .map((fileName) => path.basename(fileName, '.md'))
      .filter((slug) => !nonVisual.has(slug))

    expect(slugs.length).toBeGreaterThanOrEqual(17)
    for (const slug of slugs) {
      expect(
        fs.existsSync(path.join(docsDir, '_examples', `${slug}.njk`)),
        `docs/_examples/${slug}.njk should exist`
      ).toBe(true)
    }
  })

  test('docs layout uses Defra chrome matching the example application', () => {
    const layoutHtml = fs.readFileSync(
      path.join(docsDir, '_layouts/default.html'),
      'utf8'
    )
    const $ = cheerio.load(layoutHtml)

    expect($('a.govuk-skip-link').attr('href')).toBe('#main-content')
    expect($('.defra-internal-header').length).toBe(1)
    expect($('.defra-internal-service-header').length).toBe(1)
    expect($('.defra-internal-service-navigation__context').text().trim()).toBe(
      "{{ site.data.release.tag | default: 'Design System' }}"
    )
    expect($('.wrc-docs-layout').length).toBe(1)
    expect($('nav.wrc-docs-sidebar').length).toBe(1)
    expect($('article.wrc-docs-main > .wrc-docs-content').length).toBe(2)
    expect(layoutHtml).toContain('/assets/css/docs.css')
    expect($('body > footer.defra-internal-footer').length).toBe(1)
  })

  test('every docs markdown page has valid frontmatter and navigation links resolve', () => {
    const mdFiles = walkMarkdownFiles(docsDir)
    expect(mdFiles.length).toBeGreaterThanOrEqual(25)

    for (const filePath of mdFiles) {
      const content = fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
      const match = content.match(/^---\n([\s\S]*?)\n---\n/)
      expect(match, `${filePath} should have YAML frontmatter`).not.toBeNull()
      expect(match[1]).toContain('layout: default')
      expect(match[1]).toMatch(/^title:\s+\S+/m)
    }

    const navYml = fs.readFileSync(
      path.join(docsDir, '_data/navigation.yml'),
      'utf8'
    )
    const urls = [...navYml.matchAll(/^\s+url:\s+(\/\S*)$/gm)].map(
      (match) => match[1]
    )
    expect(urls.length).toBeGreaterThan(0)

    for (const url of urls) {
      const relativeTarget =
        url === '/'
          ? 'index.md'
          : url.endsWith('/')
            ? `${url.slice(1)}index.md`
            : `${url.slice(1).replace(/\.html$/, '')}.md`

      const targetPath = path.join(docsDir, relativeTarget)
      expect(
        fs.existsSync(targetPath),
        `Navigation URL ${url} should map to ${targetPath}`
      ).toBe(true)
    }
  })
})
