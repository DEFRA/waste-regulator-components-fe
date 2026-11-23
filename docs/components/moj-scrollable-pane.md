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

### Example usage

```html
<div
  class="moj-scrollable-pane"
  role="region"
  aria-label="Registered organisations"
  tabindex="0"
>
  <table class="govuk-table">
    <thead class="govuk-table__head">
      <tr class="govuk-table__row">
        <th scope="col" class="govuk-table__header">Organisation</th>
        <th scope="col" class="govuk-table__header">Status</th>
      </tr>
    </thead>
    <tbody class="govuk-table__body">
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">Acme Recycling Ltd</th>
        <td class="govuk-table__cell">Accepted</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Stylesheet import

Included automatically via `dist/wrc/components/_index.scss` (or imported individually via `@use 'waste-regulator-components-fe/dist/wrc/components/moj-scrollable-pane';`).
