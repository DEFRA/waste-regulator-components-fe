---
layout: default
title: Subnavigation
---

# Subnavigation

The subnavigation component renders an accessible MOJ-styled secondary navigation bar supporting any number of navigation links, plus paired active link colour styles.

---

## When to use this component

Use this component above tabbed views or filtered datasets to switch between top-level categories (such as **Direct producers** and **Compliance schemes**).

---

## How it works

### Nunjucks macro import

```njk
{% from "subnavigation/macro.njk" import wrcSubnavigation %}

{{ wrcSubnavigation({
  ariaLabel: "Filter by producer type",
  items: [
    {
      text: "Direct producers",
      href: "/?type=direct-producers&tab=pending",
      current: true
    },
    {
      text: "Compliance schemes",
      href: "/?type=compliance-schemes&tab=pending",
      current: false
    }
  ]
}) }}
```

### HTML output

```html
<nav
  class="moj-sub-navigation govuk-!-margin-bottom-5 govuk-!-margin-top-6"
  aria-label="Filter by producer type"
>
  <ul class="moj-sub-navigation__list">
    <li class="moj-sub-navigation__item">
      <a
        class="moj-sub-navigation__link"
        aria-current="page"
        href="/?type=direct-producers&amp;tab=pending"
        >Direct producers</a
      >
    </li>
    <li class="moj-sub-navigation__item">
      <a
        class="moj-sub-navigation__link"
        href="/?type=compliance-schemes&amp;tab=pending"
        >Compliance schemes</a
      >
    </li>
  </ul>
</nav>
```

---

## Macro options

| Name              | Type      | Default            | Description                                                      |
| ----------------- | --------- | ------------------ | ---------------------------------------------------------------- |
| `ariaLabel`       | `string`  | `"Sub navigation"` | Accessible label applied to the `<nav>` landmark (`aria-label`). |
| `items`           | `array`   | `[]`               | Array of link item objects `{ text, href, current }`.            |
| `items[].text`    | `string`  | —                  | Display text for the navigation item.                            |
| `items[].href`    | `string`  | —                  | Target URL for the navigation link.                              |
| `items[].current` | `boolean` | `false`            | When `true`, adds `aria-current="page"` to mark the active link. |

---

## Styles

This component includes `dist/components/subnavigation/_index.scss` (imported automatically via `dist/components/_index.scss`), which sets the active `.moj-sub-navigation__link[aria-current="page"]` colour using `--govuk-link-colour`.
