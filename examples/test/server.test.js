import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as cheerio from 'cheerio'
import { createServer } from '../src/server.js'
import { parseSort } from '../src/routes/home.js'

describe('Example Application Hapi Server', () => {
  let server

  beforeAll(async () => {
    server = await createServer({ port: 0 })
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('parseSort helper', () => {
    it('returns default column and direction when sort param is omitted', () => {
      expect(parseSort()).toEqual({ column: 'organisationName', direction: 'asc' })
      expect(parseSort('')).toEqual({ column: 'organisationName', direction: 'asc' })
    })

    it('parses valid sort column and direction', () => {
      expect(parseSort('obligationYear[desc]')).toEqual({ column: 'obligationYear', direction: 'desc' })
      expect(parseSort('organisationName[asc]')).toEqual({ column: 'organisationName', direction: 'asc' })
    })

    it('falls back to default if format is invalid', () => {
      expect(parseSort('invalid_format')).toEqual({ column: 'organisationName', direction: 'asc' })
    })
  })

  describe('GET / (Home Dashboard)', () => {
    it('renders the complete dashboard with all Defra components', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)

      // 1. Defra internal header
      expect($('.defra-internal-header').length).toBe(1)
      expect($('.defra-internal-header__logo').text()).toContain('Department for Environment')
      expect($('.defra-internal-header__account-menu').text()).toContain('Jane Doe')

      // 2. Defra internal service header
      expect($('.defra-internal-service-header').length).toBe(1)
      expect($('.govuk-service-navigation__service-name').text()).toContain('Waste Tracking Service')
      expect($('.defra-internal-service-header').text()).toContain('Environment Agency')

      // 3. Language switcher
      expect($('.defra-internal-language-bar').length).toBe(1)

      // 4. Defra internal cookie banner (initial unprompted state)
      expect($('.govuk-cookie-banner').length).toBe(1)
      expect($('.govuk-cookie-banner__heading').text()).toContain('Cookies on Waste Tracking Service')

      // 5. WRC Heading
      expect($('[data-testid="wrc-heading-title"]').text().trim()).toBe('Waste tracking compliance dashboard')
      expect($('[data-testid="wrc-heading-caption"]').text().trim()).toBe('Producer & Scheme Records 2026')

      // 6. Sorting column headers
      expect($('th[aria-sort]').length).toBeGreaterThanOrEqual(1)
      expect($('th[aria-sort="ascending"]').text()).toContain('Organisation')

      // 7. Organisation links
      expect($('a.govuk-link--no-visited-state').length).toBeGreaterThanOrEqual(1)
      expect($('a:contains("Acme Recycling Ltd")').attr('href')).toContain('/organisations/ORG-001/statement/DOC-101')
      expect($('a:contains("BioPackaging Solutions")').attr('href')).toContain('/organisations/ORG-002?obligationYear=2026')

      // 8. Status tags
      expect($('.govuk-tag--green:contains("Verified")').length).toBeGreaterThanOrEqual(1)
      expect($('.govuk-tag--red:contains("Unverified")').length).toBeGreaterThanOrEqual(1)
      expect($('td:contains("Pending review")').length).toBeGreaterThanOrEqual(1)

      // 9. Submission status tags
      expect($('.govuk-tag--green:contains("Accepted")').length).toBeGreaterThanOrEqual(1)
      expect($('.govuk-tag--blue:contains("Pending")').length).toBeGreaterThanOrEqual(1)
      expect($('.govuk-tag--grey:contains("Not submitted")').length).toBeGreaterThanOrEqual(1)
      expect($('.govuk-tag--yellow:contains("Cancelled")').length).toBeGreaterThanOrEqual(1)

      // 10. Pagination
      expect($('.govuk-pagination').length).toBe(1)
      expect($('.govuk-pagination__item--current').text().trim()).toBe('1')

      // 11. CSRF field in button-group form
      expect($('.govuk-button-group > form #example-form-csrf').val()).toBe('demo-csrf-token')

      // 12. Search, subnavigation, scrollable pane, compact table & cancelled notification banner
      expect($('search.moj-search').length).toBe(1)
      expect($('input[type="hidden"][name="type"]').val()).toBe('all')
      expect($('nav.moj-sub-navigation a.moj-sub-navigation__link')).toHaveLength(3)
      expect($('nav.moj-sub-navigation a[aria-current="page"]').text().trim()).toBe('All organisations')
      expect($('ul.govuk-tabs__list a.govuk-tabs__tab')).toHaveLength(3)
      expect($('li.govuk-tabs__list-item--selected a.govuk-tabs__tab[aria-current="page"]')).toHaveLength(1)
      expect($('.moj-scrollable-pane table.govuk-table.v3-compact-table').length).toBe(1)
      expect($('.govuk-notification-banner.wrc-notification-banner--cancelled').length).toBe(1)

      // 13. Defra internal footer
      expect($('.defra-internal-footer').length).toBe(1)
      expect($('.defra-internal-footer').text()).toContain('Get help')
      expect($('.defra-internal-footer').text()).toContain('waste-tracking-support@defra.gov.uk')
      expect($('.defra-internal-footer').text()).toContain('Open Government Licence v3.0')
      expect($('.govuk-footer__copyright-logo').text()).toContain('Crown copyright')
    })

    it('supports Welsh language toggle via query parameter', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/?lang=cy'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('.govuk-tag--green:contains("Wedi derbyn")').length).toBeGreaterThanOrEqual(1)
      expect($('.govuk-tag--blue').text()).toContain('Ar y gweill')
      expect($('search.moj-search input[type="hidden"][name="lang"]').val()).toBe('cy')
    })

    it('supports search query parameter filtering', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/?search=acme'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('input#search').val()).toBe('acme')
      expect($('tbody tr')).toHaveLength(1)
      expect($('tbody').text()).toContain('Acme Recycling Ltd')
    })

    it('supports subnavigation organisation type filtering', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/?type=compliance-schemes'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('nav.moj-sub-navigation a[aria-current="page"]').text().trim()).toBe('Compliance schemes')
      expect($('tbody tr')).toHaveLength(2)
      expect($('tbody').text()).toContain('Acme Recycling Ltd')
      expect($('tbody').text()).toContain('Delta Waste Management')
    })

    it('supports sorting query parameters', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/?sort=organisationName[desc]'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('th[aria-sort="descending"]').length).toBe(1)
    })

    it('supports pagination query parameters', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/?page=2'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('.govuk-pagination__item--current').text().trim()).toBe('2')
    })
  })

  describe('Cookie Management Routes', () => {
    it('POST /cookies/banner with analytics=yes accepts cookies and sets cookie', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/cookies/banner',
        payload: { analytics: 'yes' }
      })

      expect(response.statusCode).toBe(200)
      const cookies = response.headers['set-cookie']
      expect(cookies).toBeDefined()
      expect(cookies[0]).toContain('analytics_consent=granted')

      const $ = cheerio.load(response.payload)
      expect($('.govuk-cookie-banner').text()).toContain('accepted analytics cookies')
    })

    it('POST /cookies/banner with analytics=no rejects cookies and sets cookie', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/cookies/banner',
        payload: { analytics: 'no' }
      })

      expect(response.statusCode).toBe(200)
      const cookies = response.headers['set-cookie']
      expect(cookies).toBeDefined()
      expect(cookies[0]).toContain('analytics_consent=denied')

      const $ = cheerio.load(response.payload)
      expect($('.govuk-cookie-banner').text()).toContain('rejected analytics cookies')
    })

    it('POST /cookies/hide-banner hides the confirmation banner', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/cookies/hide-banner',
        payload: { 'cookies[hide]': 'hide' }
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('.govuk-cookie-banner').length).toBe(0)
    })

    it('ignores invalid or unexpected cookies without throwing 400 Bad Request', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          cookie: 'legacy_cookie="quoted value with spaces"; malformed=;; other=123'
        }
      })

      expect(response.statusCode).toBe(200)
    })

    it('GET /cookies renders cookie policy page with banner suppressed', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cookies'
      })

      expect(response.statusCode).toBe(200)
      const $ = cheerio.load(response.payload)
      expect($('.govuk-cookie-banner').length).toBe(0)
      expect($('h1').text()).toContain('Cookies on Waste Tracking Service')
      expect($('input[name="analytics"]').length).toBe(2)
    })
  })

  describe('Static Assets & Utility Routes', () => {
    it('serves compiled CSS with text/css content type', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/public/css/application.css'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/css')
      expect(response.payload).toContain('.defra-internal-header')
      expect(response.payload).toContain('.defra-internal-service-header')
      expect(response.payload).toContain('.govuk-button-group > form')
      expect(response.payload).toContain('.moj-scrollable-pane .govuk-table__header')
      expect(response.payload).toContain('.wrc-notification-banner--cancelled')
      expect(response.payload).toContain('.moj-sub-navigation__list')
      expect(response.payload).toContain('.moj-sub-navigation__item')
      expect(response.payload).toContain('.moj-sub-navigation__link[aria-current=page]')
      expect(response.payload).toContain('.v3-compact-table thead')
      expect(response.payload).toContain('font-family: arial, sans-serif')
      expect(response.payload).not.toContain('GDS Transport')
    })

    it('serves images', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/public/images/favicon.svg'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('image/svg+xml')
    })

    it('serves header and footer crest at /assets/images/govuk-crest.svg', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/assets/images/govuk-crest.svg'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('image/svg+xml')
    })

    it('serves govuk-frontend assets from /assets', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/assets/manifest.json'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('application/json')
    })

    it('handles POST /test-form correctly', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/test-form',
        payload: { CSRFToken: 'demo-csrf-token', example: 'data' }
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.payload).status).toBe('Form submitted successfully')
    })

    it('returns 404 for unknown route', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/does-not-exist'
      })

      expect(response.statusCode).toBe(404)
    })
  })
})

