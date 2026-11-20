import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import yaml from 'js-yaml'
import { Liquid } from 'liquidjs'
import { marked } from 'marked'

import { buildDocs } from './build-docs.js'
import { DEFAULT_ROOT_DIR } from './sass-config.js'

export const DEFAULT_DOCS_PORT = 1999

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

export function rewriteMarkdownLinks(html) {
  return html.replaceAll(/href="([^"]+)"/g, (fullMatch, href) => {
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('#')
    ) {
      return fullMatch
    }

    const hashIndex = href.indexOf('#')
    const targetPath = hashIndex === -1 ? href : href.slice(0, hashIndex)
    const hash = hashIndex === -1 ? '' : href.slice(hashIndex)

    if (!targetPath.endsWith('.md')) {
      return fullMatch
    }

    let rewritten
    if (targetPath === 'index.md' || targetPath === './index.md') {
      rewritten = './'
    } else if (targetPath.endsWith('/index.md')) {
      rewritten = targetPath.slice(0, -'index.md'.length)
    } else {
      rewritten = `${targetPath.slice(0, -'.md'.length)}.html`
    }

    return `href="${rewritten}${hash}"`
  })
}

function isSafeFile(candidatePath, baseDir) {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(candidatePath)
  if (!resolvedTarget.startsWith(`${resolvedBase}${path.sep}`)) {
    return false
  }
  return fs.existsSync(resolvedTarget) && fs.statSync(resolvedTarget).isFile()
}

export function resolveDocsRoute(requestPath, docsDir) {
  const cleanPath = requestPath.startsWith('/')
    ? requestPath
    : `/${requestPath}`

  if (cleanPath === '/' || cleanPath === '/index.html') {
    const filePath = path.resolve(docsDir, 'index.md')
    return isSafeFile(filePath, docsDir) ? { filePath, pageUrl: '/' } : null
  }

  if (cleanPath.endsWith('/')) {
    const relativeDir = cleanPath.slice(1)
    const filePath = path.resolve(docsDir, relativeDir, 'index.md')
    return isSafeFile(filePath, docsDir)
      ? { filePath, pageUrl: cleanPath }
      : null
  }

  if (cleanPath.endsWith('.html')) {
    const relativeMd = `${cleanPath.slice(1, -'.html'.length)}.md`
    const filePath = path.resolve(docsDir, relativeMd)
    if (!isSafeFile(filePath, docsDir)) {
      return null
    }
    const pageUrl = relativeMd.endsWith('/index.md')
      ? `/${relativeMd.slice(0, -'index.md'.length)}`
      : cleanPath
    return { filePath, pageUrl }
  }

  const relativePath = cleanPath.slice(1)
  const dirIndex = path.resolve(docsDir, relativePath, 'index.md')
  if (isSafeFile(dirIndex, docsDir)) {
    return { redirect: `${cleanPath}/` }
  }

  const pageFile = path.resolve(docsDir, `${relativePath}.md`)
  if (isSafeFile(pageFile, docsDir)) {
    return { filePath: pageFile, pageUrl: `${cleanPath}.html` }
  }

  return null
}

export function loadSiteContext(docsDir) {
  const configPath = path.join(docsDir, '_config.yml')
  const navPath = path.join(docsDir, '_data/navigation.yml')
  const siteConfig = yaml.load(fs.readFileSync(configPath, 'utf8'))
  const navigation = yaml.load(fs.readFileSync(navPath, 'utf8'))

  return {
    ...siteConfig,
    baseurl: '',
    data: {
      navigation
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
    buildDocs({ rootDir })
  }

  const server = Hapi.server({ port, host })
  await server.register(Inert)

  const site = loadSiteContext(docsDir)
  const liquid = createLiquidEngine()

  server.route([
    {
      method: 'GET',
      path: '/assets/css/{param*}',
      handler: {
        directory: {
          path: path.join(docsDir, 'assets/css'),
          index: false
        }
      }
    },
    {
      method: 'GET',
      path: '/assets/images/{param*}',
      handler: {
        directory: {
          path: path.join(docsDir, 'assets/images'),
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
          return h.response('Page not found').code(404)
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
  const port = process.env.PORT
    ? Number.parseInt(process.env.PORT, 10)
    : DEFAULT_DOCS_PORT
  const server = await createDocsServer({ port })
  await server.start()
  console.log(`Documentation server running at: ${server.info.uri}`)
}
/* v8 ignore stop */
