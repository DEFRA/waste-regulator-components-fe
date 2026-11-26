---
layout: default
title: Home
---

# Waste and circular economy - Internal design system

Components and styles for internal waste and circular economy services.

This is not a Defra-wide design system. If your service is not an internal waste and circular economy service, use the [GOV.UK Design System](https://design-system.service.gov.uk/).

It is built on [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) v6 and gives you Nunjucks components, Sass styles and static assets.

---

## Get started

### Prototypes

- [**Install in the GOV.UK Prototype Kit**](./get-started/prototype-kit.md) — add it as a plugin to Prototype Kit v13 or later.

### Live services

- [**Install**](./get-started/installation.md) — what you need and how to install from npm.
- [**Set up your project**](./get-started/project-setup.md) — configure Nunjucks, Sass and your asset bundler.
- [**Create a page template**](./get-started/page-template.md) — build a base layout from `govuk/template.njk`.

---

## Components

| Component                                                          | What it does                                                      | Macro                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------- |
| [**Header**](./components/header.md)                               | Defra logo, crest and account menu                                | `wrcHeader`                              |
| [**Service header**](./components/service-header.md)               | Service navigation, regulator name and English/Welsh switch       | `wrcServiceHeader`                       |
| [**Cookie banner**](./components/cookie-banner.md)                 | Asks users to accept or reject analytics cookies                  | `wrcCookieBanner`                        |
| [**Footer**](./components/footer.md)                               | Help links, licence and Crown copyright                           | `wrcFooter`                              |
| [**Google Analytics**](./components/google-analytics.md)           | Adds Google Analytics and Tag Manager scripts with cookie consent | `wrcGoogleAnalytics`                     |
| [**Heading**](./components/heading.md)                             | Page heading with an optional caption                             | `wrcHeading`                             |
| [**CSRF field**](./components/csrf-field.md)                       | Hidden field for a CSRF token                                     | `wrcCsrfField`                           |
| [**Search**](./components/search.md)                               | Search form with error messages                                   | `wrcSearch`                              |
| [**Subnavigation**](./components/subnavigation.md)                 | Links to related pages, with the current page highlighted         | `wrcSubnavigation`                       |
| [**Tabs list**](./components/tabs-list.md)                         | List of tabs, with the current tab highlighted                    | `wrcTabsList`                            |
| [**Pagination**](./components/pagination.md)                       | Page numbers with previous and next links                         | `wrc/components/pagination/template.njk` |
| [**Sorting column header**](./components/sorting-column-header.md) | Table header that sorts the column                                | `wrcSortingColumnHeader`                 |
| [**Status tag**](./components/status-tag.md)                       | Green or red tag for yes or no states                             | `wrcStatusTag`                           |
| [**Submission status tag**](./components/submission-status-tag.md) | Coloured tag for submission states, such as pending or accepted   | `wrcSubmissionStatusTag`                 |
| [**Organisation link**](./components/organisation-link.md)         | Link to an organisation's summary or compliance document          | `wrcOrganisationLink`                    |
| [**Button group**](./components/button-group.md)                   | Lines up form buttons in a row                                    | CSS (`_index.scss`)                      |
| [**Scrollable pane**](./components/moj-scrollable-pane.md)         | Lets text wrap in scrollable tables                               | CSS (`_index.scss`)                      |
| [**Notification banner**](./components/notification-banner.md)     | Adds a style for cancelled items                                  | CSS (`_index.scss`)                      |
| [**Tab panel**](./components/tab-panel.md)                         | Compact tables inside tabs                                        | CSS (`_index.scss`)                      |

[Browse all components &rarr;](./components/index.md)

---

## Get help

The Defra EPR Regulators team looks after this project. To ask a question or suggest a component:

- contact the team on Slack
- [open an issue or pull request](https://github.com/DEFRA/waste-regulator-components-fe) on GitHub

To contribute, read the [contributing guide](./contributing.md). To preview this site on your computer, see [running the docs locally](./running-locally.md).
