---
layout: default
title: Button group
---

# Button group

The button group stylesheet extension ensures `<form>` elements placed inside a `.govuk-button-group` align inline alongside sibling links and buttons.

---

## When to use this component

Use this stylesheet when placing a POST action `<form>` (such as a submit or cancel action button wrapped with a CSRF field) inside a standard `.govuk-button-group` alongside secondary `<a>` links or additional buttons.

---

## How it works

GOV.UK Frontend's `.govuk-button-group` expects buttons and links to be direct flex children. Wrapping a button inside a `<form>` normally breaks flex alignment. Including `dist/components/button-group/_index.scss` applies:

```scss
.govuk-button-group > form {
  display: contents;
}
```

### Example usage

```njk
<div class="govuk-button-group">
  <form action="/accept" method="post">
    {{ wrcCsrfField(csrfToken) }}
    {{ govukButton({
      text: "Accept certificate"
    }) }}
  </form>
  <a class="govuk-link" href="/certificates-of-compliance">Cancel and return</a>
</div>
```

---

## Stylesheet import

Included automatically via `dist/components/_index.scss` (or imported individually via `@use "dist/components/button-group";`).
