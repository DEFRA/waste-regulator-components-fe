---
layout: default
title: Home
---

# Defra Internal Design System

Design and build consistent, accessible digital services for the Department for Environment, Food and Rural Affairs (Defra).

`defra-internal-frontend` provides reusable Nunjucks components, Sass stylesheets, and static assets built on top of [GOV.UK Frontend](https://design-system.service.gov.uk/) v6.

---

## Get started

Learn how to install and configure `defra-internal-frontend` in your production application:

- [**Installation**](./get-started/installation.md) — Prerequisites, installing via npm, and package directory layout.
- [**Project setup**](./get-started/project-setup.md) — Configuring Nunjucks search paths, Sass variables, and Vite / Webpack asset bundling.
- [**Page template**](./get-started/page-template.md) — Creating a base `page.njk` layout extending `govuk/template.njk`.

---

## Components

Components are reusable user interface elements created specifically for Defra internal services.

| Component                                                          | Description                                                                                   | Macro                     |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------- |
| [**Header**](./components/header.md)                               | Top bar with Defra organisation lock-up, crest, and account navigation                        | `wrcHeader`               |
| [**Service header**](./components/service-header.md)               | Green service navigation band with regulator context slot and English/Welsh language switcher | `wrcServiceHeader`        |
| [**Cookie banner**](./components/cookie-banner.md)                 | Analytics cookie consent banner and confirmation alerts with CSRF tokens                      | `wrcCookieBanner`         |
| [**Footer**](./components/footer.md)                               | Footer with "Get help" block, support links, OGL v3.0 licence, and Crown copyright            | `wrcFooter`               |
| [**Google Analytics**](./components/google-analytics.md)           | GA4 (`gtag.js`), Consent Mode v2 defaults/updates, and GTM head scripts / `<noscript>` iframe | `wrcGoogleAnalytics`      |
| [**Heading**](./components/heading.md)                             | Page heading (`<h1>`) with optional caption                                                   | `wrcHeading`              |
| [**CSRF field**](./components/csrf-field.md)                       | Hidden input for cross-site request forgery tokens                                            | `wrcCsrfField`            |
| [**Search**](./components/search.md)                               | Search form panel with validation support and arbitrary `hiddenFields`                        | `wrcSearch`               |
| [**Subnavigation**](./components/subnavigation.md)                 | Subnavigation link bar accepting dynamic items and active link styles                         | `wrcSubnavigation`        |
| [**Tabs list**](./components/tabs-list.md)                         | GOV.UK tabs list (`<ul class="govuk-tabs__list">`) with dynamic items and active tab state    | `wrcTabsList`             |
| [**Pagination**](./components/pagination.md)                       | Numbered pagination with previous/next links and ellipsis truncation                          | `pagination/template.njk` |
| [**Sorting column header**](./components/sorting-column-header.md) | Accessible sortable table header (`<th>`) with directional SVG arrows                         | `wrcSortingColumnHeader`  |
| [**Status tag**](./components/status-tag.md)                       | Green/red tag indicating binary or boolean state with fallback text                           | `wrcStatusTag`            |
| [**Submission status tag**](./components/submission-status-tag.md) | Colour-coded tag for compliance submission states (Pending, Accepted, Cancelled, etc.)        | `wrcSubmissionStatusTag`  |
| [**Organisation link**](./components/organisation-link.md)         | Localized link routing to an organisation summary or compliance document                      | `wrcOrganisationLink`     |
| [**Button group**](./components/button-group.md)                   | Aligns `<form>` submit buttons inline inside `.govuk-button-group`                            | CSS (`_index.scss`)       |
| [**Scrollable pane**](./components/moj-scrollable-pane.md)         | Enables normal text wrapping inside `.moj-scrollable-pane` tables                             | CSS (`_index.scss`)       |
| [**Notification banner**](./components/notification-banner.md)     | Adds `.wrc-notification-banner--cancelled` modifier styling                                   | CSS (`_index.scss`)       |
| [**Tab panel**](./components/tab-panel.md)                         | Provides `.v3-compact-table` compact table styling and normal `tbody th` weight               | CSS (`_index.scss`)       |

[Browse all components &rarr;](./components/index.md)

---

## Community & Support

`defra-internal-frontend` is maintained by the Defra Developer Enablement team. If you find a bug, need help, or want to contribute a new component, open an issue or pull request in the repository.

Read the [Contributing and semantic commits guide](./contributing.md) for local checks, commit conventions, and the automated release process.
