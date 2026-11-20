---
layout: default
title: Installation
---

# Installation

How to install `defra-internal-frontend` in your production project.

---

## Prerequisites

Before installing, make sure you have:

- **Node.js** (LTS version `>=22` recommended)
- **npm** package manager
- **[GOV.UK Frontend](https://www.npmjs.com/package/govuk-frontend)** (`^6.0.0`)

---

## Install with npm

Install `defra-internal-frontend` alongside `govuk-frontend`:

```bash
npm install --save govuk-frontend defra-internal-frontend
```

---

## Package structure

The package exports all compiled assets, Nunjucks macros, and Sass stylesheets out of the `dist/` directory:

```text
node_modules/defra-internal-frontend/
└── dist/
    ├── index.scss
    └── wrc/
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

---

## Next steps

Once the package is installed, follow the [Project setup guide](./project-setup.md) to configure Nunjucks template paths, Sass stylesheets, and asset bundling.
