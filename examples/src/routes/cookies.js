export const cookiesRoutes = [
  {
    method: 'GET',
    path: '/cookies',
    handler(request, h) {
      const cookieConsent = request.state?.analytics_consent
      const allowGoogleAnalytics = cookieConsent === 'granted'
      const locale = request.query.lang === 'cy' ? 'cy' : 'en'

      return h.view('cookies.njk', {
        pageTitle: 'Cookies on Waste Tracking Service',
        serviceName: 'Waste Tracking Service',
        currentUrl: '/cookies',
        locale,
        hasCookiePolicy: true,
        cookiePreferenceSet: false,
        allowGoogleAnalytics,
        csrfToken: 'demo-csrf-token'
      })
    }
  },
  {
    method: 'POST',
    path: '/cookies/banner',
    handler(request, h) {
      const payload = request.payload || {}
      const accepted = payload.analytics === 'yes'
      const locale = request.query.lang === 'cy' ? 'cy' : 'en'

      const response = h.view('home.njk', {
        pageTitle: 'Waste tracking compliance dashboard',
        serviceName: 'Waste Tracking Service',
        currentUrl: '/',
        locale,
        hideCookieBanner: false,
        hasCookiePolicy: false,
        cookiePreferenceSet: true,
        allowGoogleAnalytics: accepted,
        csrfToken: 'demo-csrf-token',
        records: [
          {
            organisationId: 'ORG-001',
            organisationName: 'Acme Recycling Ltd',
            organisationType: 'compliance-schemes',
            obligationYear: 2026,
            verified: true,
            submissionStatus: 'Accepted',
            documentId: 'DOC-101'
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          baseUrl: '/?sort=organisationName[asc]'
        },
        sort: {
          column: 'organisationName',
          direction: 'asc',
          baseUrl: '/?'
        }
      })

      response.state('analytics_consent', accepted ? 'granted' : 'denied', {
        path: '/',
        isHttpOnly: true,
        isSecure: false
      })

      return response
    }
  },
  {
    method: 'POST',
    path: '/cookies/hide-banner',
    handler(request, h) {
      const cookieConsent = request.state?.analytics_consent
      const allowGoogleAnalytics = cookieConsent === 'granted'
      const locale = request.query.lang === 'cy' ? 'cy' : 'en'

      const response = h.view('home.njk', {
        pageTitle: 'Waste tracking compliance dashboard',
        serviceName: 'Waste Tracking Service',
        currentUrl: '/',
        locale,
        hideCookieBanner: true,
        hasCookiePolicy: false,
        cookiePreferenceSet: false,
        allowGoogleAnalytics,
        csrfToken: 'demo-csrf-token',
        records: [
          {
            organisationId: 'ORG-001',
            organisationName: 'Acme Recycling Ltd',
            organisationType: 'compliance-schemes',
            obligationYear: 2026,
            verified: true,
            submissionStatus: 'Accepted',
            documentId: 'DOC-101'
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          baseUrl: '/?sort=organisationName[asc]'
        },
        sort: {
          column: 'organisationName',
          direction: 'asc',
          baseUrl: '/?'
        }
      })

      response.state('hide_cookie_banner', 'true', {
        path: '/',
        isHttpOnly: true,
        isSecure: false
      })

      return response
    }
  }
]
