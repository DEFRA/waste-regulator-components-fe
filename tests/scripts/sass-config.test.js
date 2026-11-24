import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_ROOT_DIR,
  compileDesignSystemScss,
  createGovukForwardScss,
  createSassOptions
} from '../../scripts/sass-config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')

describe('Shared Sass configuration helper', () => {
  test('createGovukForwardScss sets arial font family with optional assetsPath', () => {
    expect(createGovukForwardScss()).toBe(
      '@forward "pkg:govuk-frontend" with ($govuk-font-family: (arial, sans-serif));'
    )

    expect(createGovukForwardScss({ assetsPath: '../' })).toBe(
      '@forward "pkg:govuk-frontend" with ($govuk-font-family: (arial, sans-serif), $govuk-assets-path: "../");'
    )
  })

  test('createSassOptions builds load paths and handles custom importer URLs', () => {
    expect(DEFAULT_ROOT_DIR).toBe(repoRoot)

    const defaultOptions = createSassOptions()
    expect(defaultOptions.quietDeps).toBe(true)
    expect(defaultOptions.loadPaths).toEqual([
      repoRoot,
      path.join(repoRoot, 'node_modules'),
      path.join(repoRoot, 'node_modules/govuk-frontend/dist')
    ])

    const customOptions = createSassOptions({
      rootDir: repoRoot,
      assetsPath: '../',
      extraLoadPaths: ['/tmp/custom-scss']
    })
    expect(customOptions.loadPaths[0]).toBe('/tmp/custom-scss')

    const customImporter = customOptions.importers[1]
    expect(customImporter.canonicalize('govuk-frontend')?.href).toBe(
      'custom:govuk-frontend'
    )
    expect(customImporter.canonicalize('some-other-module')).toBeNull()

    expect(customImporter.load(new URL('custom:govuk-frontend'))).toEqual({
      contents:
        '@forward "pkg:govuk-frontend" with ($govuk-font-family: (arial, sans-serif), $govuk-assets-path: "../");',
      syntax: 'scss'
    })
    expect(customImporter.load(new URL('custom:unknown'))).toBeNull()
  })

  test('compileDesignSystemScss compiles govuk-frontend and dist components', () => {
    const defaultCss = compileDesignSystemScss(`
      @use "govuk-frontend" as *;
      @use "dist/wrc/index" as *;
    `)

    expect(defaultCss).toContain('arial, sans-serif')
    expect(defaultCss).not.toContain('GDS Transport')
    expect(defaultCss).toContain('.defra-internal-header')
    expect(defaultCss).toContain('.defra-internal-footer')
    expect(defaultCss).toContain('url("/assets/images/govuk-crest.svg")')

    const relativeCss = compileDesignSystemScss(
      `
      @use "govuk-frontend" as *;
      @use "dist/wrc/index" as *;
    `,
      { assetsPath: '../' }
    )

    expect(relativeCss).toContain('url("../images/govuk-crest.svg")')
    expect(relativeCss).not.toContain('url("/assets/images/')
  })
})
