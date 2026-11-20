---
layout: default
title: CSRF field
---

# CSRF field

The CSRF field component renders a hidden HTML `<input>` containing a Cross-Site Request Forgery (CSRF) validation token.

---

## When to use this component

Include this macro inside any HTML `<form>` element that submits `POST`, `PUT`, or `DELETE` requests back to the server to protect against CSRF attacks.

---

## How it works

### Nunjucks macro import

Unlike components accepting an options object, `wrcCsrfField` takes positional arguments `(token, id)`.

```njk
{% from "csrf-field/macro.njk" import wrcCsrfField %}

<form action="/submit-data" method="post">
  {{ wrcCsrfField(csrfToken) }}

  {# Form contents #}
</form>
```

### HTML output

```html
<input
  id="csrf-crumb"
  type="hidden"
  name="CSRFToken"
  value="d29b28a9-4670-4e56-8a71-678a1bc9a492"
/>
```

---

## Macro arguments

| Argument | Type     | Default        | Description                                            |
| -------- | -------- | -------------- | ------------------------------------------------------ |
| `token`  | `string` | _(required)_   | The CSRF token value generated for the active session. |
| `id`     | `string` | `"csrf-crumb"` | The HTML element ID attribute for the input element.   |

---

## Example with custom ID

```njk
{{ wrcCsrfField(csrfToken, "custom-form-csrf") }}
```

Renders:

```html
<input
  id="custom-form-csrf"
  type="hidden"
  name="CSRFToken"
  value="d29b28a9-4670-4e56-8a71-678a1bc9a492"
/>
```
