import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_ROOT_DIR,
  DEFRA_VARIABLES_SCSS,
  compileDesignSystemScss,
  createGovukForwardScss,
  createSassOptions
} from '../../scripts/sass-config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')

describe('Shared Sass configuration helper', () => {
  test('DEFRA_VARIABLES_SCSS defines expected Defra internal brand variables', () => {
    expect(DEFRA_VARIABLES_SCSS).toContain('$defra-internal-brand: #00a33b;')
    expect(DEFRA_VARIABLES_SCSS).toContain(
      '$defra-internal-footer-link: #3b3b3b;'
    )
    expect(DEFRA_VARIABLES_SCSS).toContain('$defra-internal-nav-background:')
    expect(DEFRA_VARIABLES_SCSS).toContain('$defra-internal-link: #00703c;')
    expect(DEFRA_VARIABLES_SCSS).toContain('$defra-internal-link-hover:')
  })

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
    expect(customImporter.canonicalize('variables')?.href).toBe(
      'custom:variables'
    )
    expect(customImporter.canonicalize('govuk-frontend')?.href).toBe(
      'custom:govuk-frontend'
    )
    expect(customImporter.canonicalize('some-other-module')).toBeNull()

    expect(customImporter.load(new URL('custom:variables'))).toEqual({
      contents: DEFRA_VARIABLES_SCSS,
      syntax: 'scss'
    })
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
      @use "dist/index" as *;
    `)

    expect(defaultCss).toContain('arial, sans-serif')
    expect(defaultCss).not.toContain('GDS Transport')
    expect(defaultCss).toContain('.defra-internal-header')
    expect(defaultCss).toContain('.defra-internal-footer')
    expect(defaultCss).toContain('url("/assets/images/govuk-crest.svg")')

    const relativeCss = compileDesignSystemScss(
      `
      @use "govuk-frontend" as *;
      @use "dist/index" as *;
    `,
      { assetsPath: '../' }
    )

    expect(relativeCss).toContain('url("../images/govuk-crest.svg")')
    expect(relativeCss).not.toContain('url("/assets/images/')
  })
})
