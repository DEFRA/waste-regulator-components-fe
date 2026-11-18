import { renderComponent } from '#test-helpers/component-helpers.js'

describe('Status Tag Component', () => {
  test.each([
    [true, 'govuk-tag--green', 'Pending'],
    [false, 'govuk-tag--red', 'Rejected']
  ])('When value = %s', (value, expectedClass, expectedText) => {
    const $ = renderComponent('status-tag', {
      trueText: 'Pending',
      falseText: 'Rejected',
      value
    })

    expect($('strong').hasClass(expectedClass)).toBe(true)
    expect($('strong').text().trim()).toBe(expectedText)
  })

  test('renders bare "No data" text (no tag) when value is null', () => {
    const $ = renderComponent('status-tag', {
      trueText: 'Pending',
      falseText: 'Rejected',
      value: null
    })

    expect($('strong')).toHaveLength(0)
    expect($.root().text().trim()).toBe('No data')
  })

  test('renders custom noDataText when provided and value is null', () => {
    const $ = renderComponent('status-tag', {
      value: null,
      noDataText: 'Custom missing data'
    })

    expect($.root().text().trim()).toBe('Custom missing data')
  })

  test('renders Welsh noData fallback when locale is cy and noDataText is omitted', () => {
    const $ = renderComponent('status-tag', {
      value: null,
      locale: 'cy'
    })

    expect($.root().text().trim()).toBe('Dim data')
  })

  test('applies custom fontSize class when provided', () => {
    const $true = renderComponent('status-tag', {
      value: true,
      trueText: 'Met',
      fontSize: 'govuk-!-font-size-19'
    })
    expect($true('strong').hasClass('govuk-!-font-size-19')).toBe(true)

    const $false = renderComponent('status-tag', {
      value: false,
      falseText: 'Not met',
      fontSize: 'govuk-!-font-size-14'
    })
    expect($false('strong').hasClass('govuk-!-font-size-14')).toBe(true)
  })
})
