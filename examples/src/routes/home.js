const mockRecords = [
  {
    organisationId: 'ORG-001',
    organisationName: 'Acme Recycling Ltd',
    organisationType: 'compliance-schemes',
    obligationYear: 2026,
    verified: true,
    submissionStatus: 'Accepted',
    documentId: 'DOC-101'
  },
  {
    organisationId: 'ORG-002',
    organisationName: 'BioPackaging Solutions',
    organisationType: 'producers',
    obligationYear: 2026,
    verified: false,
    submissionStatus: 'Pending',
    documentId: null
  },
  {
    organisationId: 'ORG-003',
    organisationName: 'Circular Materials UK',
    organisationType: 'producers',
    obligationYear: 2025,
    verified: null,
    submissionStatus: 'Not submitted',
    documentId: null
  },
  {
    organisationId: 'ORG-004',
    organisationName: 'Delta Waste Management',
    organisationType: 'compliance-schemes',
    obligationYear: 2025,
    verified: true,
    submissionStatus: 'Cancelled',
    documentId: 'DOC-104'
  }
]

const VALID_TYPES = new Set(['all', 'producers', 'compliance-schemes'])

export function parseSort(sortParam) {
  if (!sortParam) {
    return { column: 'organisationName', direction: 'asc' }
  }
  const match = sortParam.match(/^([a-zA-Z0-9_-]+)\[(asc|desc)\]$/)
  if (match) {
    return { column: match[1], direction: match[2] }
  }
  return { column: 'organisationName', direction: 'asc' }
}

export const homeRoutes = [
  {
    method: 'GET',
    path: '/',
    handler(request, h) {
      const locale = request.query.lang === 'cy' ? 'cy' : 'en'
      const sort = parseSort(request.query.sort)
      const organisationType = VALID_TYPES.has(request.query.type)
        ? request.query.type
        : 'all'
      const searchTerm = (request.query.search ?? '').trim()
      const currentPage = Math.max(1, parseInt(request.query.page, 10) || 1)
      const totalPages = 3
      const allowGoogleAnalytics = request.state?.analytics_consent === 'granted'
      const hideCookieBanner = request.state?.hide_cookie_banner === 'true'

      const filteredRecords = mockRecords.filter((record) => {
        if (
          organisationType !== 'all' &&
          record.organisationType !== organisationType
        ) {
          return false
        }
        if (searchTerm) {
          const query = searchTerm.toLowerCase()
          return (
            record.organisationName.toLowerCase().includes(query) ||
            record.organisationId.toLowerCase().includes(query)
          )
        }
        return true
      })

      const sortedRecords = [...filteredRecords].sort((a, b) => {
        const valA = a[sort.column] ?? ''
        const valB = b[sort.column] ?? ''
        const compare = String(valA).localeCompare(String(valB))
        return sort.direction === 'desc' ? -compare : compare
      })

      const baseQuery = `/?lang=${locale}&type=${organisationType}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`

      return h.view('home.njk', {
        pageTitle: 'Waste tracking compliance dashboard',
        serviceName: 'Waste Tracking Service',
        currentUrl: '/',
        locale,
        organisationType,
        searchTerm,
        hideCookieBanner,
        hasCookiePolicy: false,
        cookiePreferenceSet: false,
        allowGoogleAnalytics,
        csrfToken: 'demo-csrf-token',
        records: sortedRecords,
        sort: {
          column: sort.column,
          direction: sort.direction,
          baseUrl: baseQuery
        },
        pagination: {
          currentPage,
          totalPages,
          baseUrl: `${baseQuery}&sort=${sort.column}[${sort.direction}]`
        }
      })
    }
  },
  {
    method: 'POST',
    path: '/test-form',
    handler(request, h) {
      return h
        .response({
          status: 'Form submitted successfully',
          payload: request.payload
        })
        .code(200)
    }
  }
]
