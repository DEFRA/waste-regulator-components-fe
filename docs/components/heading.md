---
layout: default
title: Page heading
---

# Page heading

The heading component displays a main page title (`<h1>`) within a two-thirds width column, paired with an optional caption above it, as in the GOV.UK Design System's [headings with captions](https://design-system.service.gov.uk/styles/headings/#headings-with-captions).

---

## When to use this component

Use this component at the top of the main page content area (inside `content` or `beforeContent`) as the primary heading for pages that do not use a standard form input question as the `<h1>`.

---

## Macro options

| Name      | Type     | Default     | Description                                                                                   |
| --------- | -------- | ----------- | --------------------------------------------------------------------------------------------- |
| `text`    | `string` | `undefined` | The primary page heading text (`govuk-heading-xl`).                                           |
| `caption` | `string` | `undefined` | Optional caption above the heading, rendered as `govuk-caption-xl` to match the heading size. |
