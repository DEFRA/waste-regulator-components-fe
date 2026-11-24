# Defra Internal Frontend — Example Application

A reference implementation demonstrating how to build a Defra digital service using [Hapi.js](https://hapi.dev/) (v21), [Nunjucks](https://mozilla.github.io/nunjucks/), and the [`waste-regulator-components-fe`](../README.md) component library.

---

## Overview

This example application showcases all Nunjucks and stylesheet components provided by `waste-regulator-components-fe` integrated into a production-pattern Hapi application:

- **Top-level layout & branding**: Defra internal header, Defra internal service header with release version context slot and Welsh language switcher, and Defra internal footer.
- **Cookie consent & privacy**: Cookie banner handling analytics acceptance/rejection via POST endpoints, confirmation banners, and cookie policy pages.
- **Navigation, search & data presentation**: Search panel (`wrcSearch`), subnavigation (`wrcSubnavigation`), tabs list (`wrcTabsList`), sortable table headers (`wrcSortingColumnHeader`), pagination (`pagination`), compact tables (`tab-panel`), scrollable table regions (`moj-scrollable-pane`), binary status tags (`wrcStatusTag`), submission lifecycle tags (`wrcSubmissionStatusTag`), and contextual organisation links (`wrcOrganisationLink`).
- **Typography, banners & forms**: Page headings (`wrcHeading`), captions, cancelled notification banner modifier (`notification-banner`), inline button-group forms (`button-group`), and CSRF token fields (`wrcCsrfField`).
- **Analytics & security**: Google Consent Mode v2 setup with default `denied` consent and runtime `granted` updates (`wrcGoogleAnalytics`).

---

## Directory structure

```text
examples/
├── README.md                      # This guide
├── package.json                   # Example app scripts and metadata
├── vitest.config.js               # Vitest configuration for the example app
├── scripts/
│   └── build-css.js               # Compiles Dart Sass (govuk + defra) to CSS
├── src/
│   ├── index.js                   # CLI entry point to boot and start the server
│   ├── server.js                  # Pure createServer() factory function
│   ├── config/
│   │   └── nunjucks.js            # Nunjucks environment & Vision configuration
│   ├── routes/
│   │   ├── home.js                # Dashboard view with table, sorting, & pagination
│   │   ├── cookies.js             # Cookie banner action endpoints & policy page
│   │   └── static.js              # Inert handler serving CSS and images
│   ├── views/
│   │   ├── layouts/
│   │   │   └── page.njk           # Base page layout extending govuk/template.njk
│   │   ├── home.njk               # Main dashboard template showcasing components
│   │   └── cookies.njk            # Cookie settings template
│   └── public/
│       ├── css/
│       │   └── application.css    # Compiled application stylesheet
│       └── images/                # Brand assets (crest, favicons, touch icon)
└── test/
    └── server.test.js             # Integration tests for all routes and components
```

---

## Components demonstrated

| Component                 | Macro / Template                         | Usage in Example App                                                                           |
| ------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Header**                | `wrcHeader`                              | Rendered at the top of every page in `page.njk` with user account details.                     |
| **Service header**        | `wrcServiceHeader`                       | Navigation bar with current release version context slot and English/Welsh toggle.             |
| **Cookie banner**         | `wrcCookieBanner`                        | Fixed cookie banner on `/` with POST actions to `/cookies/banner` and `/cookies/hide-banner`.  |
| **Footer**                | `wrcFooter`                              | Displays "Get help" contacts, support links, OGL v3.0 licence, and Crown copyright.            |
| **Google Analytics**      | `wrcGoogleAnalytics`                     | Injects Consent Mode v2 scripts in `<head>` and `<noscript>` iframe in `<body>`.               |
| **Heading**               | `wrcHeading`                             | Primary `<h1>` title and section caption on dashboard and cookie pages.                        |
| **CSRF field**            | `wrcCsrfField`                           | Hidden input for CSRF prevention in forms.                                                     |
| **Search**                | `wrcSearch`                              | Search form filtering records while preserving `type` and `sort` hidden fields.                |
| **Subnavigation**         | `wrcSubnavigation`                       | Subnavigation filter bar for switching between All, Direct producers, and Compliance schemes.  |
| **Tabs list**             | `wrcTabsList`                            | GOV.UK tabs list (`<ul class="govuk-tabs__list">`) above the organisations table.              |
| **Sorting column header** | `wrcSortingColumnHeader`                 | Table headers (`Organisation`, `Year`) supporting toggleable `[asc]` / `[desc]` queries.       |
| **Pagination**            | `wrc/components/pagination/template.njk` | Numbered page navigation controls beneath the data table.                                      |
| **Status tag**            | `wrcStatusTag`                           | Verified (green), Unverified (red), and Pending review (fallback) tags.                        |
| **Submission status tag** | `wrcSubmissionStatusTag`                 | Lifecycle pills (`Accepted`, `Pending`, `Cancelled`, `Not submitted`) with Welsh localization. |
| **Organisation link**     | `wrcOrganisationLink`                    | Dynamic links targeting organisation overviews or specific compliance documents.               |
| **Button group**          | CSS (`_index.scss`)                      | Inline `<form>` button alignment inside `.govuk-button-group`.                                 |
| **Scrollable pane**       | CSS (`_index.scss`)                      | Table wrapping inside `.moj-scrollable-pane` around the organisations table.                   |
| **Notification banner**   | CSS (`_index.scss`)                      | Cancelled status modifier `.wrc-notification-banner--cancelled`.                               |
| **Tab panel**             | CSS (`_index.scss`)                      | Compact `.v3-compact-table` table sizing and normal row header weight.                         |

---

## Getting started

### 1. Compile stylesheets

Compile the application stylesheet (combining GOV.UK Frontend and Defra Internal Frontend):

```bash
node scripts/build-css.js
```

### 2. Start the server

```bash
node src/index.js
```

The application will start on **`http://localhost:2000`**.

### 3. Run the test suite

Run the Hapi integration tests with Vitest:

```bash
npx vitest run --config vitest.config.js
```

All routes, query parameters, language toggles, cookie actions, and static assets are fully tested.
