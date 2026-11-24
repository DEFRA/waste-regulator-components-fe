---
layout: default
title: Tabs list
---

# Tabs list

The tabs list component renders a `<ul class="govuk-tabs__list">` navigation list with dynamic tab items and active selection styling.

---

## When to use this component

Use this component inside a `<div class="govuk-tabs">` container when tabs navigate between server-rendered views (such as status views) rather than client-side anchor panels.

---

## Macro options

| Name              | Type      | Default | Description                                                                                                |
| ----------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `items`           | `array`   | `[]`    | Array of tab link item objects `{ text, href, current }`.                                                  |
| `items[].text`    | `string`  | —       | Display text for the tab link.                                                                             |
| `items[].href`    | `string`  | —       | Target URL for the tab link.                                                                               |
| `items[].current` | `boolean` | `false` | When `true`, adds `.govuk-tabs__list-item--selected` to the `<li>` and `aria-current="page"` to the `<a>`. |
