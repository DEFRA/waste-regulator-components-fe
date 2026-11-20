---
layout: default
title: Status tag
---

# Status tag

The status tag component displays a colored GOV.UK tag representing boolean states (true / false), or an unadorned fallback string when data is missing or null.

---

## When to use this component

Use this component to show quick visual indicators for binary flags such as submission completion, active status, or verification state in tables and summaries.

---

## How it works

### Nunjucks macro import

```njk
{% from "wrc/components/status-tag/macro.njk" import wrcStatusTag %}

{# Positive boolean state #}
{{ wrcStatusTag({
  value: true,
  trueText: "Complete"
}) }}

{# Negative boolean state #}
{{ wrcStatusTag({
  value: false,
  falseText: "Action required"
}) }}

{# Null / missing data state #}
{{ wrcStatusTag({
  value: null
}) }}
```

### HTML output

```html
<!-- value: true -->
<strong class="govuk-tag govuk-tag--green govuk-!-font-size-16"
  >Complete</strong
>

<!-- value: false -->
<strong class="govuk-tag govuk-tag--red govuk-!-font-size-16"
  >Action required</strong
>

<!-- value: null -->
No data
```

---

## Macro options

| Name         | Type                           | Default                  | Description                                                                            |
| ------------ | ------------------------------ | ------------------------ | -------------------------------------------------------------------------------------- |
| `value`      | `boolean \| null \| undefined` | `undefined`              | The boolean value to evaluate.                                                         |
| `trueText`   | `string`                       | `undefined`              | Text displayed in a green tag (`govuk-tag--green`) when `value` is truthy.             |
| `falseText`  | `string`                       | `undefined`              | Text displayed in a red tag (`govuk-tag--red`) when `value` is falsy (but not `null`). |
| `noDataText` | `string`                       | `"No data"`              | Text displayed when `value == null`. Defaults to translated `"No data"` string.        |
| `fontSize`   | `string`                       | `"govuk-!-font-size-16"` | Font size class applied to the tag element.                                            |
| `locale`     | `string`                       | `"en"`                   | Locale passed to translation function if `noDataText` is omitted.                      |
