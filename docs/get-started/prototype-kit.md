---
layout: default
title: Prototype installation
---

# Prototype installation

Install and use `waste-regulator-components-fe` as a plugin in a [GOV.UK Prototype Kit](https://prototype-kit.service.gov.uk/) v13+ prototype. If you are building a production Node.js service, follow [Production installation](./installation.md) instead.

---

## Prerequisites

- **Node.js** (`>=20`, LTS `>=22` recommended)
- A **GOV.UK Prototype Kit** project (`>=13.0.0`)
- **[GOV.UK Frontend](https://www.npmjs.com/package/govuk-frontend)** (`^6.0.0`)

---

## Install the package

In your prototype directory, install `waste-regulator-components-fe` and make sure `govuk-frontend` v6 is installed:

```bash
npm install govuk-frontend@^6.0.0 waste-regulator-components-fe
```

If you are installing directly from GitHub rather than the npm registry:

```bash
npm install govuk-frontend@^6.0.0 github:DEFRA/waste-regulator-components-fe
```

_(Append a release tag such as `#vX.Y.Z` or a branch name to pin a specific version.)_

Restart the prototype server:

```bash
npm run dev
```

You should see **waste-regulator-components-fe** listed as an installed plugin at `http://localhost:3000/manage-prototype/plugins`.

---

## What the Prototype Kit loads automatically

Because the package ships a `govuk-prototype-kit.config.json` configuration file, the Prototype Kit automatically discovers and registers:

- **Sass stylesheet**: `/dist/index.scss` (compiled alongside `govuk-frontend` without any manual `@use` or Sass load path changes)
- **Static assets**: `/dist/wrc/assets` (served under `/plugin-assets/waste-regulator-components-fe/dist/wrc/assets/...`)
- **Nunjucks search path**: `/dist` (enabling imports such as `wrc/components/header/macro.njk`)
- **Nunjucks macros**: all 14 `wrc*` macros (`wrcHeader`, `wrcFooter`, `wrcServiceHeader`, `wrcCookieBanner`, `wrcHeading`, `wrcSearch`, `wrcSubnavigation`, `wrcTabsList`, `wrcSortingColumnHeader`, `wrcStatusTag`, `wrcSubmissionStatusTag`, `wrcOrganisationLink`, `wrcCsrfField`, `wrcGoogleAnalytics`)

---

## Use Defra chrome in your layout

Update `app/views/layouts/main.html` to apply the `defra-internal` body class and render `wrcHeader` and `wrcFooter` inside the GOV.UK Prototype Kit layout:

```njk
{% extends "govuk-prototype-kit/layouts/govuk-branded.njk" %}

{% set bodyClasses = "defra-internal" %}

{% from "wrc/components/header/macro.njk" import wrcHeader %}
{% from "wrc/components/footer/macro.njk" import wrcFooter %}

{% block headIcons %}
  <link rel="icon" sizes="48x48" href="/plugin-assets/waste-regulator-components-fe/dist/wrc/assets/images/favicon.ico">
  <link rel="icon" sizes="any" href="/plugin-assets/waste-regulator-components-fe/dist/wrc/assets/images/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/plugin-assets/waste-regulator-components-fe/dist/wrc/assets/images/apple-touch-icon.png">
{% endblock %}

{% block header %}
  {{ wrcHeader({
    navigation: [
      { text: "Alex Smith", visuallyHiddenText: "Signed in as " },
      { text: "Sign out", href: "#" }
    ]
  }) }}
{% endblock %}

{% block footer %}
  {{ wrcFooter({
    meta: "Department for Environment, Food & Rural Affairs",
    getHelp: {
      heading: "Get help",
      email: "support@example.gov.uk",
      telephone: "0300 060 4400",
      hours: "Monday to Friday, 8:30am to 5pm"
    },
    links: [
      { text: "Privacy", href: "#" },
      { text: "Cookies", href: "#" },
      { text: "Accessibility statement", href: "#" }
    ]
  }) }}
{% endblock %}
```

---

## Optional typography and variable customisation

`waste-regulator-components-fe` uses `$defra-internal-*` Sass variables with `!default` so the stylesheet compiles with zero extra configuration.

If you want Defra internal prototypes to use Arial typography and green GOV.UK Frontend accents instead of GDS Transport:

1. In `app/assets/sass/settings.scss` (which the Prototype Kit compiles before plugins):

   ```scss
   $govuk-font-family: (arial, sans-serif);
   ```

2. In `app/assets/sass/application.scss`:

   ```scss
   :root {
     --govuk-brand-colour: #00a33b;
     --govuk-template-background-colour: #ffffff;
   }
   ```

To customise the Defra colours (`$defra-internal-brand`, `$defra-internal-footer-link`, `$defra-internal-nav-background`, `$defra-internal-link`, `$defra-internal-link-hover`), define your overrides in `app/assets/sass/settings.scss` as well.

---

## Components that use `t()` or `localeUrl()`

The header, footer, heading, subnavigation, tabs list, sorting column header, CSRF field, Google Analytics, and stylesheet utilities (`.v3-compact-table`, `.wrc-notification-banner--cancelled`, `.moj-scrollable-pane`, `.govuk-button-group > form`) work immediately with no extra JavaScript helpers.

Components that support English/Welsh translation (`wrcServiceHeader`, `wrcCookieBanner`, `wrcSearch`, `wrcStatusTag`, `wrcSubmissionStatusTag`, `pagination`) call a `t(locale, key, params)` function, and `wrcOrganisationLink` calls `localeUrl(path)`. If you use those components in your prototype:

1. Add lightweight fallback helpers in `app/routes.js`:

   ```js
   const labels = {
     'common.search': 'Search',
     'common.languageSwitcher.label': 'Language switcher',
     'common.languageSwitcher.english': 'English',
     'common.languageSwitcher.welsh': 'Cymraeg',
     'compliance.components.statusTag.noData': 'No data'
   }

   router.use((req, res, next) => {
     res.locals.locale = 'en'
     res.locals.t = (_locale, key) => labels[key] || key
     res.locals.localeUrl = (urlPath) => urlPath
     next()
   })
   ```

2. Import those macros with `with context` in your Nunjucks template so they receive `res.locals.t` and `res.locals.localeUrl`:

   ```njk
   {% from "wrc/components/service-header/macro.njk" import wrcServiceHeader with context %}
   ```

---

## Next steps

- Browse individual component examples and macro options in [Components](../components/index.md).
- Ready to build a production service? Follow [Production installation](./installation.md).
