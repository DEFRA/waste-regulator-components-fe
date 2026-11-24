import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import yaml from 'js-yaml'
import { Liquid } from 'liquidjs'
import { marked } from 'marked'

import { buildDocs, parseFrontmatter } from './build-docs.js'
import { DEFAULT_ROOT_DIR } from './sass-config.js'

export const DEFAULT_DOCS_PORT = 1999

const MIN_PORT = 1
const MAX_PORT = 65535
const PORT_PATTERN = /^\d+$/
const HTTP_NOT_FOUND = 404
const EXTERNAL_LINK_PREFIXES = ['http://', 'https://', 'mailto:', '#']

/**
 * Parses and validates a PORT environment variable value.
 * @param {string | number | undefined} rawPort
 * @returns {number}
 */
export function parseDocsPort(rawPort) {
  const trimmed =
    rawPort === undefined || rawPort === null ? '' : String(rawPort).trim()

  if (!trimmed) {
    return DEFAULT_DOCS_PORT
  }

  const port = PORT_PATTERN.test(trimmed) ? Number(trimmed) : Number.NaN
  if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT) {
    throw new RangeError(
      `Invalid PORT "${rawPort}": expected an integer between ${MIN_PORT} and ${MAX_PORT}`
    )
  }

  return port
}

function isExternalOrAnchor(href) {
  return EXTERNAL_LINK_PREFIXES.some((prefix) => href.startsWith(prefix))
}

function rewriteMarkdownTarget(targetPath) {
  if (targetPath === 'index.md' || targetPath === './index.md') {
    return './'
  }
  if (targetPath.endsWith('/index.md')) {
    return targetPath.slice(0, -'index.md'.length)
  }
  return `${targetPath.slice(0, -'.md'.length)}.html`
}

function rewriteHref(fullMatch, href) {
  if (isExternalOrAnchor(href)) {
    return fullMatch
  }

  const hashIndex = href.indexOf('#')
  const targetPath = hashIndex === -1 ? href : href.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : href.slice(hashIndex)

  if (!targetPath.endsWith('.md')) {
    return fullMatch
  }

  return `href="${rewriteMarkdownTarget(targetPath)}${hash}"`
}

export function rewriteMarkdownLinks(html) {
  return html.replaceAll(/href="([^"]+)"/g, rewriteHref)
}

function isSafeFile(candidatePath, baseDir) {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(candidatePath)
  if (!resolvedTarget.startsWith(`${resolvedBase}${path.sep}`)) {
    return false
  }
  return fs.existsSync(resolvedTarget) && fs.statSync(resolvedTarget).isFile()
}

function resolveSafeRoute(docsDir, relativeFilePath, pageUrl) {
  const filePath = path.resolve(docsDir, relativeFilePath)
  return isSafeFile(filePath, docsDir) ? { filePath, pageUrl } : null
}

function resolveHtmlRoute(cleanPath, docsDir) {
  const relativeMd = `${cleanPath.slice(1, -'.html'.length)}.md`
  const pageUrl = relativeMd.endsWith('/index.md')
    ? `/${relativeMd.slice(0, -'index.md'.length)}`
    : cleanPath
  return resolveSafeRoute(docsDir, relativeMd, pageUrl)
}

function resolveBareRoute(cleanPath, docsDir) {
  const relativePath = cleanPath.slice(1)
  const dirIndex = path.resolve(docsDir, relativePath, 'index.md')
  if (isSafeFile(dirIndex, docsDir)) {
    return { redirect: `${cleanPath}/` }
  }
  return resolveSafeRoute(docsDir, `${relativePath}.md`, `${cleanPath}.html`)
}

export function resolveDocsRoute(requestPath, docsDir) {
  const cleanPath = requestPath.startsWith('/')
    ? requestPath
    : `/${requestPath}`

  if (cleanPath === '/' || cleanPath === '/index.html') {
    return resolveSafeRoute(docsDir, 'index.md', '/')
  }

  if (cleanPath.endsWith('/')) {
    const relativeIndex = path.join(cleanPath.slice(1), 'index.md')
    return resolveSafeRoute(docsDir, relativeIndex, cleanPath)
  }

  if (cleanPath.endsWith('.html')) {
    return resolveHtmlRoute(cleanPath, docsDir)
  }

  return resolveBareRoute(cleanPath, docsDir)
}

export function loadSiteContext(docsDir) {
  const configPath = path.join(docsDir, '_config.yml')
  const navPath = path.join(docsDir, '_data/navigation.yml')
  const releasePath = path.join(docsDir, '_data/release.yml')
  const siteConfig = yaml.load(fs.readFileSync(configPath, 'utf8'))
  const navigation = yaml.load(fs.readFileSync(navPath, 'utf8'))
  const release = fs.existsSync(releasePath)
    ? (yaml.load(fs.readFileSync(releasePath, 'utf8')) ?? {})
    : {}
  const examplesPath = path.join(docsDir, '_data/examples.json')
  const examples = fs.existsSync(examplesPath)
    ? JSON.parse(fs.readFileSync(examplesPath, 'utf8'))
    : {}

  return {
    ...siteConfig,
    baseurl: '',
    data: {
      navigation,
      release,
      examples
    }
  }
}

export function createLiquidEngine() {
  const engine = new Liquid({ strictFilters: true })
  engine.registerFilter('relative_url', (value) => {
    const str = String(value ?? '')
    return str.startsWith('/') ? str : `/${str}`
  })
  return engine
}

export async function createDocsServer(options = {}) {
  const rootDir = options.rootDir ?? DEFAULT_ROOT_DIR
  const docsDir = options.docsDir ?? path.join(rootDir, 'docs')
  const port = options.port ?? DEFAULT_DOCS_PORT
  const host = options.host ?? 'localhost'

  if (options.buildAssets !== false) {
    await buildDocs({
      rootDir,
      outputCssPath: path.join(docsDir, 'assets/css/docs.css'),
      destImagesDir: path.join(docsDir, 'assets/images'),
      releaseDataPath: path.join(docsDir, '_data/release.yml'),
      destJsDir: path.join(docsDir, 'assets/js'),
      examplesDir: path.join(docsDir, '_examples'),
      outputDataPath: path.join(docsDir, '_data/examples.json'),
      outputPagesDir: path.join(docsDir, 'assets/examples')
    })
  }

  // Docs never read cookies, so other localhost apps' cookies can't cause a 400
  const server = Hapi.server({
    port,
    host,
    routes: { state: { parse: false } }
  })
  await server.register(Inert)

  const site = loadSiteContext(docsDir)
  const liquid = createLiquidEngine()

  server.route([
    {
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: path.join(docsDir, 'assets'),
          index: false
        }
      }
    },
    {
      method: 'GET',
      path: '/{path*}',
      async handler(request, h) {
        const resolved = resolveDocsRoute(request.path, docsDir)
        if (!resolved) {
          return h.response('Page not found').code(HTTP_NOT_FOUND)
        }

        if (resolved.redirect) {
          return h.redirect(resolved.redirect)
        }

        const rawMarkdown = fs.readFileSync(resolved.filePath, 'utf8')
        const { data: pageData, body } = parseFrontmatter(rawMarkdown)
        const htmlBody = rewriteMarkdownLinks(
          await marked.parse(body, { gfm: true })
        )

        const layoutName = path.basename(pageData.layout || 'default')
        const layoutPath = path.join(docsDir, '_layouts', `${layoutName}.html`)
        const layoutSource = fs.readFileSync(layoutPath, 'utf8')
        const rendered = await liquid.parseAndRender(layoutSource, {
          site,
          page: { ...pageData, url: resolved.pageUrl },
          content: htmlBody
        })

        return h.response(rendered).type('text/html; charset=utf-8')
      }
    }
  ])

  return server
}

/* v8 ignore start */
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = parseDocsPort(process.env.PORT)
  const server = await createDocsServer({ port })
  await server.start()
  console.log(`Documentation server running at: ${server.info.uri}`)
}
/* v8 ignore stop */
