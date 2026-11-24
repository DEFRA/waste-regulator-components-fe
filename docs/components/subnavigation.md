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

This component includes `dist/wrc/components/subnavigation/_index.scss` (imported automatically via `dist/wrc/components/_index.scss`), which sets the active `.moj-sub-navigation__link[aria-current="page"]` colour using `--govuk-link-colour`.
