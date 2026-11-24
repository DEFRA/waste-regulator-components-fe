---
layout: default
title: Production installation
---

# Production installation

Install `waste-regulator-components-fe` in a production Node.js service. If you are building a prototype, follow [Prototype installation](./prototype-kit.md) instead.

---

## Prerequisites

Before installing, make sure you have:

- **Node.js** (`>=20`, LTS `>=22` recommended)
- **npm** package manager
- **[GOV.UK Frontend](https://www.npmjs.com/package/govuk-frontend)** (`^6.0.0`)

---

## Install with npm

Install `waste-regulator-components-fe` alongside `govuk-frontend`:

```bash
npm install govuk-frontend@^6.0.0 waste-regulator-components-fe
```

If you are installing directly from GitHub rather than the npm registry:

```bash
npm install govuk-frontend@^6.0.0 github:DEFRA/waste-regulator-components-fe
```

_(Append a release tag such as `#vX.Y.Z` or a branch name to pin a specific version.)_

---

## Package structure

The package exports all Nunjucks macros, Sass stylesheets, and static assets under `dist/`, alongside `govuk-prototype-kit.config.json`:

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

---

## Next steps

- Follow the [Project setup guide](./project-setup.md) to configure Nunjucks template paths, Sass stylesheets, and asset bundling.
- Build your base layout with the [Page template guide](./page-template.md).
