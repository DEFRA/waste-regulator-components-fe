---
layout: default
title: Components
---

# Components

Components are reusable user interface elements designed specifically for Defra internal digital services.

---

## Layout and Chrome

- [**Header**](./header.md)  
  The Defra top bar displaying the organisation lock-up, official crest, and user account menu.

- [**Service header**](./service-header.md)  
  The green service navigation band paired with an English/Welsh language toggle bar and a regulator context slot.

- [**Cookie banner**](./cookie-banner.md)  
  Analytics cookie consent banner and preference saved confirmation alert, with CSRF protection.

- [**Footer**](./footer.md)  
  The Defra footer with contact information, support links, OGL v3.0 licence, and Crown copyright.

- [**Google Analytics**](./google-analytics.md)  
  Consent Mode v2 default setup, Google Analytics 4 (`gtag.js`), and Google Tag Manager scripts and `<noscript>` iframe.

---

## Typography and Forms

- [**Heading**](./heading.md)  
  Two-thirds grid column page heading (`<h1>`) with optional section caption.

- [**CSRF field**](./csrf-field.md)  
  Hidden input element for cross-site request forgery prevention tokens in POST forms.

---

## Data and Navigation

- [**Search**](./search.md)  
  Search form panel with configurable action, error summary messaging, Welsh language input, and arbitrary `hiddenFields`.

- [**Subnavigation**](./subnavigation.md)  
  MOJ subnavigation bar accepting any number of navigation links (`items`) and active link styling.

- [**Tabs list**](./tabs-list.md)  
  GOV.UK tabs list (`<ul class="govuk-tabs__list">`) accepting dynamic tab items and active tab selection styling.

- [**Sorting column header**](./sorting-column-header.md)  
  Sortable table header (`<th>`) with accessible `aria-sort` attributes and directional sort arrows.

- [**Pagination**](./pagination.md)  
  GOV.UK style pagination navigation with previous/next buttons and ellipsis truncation.

- [**Status tag**](./status-tag.md)  
  Green/red status tag indicating binary or boolean states with accessible fallback text.

- [**Submission status tag**](./submission-status-tag.md)  
  Colour-coded tag for regulatory compliance submission states (Pending, Accepted, Cancelled, Not submitted).

- [**Organisation link**](./organisation-link.md)  
  Localized link directing to an organisation summary or specific compliance document.

---

## Stylesheet Components

- [**Button group**](./button-group.md)  
  Displays forms inside `.govuk-button-group` using `display: contents` so form buttons align inline with sibling links.

- [**Scrollable pane**](./moj-scrollable-pane.md)  
  Allows table headers and cells inside `.moj-scrollable-pane` to wrap text normally.

- [**Notification banner**](./notification-banner.md)  
  Adds the `.wrc-notification-banner--cancelled` dark grey modifier variant for GOV.UK notification banners.

- [**Tab panel**](./tab-panel.md)  
  Provides compact `16px` table styling (`.v3-compact-table`) and normal-weight `tbody th` headers.
