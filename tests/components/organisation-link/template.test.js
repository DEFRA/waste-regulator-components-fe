import { renderComponent } from '#test-helpers/component-helpers.js'

describe('Organisation Link Component', () => {
  test('Should render certificate link when item.id is present and organisationType is not compliance-schemes', () => {
    const $ = renderComponent('organisation-link', {
      routePrefix: '/certificates-of-compliance',
      organisationType: 'producers',
      activeTab: 'pending',
      complianceYear: 2025,
      item: {
        organisationId: 'org-1',
        organisationName: 'Acme Packaging',
        id: 'cert-1'
      }
    })

    const link = $('a.govuk-link')
    expect(link).toHaveLength(1)
    expect(link.text().trim()).toBe('Acme Packaging')
    expect(link.attr('href')).toBe(
      '/certificates-of-compliance/org-1/certificate/cert-1?type=producers&tab=pending'
    )
  })

  test('Should render statement link when item.id is present and organisationType is compliance-schemes', () => {
    const $ = renderComponent('organisation-link', {
      routePrefix: '/certificates-of-compliance',
      organisationType: 'compliance-schemes',
      activeTab: 'accepted',
      complianceYear: 2025,
      item: {
        organisationId: 'org-2',
        organisationName: 'Scheme Co',
        id: 'stmt-2'
      }
    })

    const link = $('a.govuk-link')
    expect(link).toHaveLength(1)
    expect(link.attr('href')).toBe(
      '/certificates-of-compliance/org-2/statement/stmt-2?type=compliance-schemes&tab=accepted'
    )
  })

  test('Should render organisation summary link when item.id is null', () => {
    const $ = renderComponent('organisation-link', {
      routePrefix: '/certificates-of-compliance',
      organisationType: 'producers',
      activeTab: 'not-submitted',
      complianceYear: 2025,
      item: {
        organisationId: 'org-3',
        organisationName: 'Unsubmitted Ltd',
        id: null
      }
    })

    const link = $('a.govuk-link')
    expect(link).toHaveLength(1)
    expect(link.attr('href')).toBe(
      '/certificates-of-compliance/org-3?obligationYear=2025&type=producers&tab=not-submitted'
    )
  })
})
