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

## How it works

### Nunjucks macro import

```njk
{% from "header/macro.njk" import wrcHeader %}

{{ wrcHeader({
  organisationName: "Department for Environment,<br>Food &amp; Rural Affairs",
  navigation: [
    { text: "Jane Doe", visuallyHiddenText: "Signed in as " },
    { text: "Sign out", href: "/logout" }
  ]
}) }}
```

### HTML output

```html
<header class="defra-internal-header">
  <div class="govuk-width-container">
    <div class="defra-internal-header__main">
      <div class="defra-internal-header__logo">
        <span class="defra-internal-header__logo-link">
          Department for Environment,<br />Food &amp; Rural Affairs
        </span>
      </div>
      <div class="defra-internal-header__account-menu">
        <ul>
          <li>
            <span class="govuk-visually-hidden">Signed in as </span>Jane Doe
          </li>
          <li><a href="/logout">Sign out</a></li>
        </ul>
      </div>
    </div>
  </div>
</header>
```

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
@use 'defra-internal-frontend/dist/components/header';
```
