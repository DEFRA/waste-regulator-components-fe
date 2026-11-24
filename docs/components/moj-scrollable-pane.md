---
layout: default
title: Scrollable pane
---

# Scrollable pane

The scrollable pane stylesheet component ensures wide data tables inside `.moj-scrollable-pane` wrap header and cell text naturally instead of overflowing onto a single unwrapped line.

---

## When to use this component

Use this component with any `<div class="moj-scrollable-pane">` wrapper around `.govuk-table` elements on regulator dashboards and compliance detail pages.

---

## How it works

Including `dist/wrc/components/moj-scrollable-pane/_index.scss` applies normal text wrapping inside scrollable table regions:

```scss
.moj-scrollable-pane .govuk-table__header,
.moj-scrollable-pane .govuk-table__cell {
  white-space: normal;
}
```

---

## Stylesheet import

Included automatically via `dist/wrc/components/_index.scss` (or imported individually via `@use 'waste-regulator-components-fe/dist/wrc/components/moj-scrollable-pane';`).
