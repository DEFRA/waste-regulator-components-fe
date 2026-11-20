const dictionaries = {
  en: {
    common: {
      search: 'Search',
      serviceName: "pEPR: Regulators' Service",
      organisationName:
        'Department for Environment,<br>Food &amp; Rural Affairs',
      languageSwitcher: {
        label: 'Language',
        english: 'English',
        welsh: 'Cymraeg'
      },
      cookieBanner: {
        ariaLabel: 'Cookies on {{serviceName}}',
        heading: 'Cookies on {{serviceName}}',
        essentialHtml:
          '<p class="govuk-body">We use some essential cookies to make this service work.</p><p class="govuk-body">We’d also like to use analytics cookies so we can understand how you use the service and make improvements.</p>',
        acceptAnalytics: 'Accept analytics cookies',
        rejectAnalytics: 'Reject analytics cookies',
        viewCookies: 'View cookies',
        preferenceAccepted:
          'You’ve accepted analytics cookies. You can <a class="govuk-link" href="{{cookiesUrl}}">change your cookie settings</a> at any time.',
        preferenceRejected:
          'You’ve rejected analytics cookies. You can <a class="govuk-link" href="{{cookiesUrl}}">change your cookie settings</a> at any time.',
        hideMessage: 'Hide cookie message'
      }
    },
    compliance: {
      components: {
        statusTag: {
          noData: 'No data',
          met: 'Met',
          notMet: 'Not met',
          compliant: 'Compliant',
          notCompliant: 'Not compliant'
        },
        sortingColumnHeader: {
          sortBy: 'Sort by {{columnLabel}}, {{direction}}',
          ascending: 'ascending',
          descending: 'descending'
        },
        pagination: {
          navAriaLabel: 'Results pages',
          previous: 'Previous',
          next: 'Next',
          pageAriaLabel: 'Page {{page}}'
        }
      }
    },
    certificatesOfCompliance: {
      common: {
        submissionStatus: {
          pending: 'Pending',
          accepted: 'Accepted',
          notSubmitted: 'Not submitted',
          cancelled: 'Cancelled',
          queried: 'Queried'
        }
      }
    }
  },
  cy: {
    common: {
      search: 'Chwilio',
      serviceName: 'pEPR: Gwasanaeth Rheolewyr',
      organisationName: 'Adran yr Amgylchedd,<br>Bwyd a Materion Gwledig',
      languageSwitcher: {
        label: 'Iaith',
        english: 'English',
        welsh: 'Cymraeg'
      },
      cookieBanner: {
        ariaLabel: 'Cwcis ar {{serviceName}}',
        heading: 'Cwcis ar {{serviceName}}',
        essentialHtml:
          '<p class="govuk-body">Rydym ni\'n defnyddio rhai cwcis hanfodol i wneud i\'r gwasanaeth hwn weithio.</p><p class="govuk-body">Rydym hefyd yn awyddus i ddefnyddio cwcis dadansoddi er mwyn deall sut rydych chi\'n defnyddio\'r gwasanaeth a sut gallwn ni ei wella.</p>',
        acceptAnalytics: 'Derbyn cwcis dadansoddi',
        rejectAnalytics: 'Gwrthod cwcis dadansoddi',
        viewCookies: 'Gweld y cwcis',
        preferenceAccepted:
          'Rydych chi wedi derbyn cwcis dadansoddi. Gallwch <a class="govuk-link" href="{{cookiesUrl}}">newid eich gosodiadau cwcis</a> ar unrhyw adeg.',
        preferenceRejected:
          'Rydych chi wedi gwrthod cwcis dadansoddi. Gallwch <a class="govuk-link" href="{{cookiesUrl}}">newid eich gosodiadau cwcis</a> ar unrhyw adeg.',
        hideMessage: "Cuddio'r neges cwcis"
      }
    },
    compliance: {
      components: {
        statusTag: {
          noData: 'Dim data'
        },
        pagination: {
          navAriaLabel: 'Tudalennau canlyniadau',
          previous: 'Blaenorol',
          next: 'Nesaf',
          pageAriaLabel: 'Tudalen {{page}}'
        }
      }
    },
    certificatesOfCompliance: {
      common: {
        submissionStatus: {
          pending: 'Ar y gweill',
          accepted: 'Wedi derbyn',
          notSubmitted: 'Heb ei gyflwyno',
          cancelled: 'Wedi canslo'
        }
      }
    }
  }
}

function getNestedValue(obj, key) {
  return key
    .split('.')
    .reduce(
      (acc, current) => (acc && current in acc ? acc[current] : undefined),
      obj
    )
}

function interpolate(template, params) {
  return template.replaceAll(/\{\{(\w+)\}\}/g, (_match, paramName) =>
    paramName in params ? String(params[paramName]) : ''
  )
}

export function translate(locale = 'en', key, params = {}) {
  const dict = dictionaries[locale] ?? dictionaries.en
  const value =
    getNestedValue(dict, key) ?? getNestedValue(dictionaries.en, key) ?? key

  if (typeof value !== 'string') {
    return key
  }

  return interpolate(value, params)
}
