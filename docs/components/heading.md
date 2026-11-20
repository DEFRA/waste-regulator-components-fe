---
layout: default
title: Page heading
---

# Page heading

The heading component displays a main page title (`<h1>`) within a two-thirds width column, paired with an optional secondary caption.

---

## When to use this component

Use this component at the top of the main page content area (inside `content` or `beforeContent`) as the primary heading for pages that do not use a standard form input question as the `<h1>`.

---

## How it works

### Nunjucks macro import

```njk
{% from "heading/macro.njk" import wrcHeading %}

{{ wrcHeading({
  text: "Manage waste tracking compliance",
  caption: "Scheme registration 2026"
}) }}
```

### HTML output

```html
<div class="govuk-grid-row wrc-heading" data-testid="wrc-heading">
  <div class="govuk-grid-column-two-thirds">
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-2"
      data-testid="wrc-heading-title"
    >
      Manage waste tracking compliance
    </h1>
    <span class="govuk-caption-m" data-testid="wrc-heading-caption"
      >Scheme registration 2026</span
    >
  </div>
</div>
```

---

## Macro options

| Name      | Type     | Default     | Description                                              |
| --------- | -------- | ----------- | -------------------------------------------------------- |
| `text`    | `string` | `undefined` | The primary page heading text (`govuk-heading-xl`).      |
| `caption` | `string` | `undefined` | Optional sub-caption text rendered as `govuk-caption-m`. |
