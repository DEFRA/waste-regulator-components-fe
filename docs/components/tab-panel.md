---
layout: default
title: Tab panel
---

# Tab panel

The tab panel stylesheet provides `.v3-compact-table` compact table sizing (`16px`) and normal font weight styling for table row headers (`tbody th`).

---

## When to use this component

Apply `.v3-compact-table` to dense regulatory data tables (such as Certificates of Compliance lists inside GOV.UK tabs or search results) so multi-column tables remain readable without wrapping excessively.

---

## How it works

Including `dist/wrc/components/tab-panel/_index.scss` applies:

- `font-size: 16px` on `.v3-compact-table thead` and `.v3-compact-table tbody`.
- `font-weight: normal` on `.v3-compact-table tbody th` and `.govuk-table tbody th`.

### Example usage

```html
<table class="govuk-table v3-compact-table">
  <thead class="govuk-table__head">
    <tr class="govuk-table__row">
      <th scope="col" class="govuk-table__header">Organisation</th>
      <th scope="col" class="govuk-table__header">Submission status</th>
    </tr>
  </thead>
  <tbody class="govuk-table__body">
    <tr class="govuk-table__row">
      <th scope="row" class="govuk-table__header">Acme Recycling Ltd</th>
      <td class="govuk-table__cell">Accepted</td>
    </tr>
  </tbody>
</table>
```

---

## Stylesheet import

Included automatically via `dist/wrc/components/_index.scss` (or imported individually via `@use 'waste-regulator-components-fe/dist/wrc/components/tab-panel';`).
