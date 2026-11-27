# Waste Regulator Components Frontend

`waste-regulator-components-fe` contains the code you need to start building user interfaces for Defra internal platforms and services, built on top of [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) v6.

See [live examples of components](docs/components/index.md), explore the [example application](examples/README.md), and read [guidance on when and how to use them](docs/index.md) in your service.

## Table of contents

- [Contact the team](#contact-the-team)
- [Quick start](#quick-start)
  - [Prototype installation (GOV.UK Prototype Kit)](#prototype-installation-govuk-prototype-kit)
  - [Production installation (Node.js service)](#production-installation-nodejs-service)
  - [Package layout](#package-layout)
- [Example application](#example-application)
- [Documentation](#documentation)
- [Components](#components)
- [Browser and assistive technology support](#browser-and-assistive-technology-support)
- [Accessibility](#accessibility)
- [Development and testing](#development-and-testing)
- [Contributing](#contributing)
- [Licence](#licence)

## Contact the team

`waste-regulator-components-fe` is maintained by the Defra EPR Regulators team.

If you have questions, want to propose a new component, or need assistance:

- [open an issue or pull request](https://github.com/DEFRA/waste-regulator-components-fe) in this repository
- get in touch with the team on Slack
- read our [Design System Documentation](docs/index.md) hosted on GitHub Pages

## Quick start

Choose the installation path that matches your project — prototyping with the **GOV.UK Prototype Kit** or building a **production Node.js service** (see the [Getting started overview](docs/get-started/index.md)):

### Prototype installation (GOV.UK Prototype Kit)

Ensure your prototype meets the prerequisites:

- **Node.js** (`>=20`, LTS `>=22` recommended)
- **GOV.UK Prototype Kit** (`>=13.0.0`)
- **`govuk-frontend`** (`^6.0.0`)

Install `waste-regulator-components-fe` alongside `govuk-frontend`:

```bash
npm install govuk-frontend@^6.0.0 waste-regulator-components-fe
```

Restart `npm run dev` to load the plugin. Because `waste-regulator-components-fe` ships `govuk-prototype-kit.config.json`, the Prototype Kit automatically registers the Sass stylesheet (`/dist/index.scss`), static assets, `/dist` Nunjucks path, and all `wrc*` macros. See [Prototype installation](docs/get-started/prototype-kit.md) for layout setup and optional typography or i18n helper customisation.

### Production installation (Node.js service)

Ensure your service meets the prerequisites:

- **Node.js** (`>=20`, LTS `>=22` recommended)
- **`govuk-frontend`** (`^6.0.0`)
- **`nunjucks`** for server-side view templates
- **`sass-embedded`** (or Dart Sass `>= 1.77.0`) for Sass compilation

Install `waste-regulator-components-fe` alongside `govuk-frontend`:

```bash
npm install govuk-frontend@^6.0.0 waste-regulator-components-fe
```

#### 1. Configure Nunjucks

Add the `dist` directory and `govuk-frontend/dist` to your Nunjucks view search paths:

```js
import { createRequire } from 'node:module'
import path from 'node:path'
import nunjucks from 'nunjucks'

const require = createRequire(import.meta.url)
const wrcPath = path.dirname(
  require.resolve('waste-regulator-components-fe/package.json')
)
const govukPath = path.dirname(require.resolve('govuk-frontend/package.json'))

const env = nunjucks.configure(
  [path.join(wrcPath, 'dist'), path.join(govukPath, 'dist')],
  {
    autoescape: true
  }
)
```

#### 2. Import styles in Sass

In your application's main Sass file, import GOV.UK Frontend followed by `waste-regulator-components-fe`:

```scss
@use 'govuk-frontend';
@use 'waste-regulator-components-fe/dist/wrc/index' as *;
```

Ensure your Sass compiler's `loadPaths` includes the directory containing `node_modules` (usually the project root `.`, or the workspace root in a monorepo) alongside `node_modules` so `govuk-frontend` forwards resolve cleanly.

#### 3. Copy static assets

Copy static images from `node_modules/waste-regulator-components-fe/dist/wrc/assets/images/` to your public directory (e.g. `/assets/images/`).

For complete walkthroughs, see [Production installation](docs/get-started/installation.md), [Project setup](docs/get-started/project-setup.md), and the [Page template](docs/get-started/page-template.md).

### Package layout

The package includes `govuk-prototype-kit.config.json` and serves all component macros, stylesheets, and static assets out of `dist/`:

```text
node_modules/waste-regulator-components-fe/
├── govuk-prototype-kit.config.json
└── dist/
    ├── index.scss
    └── wrc/
        ├── index.scss
        ├── _variables.scss
        ├── vendor/
        │   └── _govuk-frontend.scss
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
            ├── sorting-column-header/
            ├── status-tag/
            ├── submission-status-tag/
            ├── tab-panel/
            └── tabs-list/
```

## Example application

We provide a complete reference application in [`examples/`](examples/README.md) built with **Hapi.js**, **Nunjucks**, and **Dart Sass**, demonstrating all components in action:

- **Start the example app**:

  ```bash
  npm run example:start
  ```

  Then open `http://localhost:2000` in your browser.

- **Run example app integration tests**:
  ```bash
  npm run example:test
  ```

See the [Example application guide](examples/README.md) for architecture details, route handlers, and testing patterns.

## Documentation

The documentation site in [`docs/`](docs/index.md) uses the same Defra/GOV.UK styles and layouts as the example application:

- **Start the documentation site locally** (no Ruby or Jekyll installation required):

  ```bash
  npm run docs:start
  ```

  This builds the documentation CSS, image assets, and release version data (`docs/_data/release.yml`) and serves the site on `localhost` only at `http://localhost:1999` (set `PORT` to override, e.g. `PORT=8080 npm run docs:start` in Bash/Zsh or `$env:PORT=8080; npm run docs:start` in PowerShell).

- **Build documentation assets only**:

  ```bash
  npm run docs:build
  ```

  Compiles `docs/assets/scss/docs.scss` using the shared Defra/GOV.UK styles, copies `dist/wrc/assets/images/` into `docs/assets/images/`, and writes the current release version tag to `docs/_data/release.yml`.

See the [Running documentation locally guide](docs/running-locally.md) for full details on local previewing, port configuration, and asset builds.

## Components

The following components are provided in `dist/wrc/components/`:

| Component                                                             | Description                                                                                | Macro                                    |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [**Header**](docs/components/header.md)                               | Top bar displaying Defra lock-up, crest, and account navigation                            | `wrcHeader`                              |
| [**Service header**](docs/components/service-header.md)               | Green service navigation band with regulator context and language toggle                   | `wrcServiceHeader`                       |
| [**Cookie banner**](docs/components/cookie-banner.md)                 | Cookie consent banner and confirmation alerts with CSRF tokens                             | `wrcCookieBanner`                        |
| [**Footer**](docs/components/footer.md)                               | Footer with "Get help" block, support links, OGL licence, and Crown copyright              | `wrcFooter`                              |
| [**Google Analytics**](docs/components/google-analytics.md)           | GA4 (`gtag.js`), Consent Mode v2, and GTM head scripts / `<noscript>` iframe               | `wrcGoogleAnalytics`                     |
| [**Heading**](docs/components/heading.md)                             | Page heading (`<h1>`) in two-thirds grid column with optional caption                      | `wrcHeading`                             |
| [**CSRF field**](docs/components/csrf-field.md)                       | Hidden input for cross-site request forgery prevention tokens                              | `wrcCsrfField`                           |
| [**Search**](docs/components/search.md)                               | Search form panel with validation support and arbitrary `hiddenFields`                     | `wrcSearch`                              |
| [**Subnavigation**](docs/components/subnavigation.md)                 | Subnavigation link bar supporting dynamic items and active link styles                     | `wrcSubnavigation`                       |
| [**Tabs list**](docs/components/tabs-list.md)                         | GOV.UK tabs list (`<ul class="govuk-tabs__list">`) with dynamic items and active tab state | `wrcTabsList`                            |
| [**Pagination**](docs/components/pagination.md)                       | Numbered pagination navigation with previous/next links and ellipsis                       | `wrc/components/pagination/template.njk` |
| [**Sorting column header**](docs/components/sorting-column-header.md) | Table header (`<th>`) with sorting controls and accessible ARIA attributes                 | `wrcSortingColumnHeader`                 |
| [**Status tag**](docs/components/status-tag.md)                       | Colored tag indicating boolean/binary status with accessible fallback                      | `wrcStatusTag`                           |
| [**Submission status tag**](docs/components/submission-status-tag.md) | Semantic tag for compliance submission states (Pending, Accepted, etc.)                    | `wrcSubmissionStatusTag`                 |
| [**Organisation link**](docs/components/organisation-link.md)         | Contextual navigation link for organisation summaries and certificates                     | `wrcOrganisationLink`                    |
| [**Button group**](docs/components/button-group.md)                   | Aligns `<form>` submit buttons inline inside `.govuk-button-group`                         | CSS (`_index.scss`)                      |
| [**Scrollable pane**](docs/components/moj-scrollable-pane.md)         | Enables normal text wrapping inside `.moj-scrollable-pane` tables                          | CSS (`_index.scss`)                      |
| [**Notification banner**](docs/components/notification-banner.md)     | Adds `.wrc-notification-banner--cancelled` modifier styling                                | CSS (`_index.scss`)                      |
| [**Tab panel**](docs/components/tab-panel.md)                         | Provides `.v3-compact-table` compact table styling and normal `tbody th` weight            | CSS (`_index.scss`)                      |

Browse the full [Components directory](docs/components/index.md) for individual component guidance, macro arguments, and HTML output examples.

## Browser and assistive technology support

`waste-regulator-components-fe` adheres to the browser and assistive technology support criteria defined by [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend#browser-and-assistive-technology-support):

- **Modern browsers:** Recent versions of Chrome, Edge, Firefox, and Safari on desktop and mobile.
- **Assistive technologies:** Screen readers including JAWS, NVDA, and VoiceOver.
- **User preferences:** Full support for Windows High Contrast Mode, forced colors, and reduced motion.
- **Progressive enhancement:** Core user flows remain accessible when JavaScript is disabled.

## Accessibility

All components are built to meet or exceed **WCAG 2.2 Level AA** standards and comply with the [GOV.UK Service Standard](https://www.gov.uk/service-manual/service-standard).

If you identify an accessibility barrier in any component, please [open an issue](https://github.com/DEFRA/waste-regulator-components-fe/issues).

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

### Formatting and linting

Check or apply formatting and run JavaScript/SCSS linters:

```bash
npm run format:check
npm run format
npm run lint
npm run lint:js
npm run lint:js:fix
npm run lint:scss
```

### Security audit

Run the npm audit check for critical vulnerabilities:

```bash
npm run security-audit
```

### Pre-commit hook

Husky runs `npm run git:pre-commit-hook` (`security-audit`, `format:check`, `lint`, and `test`) automatically before each commit via `.husky/pre-commit`.

### SonarCloud scanning

Pull requests and pushes to `main` run SonarCloud analysis in `.github/workflows/check-pull-request.yml` using `sonar-project.properties`. Ensure the `DEFRA_waste-regulator-components-fe` project exists in the `defra` organisation on SonarCloud and that the `WASTE_PACKAGING_SONAR_TOKEN` secret is available to this repository.

## Contributing

We welcome contributions to `waste-regulator-components-fe`!

Before starting work on a new component, read our [Contribution criteria](docs/contribution-criteria.md) and [Contributing guide](docs/contributing.md), or start a thread in [GitHub Discussions](https://github.com/DEFRA/waste-regulator-components-fe/discussions).

1. Fork or branch from `main`.
2. Ensure your changes follow functional JavaScript patterns, DRY, and KISS principles.
3. Write unit tests in `tests/` covering all cases (maintaining 100% test coverage).
4. Update or add documentation under `docs/components/` or `docs/get-started/`.
5. Submit a pull request with a clear description of your changes.

### Semantic commits and release notes

Release notes and semantic version bumps are automated from [Conventional Commits](https://www.conventionalcommits.org/) using `git-cliff` (`cliff.toml`), based on Tim Abell's guide [Automatic release notes with semantic commits and git-cliff](https://0x5.uk/2026/03/12/automatic-release-notes-with-semantic-commits-and-git-cliff/):

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

Unless stated otherwise, the codebase is released under the [Open Government Licence (OGL) Version 3](LICENCE). This covers both the software and any sample code in the documentation.
