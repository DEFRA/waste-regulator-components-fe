---
layout: default
title: Submission status tag
---

# Submission status tag

The submission status tag component renders standard status pills for submission workflows (such as Certificate of Compliance lifecycle stages) with consistent semantic colors and localized status labels.

---

## When to use this component

Use this component in summary cards, workflow histories, and data tables to indicate the progression of a submitted record or certificate.

---

## How it works

### Nunjucks macro import

```njk
{% from "wrc/components/submission-status-tag/macro.njk" import wrcSubmissionStatusTag %}

{{ wrcSubmissionStatusTag({
  status: "Accepted"
}) }}
```

### Supported statuses and colors

| Status Value      | Tag Color Class     | Rendered Label (EN) | Rendered Label (CY) |
| ----------------- | ------------------- | ------------------- | ------------------- |
| `"Pending"`       | `govuk-tag--blue`   | Pending             | Ar y gweill         |
| `"Accepted"`      | `govuk-tag--green`  | Accepted            | Wedi derbyn         |
| `"Cancelled"`     | `govuk-tag--yellow` | Cancelled           | Wedi canslo         |
| `"Not submitted"` | `govuk-tag--grey`   | Not submitted       | Heb ei gyflwyno     |
| _Other / Custom_  | `govuk-tag--blue`   | Custom status text  | Custom status text  |

### HTML output

```html
<strong class="govuk-tag govuk-tag--green">Accepted</strong>
```

---

## Macro options

| Name     | Type     | Default     | Description                                                                               |
| -------- | -------- | ----------- | ----------------------------------------------------------------------------------------- |
| `status` | `string` | `undefined` | The status name (`"Pending"`, `"Accepted"`, `"Cancelled"`, `"Not submitted"`, or custom). |
| `locale` | `string` | `"en"`      | Locale code (`"en"` or `"cy"`) for translating standard status strings.                   |
