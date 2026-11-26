---
layout: default
title: Get started
---

# Get started

Choose the installation path that matches your project — whether you are building a prototype with the **GOV.UK Prototype Kit** or a **production Node.js service**.

---

## Prototyping (GOV.UK Prototype Kit)

Use this path when designing and testing a service with the GOV.UK Prototype Kit (v13+). The package registers its Sass stylesheet, static assets, and `wrc*` macros automatically as a plugin.

- [**Prototype installation**](./prototype-kit.md)  
  Install `waste-regulator-components-fe` as a GOV.UK Prototype Kit plugin, apply WCE internal chrome in your layout, and optionally customise typography or translation helpers.

---

## Production (Node.js service)

Use this path when building a live or staging web application with Node.js, Nunjucks, and a Sass bundler (Vite or Webpack).

1. [**Production installation**](./installation.md)  
   Install `waste-regulator-components-fe` and `govuk-frontend` via npm and explore the package directory layout.

2. [**Project setup**](./project-setup.md)  
   Configure your Nunjucks view engine search paths, import the Sass stylesheets, and set up your asset build pipeline using Vite or Webpack.

3. [**Page template**](./page-template.md)  
   Build a production-ready base page layout (`page.njk`) combining GOV.UK Frontend and WCE internal chrome components.

---

## Upgrading

If your production project is already using local copies of WCE internal components, see the [Project setup guide](./project-setup.md) for how to replace relative component imports with package imports.
