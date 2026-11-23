import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

import {
  buildDocs,
  buildDocsStyles,
  copyDocsImages,
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

  test('buildDocs builds CSS and copies images cleanly', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrc-docs-test-'))
    tempDirs.push(tempDir)

    const outputCssPath = path.join(tempDir, 'assets/css/docs.css')
    const destImagesDir = path.join(tempDir, 'assets/images')
    const releaseDataPath = path.join(tempDir, '_data/release.yml')
    const customCss = buildDocsStyles({ outputCssPath })
    expect(fs.existsSync(outputCssPath)).toBe(true)
    expect(customCss).toContain('.wrc-docs-layout')

    const isolatedResult = buildDocs({
      outputCssPath,
      destImagesDir,
      releaseDataPath
    })
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

    const defaultResult = buildDocs()
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
    expect($('article.wrc-docs-content').length).toBe(1)
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
