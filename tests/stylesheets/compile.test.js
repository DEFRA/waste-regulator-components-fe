import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as sass from 'sass-embedded'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')

function compileWithRootLoadPath(source) {
  return sass.compileString(source, {
    loadPaths: [rootDir],
    quietDeps: true
  })
}

describe('Component stylesheets', () => {
  test('Should compile dist/index.scss without custom importers', () => {
    const result = compileWithRootLoadPath(`
      @use "dist/index" as *;
    `)

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
    expect(result.css).toContain('.v3-compact-table tbody th')
    expect(result.css).not.toContain('.govuk-table tbody th')
  })

  test('Should allow overriding Defra variables via @use ... with (...)', () => {
    const result = compileWithRootLoadPath(`
      @use "dist/index" as * with (
        $defra-internal-brand: #123456
      );
    `)

    expect(result.css).toContain('border-bottom: 8px solid #123456')
    expect(result.css).not.toContain('border-bottom: 8px solid #00a33b')
  })

  test('Should compile in a GOV.UK Prototype Kit v13 build alongside govuk-frontend', () => {
    const result = compileWithRootLoadPath(`
      $govuk-prototype-kit-major-version: 13;
      $govuk-extensions-url-context: "/plugin-assets";
      @import "node_modules/govuk-frontend/dist/govuk-prototype-kit/init";
      @import "dist/index";
    `)

    expect(result.css).toContain('.defra-internal-header')
    expect(result.css).toContain('.defra-internal-footer')
    expect(result.css).toContain('.defra-internal-service-header')
    expect(result.css).toContain('.govuk-button-group > form')
    expect(result.css).toContain('#00a33b')
    expect(result.css).toContain(
      'url("/plugin-assets/govuk-frontend/dist/govuk/assets/images/govuk-crest.svg")'
    )
    expect(result.css).toContain('.v3-compact-table tbody th')
    expect(result.css).not.toContain('.govuk-table tbody th')

    const customisedResult = compileWithRootLoadPath(`
      $govuk-prototype-kit-major-version: 13;
      $govuk-extensions-url-context: "/plugin-assets";
      $govuk-font-family: (arial, sans-serif);
      $defra-internal-brand: #123456;
      @import "node_modules/govuk-frontend/dist/govuk-prototype-kit/init";
      @import "dist/index";
    `)

    expect(customisedResult.css).toContain('arial, sans-serif')
    expect(customisedResult.css).not.toContain('GDS Transport')
    expect(customisedResult.css).toContain('border-bottom: 8px solid #123456')
    expect(customisedResult.css).not.toContain(
      'border-bottom: 8px solid #00a33b'
    )
  })

  test.each([
    ['root entry (dist/index)', 'dist/index'],
    ['namespace entry (dist/wrc/index)', 'dist/wrc/index'],
    ['variables module (dist/wrc/variables)', 'dist/wrc/variables'],
    ['components aggregate', 'dist/wrc/components'],
    ['button-group', 'dist/wrc/components/button-group'],
    ['cookie-banner', 'dist/wrc/components/cookie-banner'],
    ['footer', 'dist/wrc/components/footer'],
    ['header', 'dist/wrc/components/header'],
    ['heading', 'dist/wrc/components/heading'],
    ['moj-scrollable-pane', 'dist/wrc/components/moj-scrollable-pane'],
    ['notification-banner', 'dist/wrc/components/notification-banner'],
    ['subnavigation', 'dist/wrc/components/subnavigation'],
    ['service-header', 'dist/wrc/components/service-header'],
    ['sorting-column-header', 'dist/wrc/components/sorting-column-header'],
    ['tab-panel', 'dist/wrc/components/tab-panel']
  ])('Should compile %s stylesheet individually', (_name, importPath) => {
    const result = compileWithRootLoadPath(`
      @use "${importPath}" as *;
      .probe {
        content: "compiled";
      }
    `)

    expect(result.css.length).toBeGreaterThan(0)
  })
})
