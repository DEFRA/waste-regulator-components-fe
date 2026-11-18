import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as sass from 'sass-embedded'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')

const mockVariablesScss = `
@use "sass:color";
$defra-internal-brand: #00a33b;
$defra-internal-footer-link: #3b3b3b;
$defra-internal-nav-background: color.mix(#ffffff, $defra-internal-brand, 92%);
$defra-internal-link: #00703c;
$defra-internal-link-hover: color.mix(#000000, $defra-internal-link, 40%);
`

describe('Component stylesheets', () => {
  test('Should compile dist/index.scss with govuk-frontend without errors', () => {
    const result = sass.compileString(
      `
      @use "dist/index" as *;
    `,
      {
        loadPaths: [
          rootDir,
          path.join(rootDir, 'node_modules'),
          path.join(rootDir, 'node_modules/govuk-frontend/dist')
        ],
        importers: [
          new sass.NodePackageImporter(rootDir),
          {
            canonicalize(url) {
              if (url === 'variables' || url === 'govuk-frontend') {
                return new URL(`custom:${url}`)
              }
              return null
            },
            load(canonicalUrl) {
              if (canonicalUrl.href === 'custom:variables') {
                return {
                  contents: mockVariablesScss,
                  syntax: 'scss'
                }
              }
              if (canonicalUrl.href === 'custom:govuk-frontend') {
                return {
                  contents: '@forward "pkg:govuk-frontend";',
                  syntax: 'scss'
                }
              }
              return null
            }
          }
        ],
        quietDeps: true
      }
    )

    expect(result.css).toContain('.defra-internal-header')
    expect(result.css).toContain('.defra-internal-footer')
    expect(result.css).toContain('.defra-internal-service-header')
    expect(result.css).toContain('.govuk-cookie-banner')
    expect(result.css).toContain('.wrc-heading')
    expect(result.css).toContain('[aria-sort] a')
    expect(result.css).toContain('.govuk-button-group > form')
    expect(result.css).toContain('.moj-scrollable-pane .govuk-table__header')
    expect(result.css).toContain('.wrc-notification-banner--cancelled')
    expect(result.css).toContain('.moj-sub-navigation__list')
    expect(result.css).toContain('.moj-sub-navigation__item')
    expect(result.css).toContain('.moj-sub-navigation__link[aria-current=page]')
    expect(result.css).toContain('.v3-compact-table thead')
  })

  test.each([
    ['components aggregate', 'dist/components'],
    ['button-group', 'dist/components/button-group'],
    ['defra-internal-cookie-banner', 'dist/components/defra-internal-cookie-banner'],
    ['defra-internal-footer', 'dist/components/defra-internal-footer'],
    ['defra-internal-header', 'dist/components/defra-internal-header'],
    ['heading', 'dist/components/heading'],
    ['moj-scrollable-pane', 'dist/components/moj-scrollable-pane'],
    ['notification-banner', 'dist/components/notification-banner'],
    ['producer-subnavigation', 'dist/components/producer-subnavigation'],
    ['service-navigation', 'dist/components/service-navigation'],
    ['sorting-column-header', 'dist/components/sorting-column-header'],
    ['tab-panel', 'dist/components/tab-panel']
  ])('Should compile %s stylesheet individually', (_name, importPath) => {
    const result = sass.compileString(
      `
      @use "${importPath}" as *;
    `,
      {
        loadPaths: [
          rootDir,
          path.join(rootDir, 'node_modules'),
          path.join(rootDir, 'node_modules/govuk-frontend/dist')
        ],
        importers: [
          new sass.NodePackageImporter(rootDir),
          {
            canonicalize(url) {
              if (url === 'variables' || url === 'govuk-frontend') {
                return new URL(`custom:${url}`)
              }
              return null
            },
            load(canonicalUrl) {
              if (canonicalUrl.href === 'custom:variables') {
                return {
                  contents: mockVariablesScss,
                  syntax: 'scss'
                }
              }
              if (canonicalUrl.href === 'custom:govuk-frontend') {
                return {
                  contents: '@forward "pkg:govuk-frontend";',
                  syntax: 'scss'
                }
              }
              return null
            }
          }
        ],
        quietDeps: true
      }
    )

    expect(result.css.length).toBeGreaterThan(0)
  })
})
