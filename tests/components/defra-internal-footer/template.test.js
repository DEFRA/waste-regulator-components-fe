import { renderComponent } from '#test-helpers/component-helpers.js'

describe('Defra Internal Footer Component', () => {
  let $footer

  const renderFooter = (params) => {
    return renderComponent('defra-internal-footer', params, null, {
      macroName: 'defraInternalFooter'
    })
  }

  describe('Default', () => {
    beforeEach(() => {
      $footer = renderFooter({})
    })

    test('Should render footer component', () => {
      expect($footer('.defra-internal-footer')).toHaveLength(1)
    })

    test('Should render licence by default', () => {
      expect($footer('.govuk-footer__licence-logo')).toHaveLength(1)
      expect($footer('.govuk-footer__licence-description').text()).toContain(
        'Open Government Licence v3.0'
      )
    })

    test('Should render copyright by default', () => {
      expect($footer('.govuk-footer__copyright-logo').text()).toContain(
        '© Crown copyright'
      )
    })

    test('Should not render getHelp, meta, or links if not provided', () => {
      expect($footer('.govuk-heading-s').text()).not.toContain('Get help')
      expect($footer('.govuk-footer__inline-list')).toHaveLength(0)
    })
  })

  describe('With custom params', () => {
    beforeEach(() => {
      $footer = renderFooter({
        getHelp: {
          email: 'test@example.com',
          telephone: '01234 567890',
          hours: 'Monday to Friday, 9am to 5pm'
        },
        meta: 'This is a test service.',
        links: [
          { text: 'Privacy Policy', href: '/privacy' },
          { text: 'Terms and Conditions', href: '/terms' }
        ],
        licence: false,
        copyright: false
      })
    })

    test('Should not render licence if licence is false', () => {
      expect($footer('.govuk-footer__licence-logo')).toHaveLength(0)
    })

    test('Should not render copyright if copyright is false', () => {
      expect($footer('.govuk-footer__copyright-logo')).toHaveLength(0)
    })

    test('Should render getHelp block', () => {
      const getHelpText = $footer('h2:contains("Get help")').parent().text()
      expect(getHelpText).toContain('Get help')
      expect(getHelpText).toContain('test@example.com')
      expect(getHelpText).toContain('01234 567890')
      expect(getHelpText).toContain('Monday to Friday, 9am to 5pm')
    })

    test('Should render meta text', () => {
      expect($footer('.govuk-footer__meta-item--grow').text()).toContain(
        'This is a test service.'
      )
    })

    test('Should render links', () => {
      const listItems = $footer('.govuk-footer__inline-list-item a')
      expect(listItems).toHaveLength(2)

      expect(listItems.eq(0).text()).toBe('Privacy Policy')
      expect(listItems.eq(0).attr('href')).toBe('/privacy')

      expect(listItems.eq(1).text()).toBe('Terms and Conditions')
      expect(listItems.eq(1).attr('href')).toBe('/terms')
    })
  })

  describe('Optional fields, labels and overrides', () => {
    test('Should render default getHelp labels when custom labels are omitted', () => {
      const $ = renderFooter({
        getHelp: {
          email: 'help@example.com',
          telephone: '01234 000000',
          hours: '9am to 5pm'
        }
      })

      expect($('h2.govuk-heading-s').text().trim()).toBe('Get help')
      expect($('.govuk-body-s').eq(0).text()).toContain('Email:')
      expect($('.govuk-body-s').eq(1).text()).toContain('Telephone:')
      expect($('.govuk-body-s').eq(2).text()).toBe('9am to 5pm')
    })

    test('Should support custom supportLinksLabel, OGL text and Crown copyright', () => {
      const $ = renderFooter({
        links: [{ text: 'Accessibility', href: '/a11y' }],
        supportLinksLabel: 'Custom Support Links',
        oglPrefix: 'Prefix OGL',
        oglLink: 'Link OGL',
        oglSuffix: 'Suffix OGL',
        crownCopyright: 'Custom Copyright'
      })

      expect($('.govuk-visually-hidden').text()).toBe('Custom Support Links')
      expect($('.govuk-footer__licence-description').text()).toContain('Prefix OGL')
      expect($('.govuk-footer__licence-description a').text()).toBe('Link OGL')
      expect($('.govuk-footer__licence-description').text()).toContain('Suffix OGL')
      expect($('.govuk-footer__copyright-logo').text()).toContain('Custom Copyright')
    })
  })
})
