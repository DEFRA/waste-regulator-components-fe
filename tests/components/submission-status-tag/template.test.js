import { renderComponent } from '#test-helpers/component-helpers.js'

describe('Submission Status Tag Component', () => {
  test.each([
    ['Pending', 'govuk-tag--blue', 'Pending'],
    ['Accepted', 'govuk-tag--green', 'Accepted'],
    ['Cancelled', 'govuk-tag--yellow', 'Cancelled'],
    ['Not submitted', 'govuk-tag--grey', 'Not submitted']
  ])(
    'Should render %s status with class %s and text %s',
    (status, expectedClass, expectedText) => {
      const $ = renderComponent('submission-status-tag', {
        status,
        locale: 'en'
      })

      const tag = $('strong.govuk-tag')
      expect(tag).toHaveLength(1)
      expect(tag.hasClass(expectedClass)).toBe(true)
      expect(tag.text().trim()).toBe(expectedText)
    }
  )

  test('Should render fallback blue tag when status is unknown', () => {
    const $ = renderComponent('submission-status-tag', {
      status: 'Custom status',
      locale: 'en'
    })

    const tag = $('strong.govuk-tag')
    expect(tag).toHaveLength(1)
    expect(tag.hasClass('govuk-tag--blue')).toBe(true)
    expect(tag.text().trim()).toBe('Custom status')
  })

  test('Should render translated status when locale is cy', () => {
    const $ = renderComponent('submission-status-tag', {
      status: 'Accepted',
      locale: 'cy'
    })

    const tag = $('strong.govuk-tag')
    expect(tag).toHaveLength(1)
    expect(tag.hasClass('govuk-tag--green')).toBe(true)
    expect(tag.text().trim()).toBe('Wedi derbyn')
  })
})
