---
layout: default
title: Header
---

# Header

The Defra internal header displays the departmental identity lock-up, the official Royal Crest, and an optional signed-in user account menu.

---

## When to use this component

Use the Defra internal header at the top of all pages in internal Defra services. It pairs with the [Service header](./service-header.md) directly below it.

---

## Macro parameters

| Name               | Type   | Required | Description                                                                                                                            |
| ------------------ | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `organisationName` | String | No       | HTML or plain text rendered inside the lock-up. Defaults to `"Department for Environment,<br>Food &amp; Rural Affairs"`.               |
| `navigation`       | Array  | No       | List of account navigation items (`[{ text, href, current, visuallyHiddenText }]`). Omit on signed-out pages to hide the account menu. |

### Navigation item options

| Key                  | Type    | Description                                                                  |
| -------------------- | ------- | ---------------------------------------------------------------------------- |
| `text`               | String  | Display text for the item (e.g. user name or "Sign out").                    |
| `href`               | String  | Target URL. If omitted, the item renders as plain text.                      |
| `current`            | Boolean | When `true`, adds `aria-current="page"`.                                     |
| `visuallyHiddenText` | String  | Screen-reader prefix rendered inside `<span class="govuk-visually-hidden">`. |

---

## Stylesheet

To import styles for this component individually:

```scss
@use 'waste-regulator-components-fe/dist/wrc/components/header';
```
