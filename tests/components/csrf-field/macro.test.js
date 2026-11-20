import { load } from 'cheerio'
import { nunjucksTestEnv } from '#test-helpers/component-helpers.js'

describe('CSRF Field Component', () => {
  test('Should render hidden input with default id', () => {
    const html = nunjucksTestEnv.renderString(
      '{% from "wrc/components/csrf-field/macro.njk" import wrcCsrfField %}{{ wrcCsrfField("token-123") }}'
    )
    const $ = load(html)
    const input = $('input')

    expect(input).toHaveLength(1)
    expect(input.attr('id')).toBe('csrf-crumb')
    expect(input.attr('type')).toBe('hidden')
    expect(input.attr('name')).toBe('CSRFToken')
    expect(input.attr('value')).toBe('token-123')
  })

  test('Should render hidden input with custom id', () => {
    const html = nunjucksTestEnv.renderString(
      '{% from "wrc/components/csrf-field/macro.njk" import wrcCsrfField %}{{ wrcCsrfField("token-456", "custom-crumb-id") }}'
    )
    const $ = load(html)
    const input = $('input')

    expect(input).toHaveLength(1)
    expect(input.attr('id')).toBe('custom-crumb-id')
    expect(input.attr('value')).toBe('token-456')
  })
})
