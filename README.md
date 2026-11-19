# Waste Regulator Components Frontend

Defra Internal Frontend contains the code you need to start building user interfaces for Defra internal platforms and services, built on top of [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) v6.

See [live examples of components](docs/components/index.md), explore the [example application](examples/README.md), and read [guidance on when and how to use them](docs/index.md) in your service.

## Table of contents

- [Contact the team](#contact-the-team)
- [Quick start](#quick-start)
  - [Installing using npm](#installing-using-npm)
  - [Package layout](#package-layout)
  - [Setting up your project](#setting-up-your-project)
- [Example application](#example-application)
- [Components](#components)
- [Browser and assistive technology support](#browser-and-assistive-technology-support)
- [Accessibility](#accessibility)
- [Development and testing](#development-and-testing)
- [Contributing](#contributing)
- [Licence](#licence)

## Contact the team

Defra Internal Frontend is maintained by the Defra EPR Regulators team.

If you have questions, want to propose a new component, or need assistance:

- [open an issue or pull request](https://github.com/DEFRA/defra-internal-frontend) in this repository
- get in touch with the team on Slack
- read our [Design System Documentation](docs/index.md) hosted on GitHub Pages

## Quick start

There are two main ways to use Defra Internal Frontend:

1. **Installing using npm (recommended)** — allows you to import Sass sources, configure Nunjucks template paths, and include only the assets your application needs.
2. **Reading the documentation** — refer to the [Getting started guide](docs/get-started/index.md) for full walkthroughs on Nunjucks, Sass load paths, and Vite / Webpack asset bundling.

### Installing using npm

We recommend installing Defra Internal Frontend alongside `govuk-frontend` using the Node.js package manager:

```bash
npm install defra-internal-frontend govuk-frontend
```

Ensure your project meets the prerequisites:
- **Node.js** (LTS version recommended)
- **`govuk-frontend`** (`^6.0.0`)
- **`nunjucks`** for server-side view templates
- **`sass-embedded`** (or Dart Sass `>= 1.77.0`) for Sass compilation

### Package layout

Like `govuk-frontend`, `defra-internal-frontend` serves all component macros, stylesheets, and static assets out of the `dist/` directory:

```text
node_modules/defra-internal-frontend/
└── dist/
    ├── index.scss
    ├── assets/
    │   └── images/
    │       ├── apple-touch-icon.png
    │       ├── favicon.ico
    │       ├── favicon.svg
    │       └── govuk-crest.svg
    └── components/
        ├── _index.scss
        ├── button-group/
        ├── csrf-field/
        ├── cookie-banner/
        ├── footer/
        ├── header/
        ├── service-header/
        ├── google-analytics/
        ├── heading/
        ├── moj-scrollable-pane/
        ├── notification-banner/
        ├── organisation-link/
        ├── pagination/
        ├── subnavigation/
        ├── search/
        ├── service-navigation/
        ├── sorting-column-header/
        ├── status-tag/
        ├── submission-status-tag/
        ├── tab-panel/
        └── tabs-list/
```

### Setting up your project

#### 1. Configure Nunjucks

Add the `dist/components` directory and `govuk-frontend/dist` to your Nunjucks view search paths:

```js
import nunjucks from 'nunjucks'
import path from 'node:path'

const defraInternalPath = path.dirname(require.resolve('defra-internal-frontend/package.json'))
const govukPath = path.dirname(require.resolve('govuk-frontend/package.json'))

const env = nunjucks.configure([
  path.join(defraInternalPath, 'dist', 'components'),
  path.join(govukPath, 'dist')
], {
  autoescape: true
})
```

#### 2. Import styles in Sass

In your application's main Sass file, import GOV.UK Frontend followed by Defra Internal Frontend:

```scss
@use "govuk/index" as govuk;
@use "defra-internal-frontend/dist/index" as defra;
```

#### 3. Copy static assets

Copy static images from `node_modules/defra-internal-frontend/dist/assets/images/` to your public directory (e.g. `/assets/images/`).

For a complete step-by-step walkthrough, see [Project setup](docs/get-started/project-setup.md) and the [Production page template](docs/get-started/page-template.md).

## Example application

We provide a complete reference application in [`examples/`](examples/README.md) built with **Hapi.js**, **Nunjucks**, and **Dart Sass**, demonstrating all components in action:

- **Start the example app**:
  ```bash
  npm run example:start
  ```
  Then open `http://localhost:3000` in your browser.

- **Run example app integration tests**:
  ```bash
  npm run example:test
  ```

See the [Example application guide](examples/README.md) for architecture details, route handlers, and testing patterns.

## Components

The following components are provided in `dist/components/`:

| Component | Description | Macro |
| --- | --- | --- |
| [**Header**](docs/components/header.md) | Top bar displaying Defra lock-up, crest, and account navigation | `wrcHeader` |
| [**Service header**](docs/components/service-header.md) | Green service navigation band with regulator context and language toggle | `wrcServiceHeader` |
| [**Cookie banner**](docs/components/cookie-banner.md) | Cookie consent banner and confirmation alerts with CSRF tokens | `wrcCookieBanner` |
| [**Footer**](docs/components/footer.md) | Footer with "Get help" block, support links, OGL licence, and Crown copyright | `wrcFooter` |
| [**Google Analytics**](docs/components/google-analytics.md) | GA4 (`gtag.js`), Consent Mode v2, and GTM head scripts / `<noscript>` iframe | `wrcGoogleAnalytics` |
| [**Heading**](docs/components/heading.md) | Page heading (`<h1>`) in two-thirds grid column with optional caption | `wrcHeading` |
| [**CSRF field**](docs/components/csrf-field.md) | Hidden input for cross-site request forgery prevention tokens | `wrcCsrfField` |
| [**Search**](docs/components/search.md) | Search form panel with validation support and arbitrary `hiddenFields` | `wrcSearch` |
| [**Subnavigation**](docs/components/subnavigation.md) | Subnavigation link bar supporting dynamic items and active link styles | `wrcSubnavigation` |
| [**Tabs list**](docs/components/tabs-list.md) | GOV.UK tabs list (`<ul class="govuk-tabs__list">`) with dynamic items and active tab state | `wrcTabsList` |
| [**Pagination**](docs/components/pagination.md) | Numbered pagination navigation with previous/next links and ellipsis | `pagination/template.njk` |
| [**Sorting column header**](docs/components/sorting-column-header.md) | Table header (`<th>`) with sorting controls and accessible ARIA attributes | `wrcSortingColumnHeader` |
| [**Status tag**](docs/components/status-tag.md) | Colored tag indicating boolean/binary status with accessible fallback | `wrcStatusTag` |
| [**Submission status tag**](docs/components/submission-status-tag.md) | Semantic tag for compliance submission states (Pending, Accepted, etc.) | `wrcSubmissionStatusTag` |
| [**Organisation link**](docs/components/organisation-link.md) | Contextual navigation link for organisation summaries and certificates | `wrcOrganisationLink` |
| [**Button group**](docs/components/button-group.md) | Aligns `<form>` submit buttons inline inside `.govuk-button-group` | CSS (`_index.scss`) |
| [**Scrollable pane**](docs/components/moj-scrollable-pane.md) | Enables normal text wrapping inside `.moj-scrollable-pane` tables | CSS (`_index.scss`) |
| [**Notification banner**](docs/components/notification-banner.md) | Adds `.wrc-notification-banner--cancelled` modifier styling | CSS (`_index.scss`) |
| [**Tab panel**](docs/components/tab-panel.md) | Provides `.v3-compact-table` compact table styling and normal `tbody th` weight | CSS (`_index.scss`) |

Browse the full [Components directory](docs/components/index.md) for individual component guidance, macro arguments, and HTML output examples.

## Browser and assistive technology support

Defra Internal Frontend adheres to the browser and assistive technology support criteria defined by [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend#browser-and-assistive-technology-support):

- **Modern browsers:** Recent versions of Chrome, Edge, Firefox, and Safari on desktop and mobile.
- **Assistive technologies:** Screen readers including JAWS, NVDA, and VoiceOver.
- **User preferences:** Full support for Windows High Contrast Mode, forced colors, and reduced motion.
- **Progressive enhancement:** Core user flows remain accessible when JavaScript is disabled.

## Accessibility

All components are built to meet or exceed **WCAG 2.2 Level AA** standards and comply with the [GOV.UK Service Standard](https://www.gov.uk/service-manual/service-standard).

If you identify an accessibility barrier in any component, please [open an issue](https://github.com/DEFRA/defra-internal-frontend/issues).

## Development and testing

### Running tests

Run the unit test suite with Vitest:

```bash
npm test
```

### Checking test coverage

```bash
npm test -- --coverage
```

The test suite in `tests/` covers all components, helpers, and Sass compilation with 100% statement, branch, function, and line coverage.

## Contributing

We welcome contributions to Defra Internal Frontend!

1. Fork or branch from `main`.
2. Ensure your changes follow functional JavaScript patterns, DRY, and KISS principles.
3. Write unit tests in `tests/` covering all cases (maintaining 100% test coverage).
4. Update or add documentation under `docs/components/` or `docs/get-started/`.
5. Submit a pull request with a clear description of your changes.

### Semantic commits and release notes

Release notes and semantic version bumps are automated from [Conventional Commits](https://www.conventionalcommits.org/) using `git-cliff` (`cliff.toml`):

- **Commit prefixes**:
  - `feat:` — new features (`minor` bump)
  - `fix:`, `perf:`, `content:`, `style:`, `refactor:`, `security:` — fixes and improvements (`patch` bump)
  - `docs:` — documentation entries included in release notes
  - `feat!:` or a `BREAKING CHANGE:` footer — breaking changes (`major` bump)
  - Optional footer overrides: `bump: major`, `bump: minor`, or `bump: patch`
- **JIRA ticket tracking**: Include `https://eaflood.atlassian.net/browse/<TICKET>` to list related tickets, or `Fixes https://eaflood.atlassian.net/browse/<TICKET>` / `Closes https://eaflood.atlassian.net/browse/<TICKET>` to list completed tickets.
- **Commands**:
  ```bash
  npm run release-notes:preview       # Preview unreleased changes since the latest tag
  npm run release-notes               # Generate notes for the latest release tag
  npm run release-notes:bump          # Print calculated bump (major | minor | patch | none)
  npm run release-notes:next-version  # Print next semantic version tag
  ```

## Licence

Unless stated otherwise, the codebase is released under the [MIT Licence](LICENCE). This covers both the software and any sample code in the documentation.

