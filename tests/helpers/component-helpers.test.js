import { renderComponent, nunjucksTestEnv } from './component-helpers.js'

describe('Component helpers', () => {
  test('Should render component with default macroName', () => {
    const $ = renderComponent('heading', { text: 'Test Heading' })
    expect($('[data-testid="wrc-heading-title"]').text().trim()).toBe(
      'Test Heading'
    )
  })

  test('Should render component with custom macroName and callBlock', () => {
    const $ = renderComponent(
      'heading',
      { text: 'Custom Macro' },
      '<span>Extra Content</span>',
      { macroName: 'wrcHeading' }
    )
    expect($('[data-testid="wrc-heading-title"]').text().trim()).toBe(
      'Custom Macro'
    )
  })

  test('Should have govukRebrand, t, and localeUrl globals registered', () => {
    expect(nunjucksTestEnv.getGlobal('govukRebrand')).toBe(true)
    expect(typeof nunjucksTestEnv.getGlobal('t')).toBe('function')
    expect(typeof nunjucksTestEnv.getGlobal('localeUrl')).toBe('function')
    expect(nunjucksTestEnv.getGlobal('localeUrl')('/test-path')).toBe('/test-path')
  })
})
