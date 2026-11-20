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

## How it works

### Nunjucks macro import

```njk
{% from "tabs-list/macro.njk" import wrcTabsList %}

<div class="govuk-tabs">
  {{ wrcTabsList({
    items: [
      {
        text: "Pending (4)",
        href: "?type=direct-producers&tab=pending&clearSort=true",
        current: true
      },
      {
        text: "Accepted (2)",
        href: "?type=direct-producers&tab=accepted&clearSort=true",
        current: false
      },
      {
        text: "Not submitted (1)",
        href: "?type=direct-producers&tab=not-submitted&clearSort=true",
        current: false
      }
    ]
  }) }}
</div>
```

### HTML output

```html
<ul class="govuk-tabs__list">
  <li class="govuk-tabs__list-item govuk-tabs__list-item--selected">
    <a
      class="govuk-tabs__tab"
      href="?type=direct-producers&amp;tab=pending&amp;clearSort=true"
      aria-current="page"
      >Pending (4)</a
    >
  </li>
  <li class="govuk-tabs__list-item">
    <a
      class="govuk-tabs__tab"
      href="?type=direct-producers&amp;tab=accepted&amp;clearSort=true"
      >Accepted (2)</a
    >
  </li>
  <li class="govuk-tabs__list-item">
    <a
      class="govuk-tabs__tab"
      href="?type=direct-producers&amp;tab=not-submitted&amp;clearSort=true"
      >Not submitted (1)</a
    >
  </li>
</ul>
```

---

## Macro options

| Name              | Type      | Default | Description                                                                                                |
| ----------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `items`           | `array`   | `[]`    | Array of tab link item objects `{ text, href, current }`.                                                  |
| `items[].text`    | `string`  | —       | Display text for the tab link.                                                                             |
| `items[].href`    | `string`  | —       | Target URL for the tab link.                                                                               |
| `items[].current` | `boolean` | `false` | When `true`, adds `.govuk-tabs__list-item--selected` to the `<li>` and `aria-current="page"` to the `<a>`. |
