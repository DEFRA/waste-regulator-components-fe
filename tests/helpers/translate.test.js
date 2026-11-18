import { translate } from './translate.js'

describe('Translation helper', () => {
  test('Should translate English string', () => {
    expect(translate('en', 'common.serviceName')).toBe(
      "pEPR: Regulators' Service"
    )
  })

  test('Should translate Welsh string', () => {
    expect(translate('cy', 'common.serviceName')).toBe(
      'pEPR: Gwasanaeth Rheolewyr'
    )
  })

  test('Should fallback to English when Welsh key is missing', () => {
    expect(translate('cy', 'compliance.components.statusTag.met')).toBe('Met')
  })

  test('Should replace missing param with empty string during interpolation', () => {
    expect(translate('en', 'common.cookieBanner.ariaLabel', {})).toBe(
      'Cookies on '
    )
  })

  test('Should interpolate parameters', () => {
    expect(
      translate('en', 'common.cookieBanner.ariaLabel', {
        serviceName: 'Test Service'
      })
    ).toBe('Cookies on Test Service')
  })

  test('Should return key when key is not found in dictionaries', () => {
    expect(translate('en', 'nonexistent.key')).toBe('nonexistent.key')
  })

  test('Should return key when value is not a string', () => {
    expect(translate('en', 'common')).toBe('common')
  })

  test('Should default to English when locale is unknown', () => {
    expect(translate('unknown-locale', 'common.serviceName')).toBe(
      "pEPR: Regulators' Service"
    )
  })
})
