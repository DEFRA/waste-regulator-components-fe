import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

import { resolveReleaseTag } from '../../scripts/build-docs.js'
import {
  DEFAULT_DOCS_PORT,
  createDocsServer,
  createLiquidEngine,
  loadSiteContext,
  parseDocsPort,
  parseFrontmatter,
  resolveDocsRoute,
  rewriteMarkdownLinks
} from '../../scripts/serve-docs.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')
const docsDir = path.join(repoRoot, 'docs')

describe('Documentation local server', () => {
  const tempDirs = []
  let server

  afterEach(async () => {
    if (server) {
      await server.stop()
      server = null
    }
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true })
    }
  })

  test('parseDocsPort validates PORT values and falls back to default when unset', () => {
    for (const unsetValue of [undefined, null, '', '   ']) {
      expect(parseDocsPort(unsetValue)).toBe(DEFAULT_DOCS_PORT)
    }

    expect(parseDocsPort('1')).toBe(1)
    expect(parseDocsPort('1999')).toBe(1999)
    expect(parseDocsPort(' 8080 ')).toBe(8080)
    expect(parseDocsPort('65535')).toBe(65535)
    expect(parseDocsPort(3000)).toBe(3000)

    for (const invalidValue of [
      '0',
      '65536',
      '-1',
      'abc',
      '8080px',
      '12.34',
      '9'.repeat(400)
    ]) {
      expect(() => parseDocsPort(invalidValue)).toThrow(RangeError)
      expect(() => parseDocsPort(invalidValue)).toThrow(/Invalid PORT/)
    }
  })

  test('parseFrontmatter parses YAML frontmatter and handles edge cases', () => {
    expect(
      parseFrontmatter('---\nlayout: default\ntitle: Header\n---\n\n# Header\n')
    ).toEqual({
      data: { layout: 'default', title: 'Header' },
      body: '\n# Header\n'
    })

    expect(
      parseFrontmatter('---\r\nlayout: default\r\ntitle: CRLF\r\n---\r\nBody')
    ).toEqual({
      data: { layout: 'default', title: 'CRLF' },
      body: 'Body'
    })

    expect(parseFrontmatter('---\ntitle: Only frontmatter\n---')).toEqual({
      data: { title: 'Only frontmatter' },
      body: ''
    })

    expect(parseFrontmatter('# Plain markdown\nNo frontmatter\n')).toEqual({
      data: {},
      body: '# Plain markdown\nNo frontmatter\n'
    })

    expect(parseFrontmatter('---\ntitle: Unclosed\n# Heading')).toEqual({
      data: {},
      body: '---\ntitle: Unclosed\n# Heading'
    })

    expect(parseFrontmatter('---\n---\n---invalid\nBody')).toEqual({
      data: {},
      body: '---\n---\n---invalid\nBody'
    })

    expect(parseFrontmatter('---\njust a scalar\n---\nBody')).toEqual({
      data: {},
      body: 'Body'
    })

    expect(parseFrontmatter('---\n- item1\n---\nBody')).toEqual({
      data: {},
      body: 'Body'
    })
  })

  test('rewriteMarkdownLinks rewrites relative .md links and leaves external or non-md links intact', () => {
    const input = [
      '<a href="https://example.com/guide.md">External</a>',
      '<a href="http://example.com/test.md">HTTP</a>',
      '<a href="mailto:test@example.com">Mail</a>',
      '<a href="#section">Anchor</a>',
      '<a href="/assets/css/docs.css">CSS</a>',
      '<a href="./header.md">Header</a>',
      '<a href="./header.md#usage">Header usage</a>',
      '<a href="index.md">Home</a>',
      '<a href="./index.md">Home dot</a>',
      '<a href="./components/index.md">Components</a>',
      '<a href="../components/index.md#top">Components top</a>'
    ].join(' ')

    const output = rewriteMarkdownLinks(input)

    expect(output).toContain('href="https://example.com/guide.md"')
    expect(output).toContain('href="http://example.com/test.md"')
    expect(output).toContain('href="mailto:test@example.com"')
    expect(output).toContain('href="#section"')
    expect(output).toContain('href="/assets/css/docs.css"')
    expect(output).toContain('href="./header.html"')
    expect(output).toContain('href="./header.html#usage"')
    expect(output).toContain('href="./"')
    expect(output).toContain('href="./components/"')
    expect(output).toContain('href="../components/#top"')
  })

  test('resolveDocsRoute resolves pages, directories, redirects, and blocks missing or unsafe paths', () => {
    expect(resolveDocsRoute('/', docsDir)).toEqual({
      filePath: path.join(docsDir, 'index.md'),
      pageUrl: '/'
    })
    expect(resolveDocsRoute('/index.html', docsDir)).toEqual({
      filePath: path.join(docsDir, 'index.md'),
      pageUrl: '/'
    })
    expect(resolveDocsRoute('/get-started/', docsDir)).toEqual({
      filePath: path.join(docsDir, 'get-started/index.md'),
      pageUrl: '/get-started/'
    })
    expect(resolveDocsRoute('/get-started/index.html', docsDir)).toEqual({
      filePath: path.join(docsDir, 'get-started/index.md'),
      pageUrl: '/get-started/'
    })
    expect(resolveDocsRoute('/get-started', docsDir)).toEqual({
      redirect: '/get-started/'
    })
    expect(resolveDocsRoute('/components/header.html', docsDir)).toEqual({
      filePath: path.join(docsDir, 'components/header.md'),
      pageUrl: '/components/header.html'
    })
    expect(resolveDocsRoute('contributing', docsDir)).toEqual({
      filePath: path.join(docsDir, 'contributing.md'),
      pageUrl: '/contributing.html'
    })

    expect(resolveDocsRoute('/components/missing.html', docsDir)).toBeNull()
    expect(resolveDocsRoute('/missing-dir/', docsDir)).toBeNull()
    expect(resolveDocsRoute('/missing-page', docsDir)).toBeNull()
    expect(resolveDocsRoute('/../README', docsDir)).toBeNull()
    expect(resolveDocsRoute('/../README.html', docsDir)).toBeNull()

    const emptyDocsDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'wrc-empty-docs-')
    )
    tempDirs.push(emptyDocsDir)
    expect(resolveDocsRoute('/', emptyDocsDir)).toBeNull()
  })

  test('createLiquidEngine registers relative_url filter', async () => {
    const engine = createLiquidEngine()
    const rendered = await engine.parseAndRender(
      "{{ '/css/a.css' | relative_url }}|{{ 'css/b.css' | relative_url }}|{{ missing | relative_url }}",
      {}
    )
    expect(rendered).toBe('/css/a.css|/css/b.css|/')
  })

  test('createDocsServer builds assets and serves documentation pages and static assets on port 1999', async () => {
    server = await createDocsServer()
    await server.initialize()

    expect(DEFAULT_DOCS_PORT).toBe(1999)
    expect(server.settings.port).toBe(1999)

    const homeRes = await server.inject({ method: 'GET', url: '/' })
    expect(homeRes.statusCode).toBe(200)
    expect(homeRes.headers['content-type']).toContain('text/html')

    const $home = cheerio.load(homeRes.payload)
    expect($home('.defra-internal-header').length).toBe(1)
    expect($home('.defra-internal-service-header').length).toBe(1)
    expect(
      $home('.defra-internal-service-navigation__context').text().trim()
    ).toBe(resolveReleaseTag())
    expect($home('body > footer.defra-internal-footer').length).toBe(1)
    expect(
      $home(
        '.govuk-service-navigation__link[aria-current="page"] strong'
      ).text()
    ).toBe('Home')
    expect(homeRes.payload).toContain('href="./get-started/installation.html"')
    expect(homeRes.payload).toContain('href="./components/"')
    expect(homeRes.payload).toContain('href="./running-locally.html"')

    const headerRes = await server.inject({
      method: 'GET',
      url: '/components/header.html'
    })
    expect(headerRes.statusCode).toBe(200)
    const $header = cheerio.load(headerRes.payload)
    expect(
      $header(
        '.govuk-service-navigation__link[aria-current="true"] strong'
      ).text()
    ).toBe('Components')
    expect(
      $header('.wrc-docs-sidebar__link--current[aria-current="page"]')
        .text()
        .trim()
    ).toBe('Header')
    expect(headerRes.payload).toContain('wrcHeader')

    const runningLocallyRes = await server.inject({
      method: 'GET',
      url: '/running-locally.html'
    })
    expect(runningLocallyRes.statusCode).toBe(200)
    const $runningLocally = cheerio.load(runningLocallyRes.payload)
    expect(
      $runningLocally('.wrc-docs-sidebar__link--current[aria-current="page"]')
        .text()
        .trim()
    ).toBe('Running documentation locally')
    expect(runningLocallyRes.payload).toContain('npm run docs:start')

    const redirectRes = await server.inject({
      method: 'GET',
      url: '/get-started'
    })
    expect(redirectRes.statusCode).toBe(302)
    expect(redirectRes.headers.location).toBe('/get-started/')

    const cssRes = await server.inject({
      method: 'GET',
      url: '/assets/css/docs.css'
    })
    expect(cssRes.statusCode).toBe(200)
    expect(cssRes.headers['content-type']).toContain('text/css')
    expect(cssRes.payload).toContain('arial, sans-serif')
    expect(cssRes.payload).toContain('#00a33b')

    const imgRes = await server.inject({
      method: 'GET',
      url: '/assets/images/govuk-crest.svg'
    })
    expect(imgRes.statusCode).toBe(200)
    expect(imgRes.payload).toContain('<svg')

    const missingRes = await server.inject({
      method: 'GET',
      url: '/does-not-exist.html'
    })
    expect(missingRes.statusCode).toBe(404)
  })

  test('createDocsServer falls back to default layout when page has no layout frontmatter', async () => {
    const tempDocsDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'wrc-serve-docs-fallback-')
    )
    tempDirs.push(tempDocsDir)

    fs.cpSync(
      path.join(docsDir, '_config.yml'),
      path.join(tempDocsDir, '_config.yml')
    )
    fs.cpSync(path.join(docsDir, '_data'), path.join(tempDocsDir, '_data'), {
      recursive: true
    })
    fs.writeFileSync(path.join(tempDocsDir, '_data/release.yml'), '')
    expect(loadSiteContext(tempDocsDir).data.release).toEqual({})
    fs.rmSync(path.join(tempDocsDir, '_data/release.yml'), { force: true })
    fs.cpSync(
      path.join(docsDir, '_layouts'),
      path.join(tempDocsDir, '_layouts'),
      {
        recursive: true
      }
    )
    fs.writeFileSync(
      path.join(tempDocsDir, 'index.md'),
      '# Minimal Page\n\nHello docs.\n'
    )

    server = await createDocsServer({
      docsDir: tempDocsDir,
      buildAssets: false,
      port: 0
    })
    await server.initialize()

    const res = await server.inject({ method: 'GET', url: '/' })
    expect(res.statusCode).toBe(200)
    expect(res.payload).toContain('<h1')
    expect(res.payload).toContain('Minimal Page')
    const $fallback = cheerio.load(res.payload)
    expect(
      $fallback('.defra-internal-service-navigation__context').text().trim()
    ).toBe('Design System')
  })
})
