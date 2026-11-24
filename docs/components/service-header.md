---
layout: default
title: Service header
---

# Service header

The Defra internal service header provides the green service navigation band (wrapping `govukServiceNavigation`) and an English/Welsh language toggle bar directly below it.

---

## When to use this component

Use this component directly below the [Header](./header.md) on every page. It establishes the service identity, current navigation area, the user's regulator organisation, and bilingual switching.

---

## How it works

### Nunjucks macro import

```njk
{% from "wrc/components/service-header/macro.njk" import wrcServiceHeader %}

{{ wrcServiceHeader({
  serviceName: "pEPR: Regulators' Service",
  serviceUrl: "/home",
  navigationId: "service-navigation",
  navigation: [
    { text: "Home", href: "/home", current: true },
    { text: "About", href: "/about" }
  ],
  regulatorContext: '<div class="defra-internal-service-navigation__context">Environment Agency</div>',
  locale: "en",
  languageSwitcher: {
    en: "/home?lang=en",
    cy: "/home?lang=cy"
  }
}) }}
```

---

## Macro parameters

| Name               | Type   | Required | Description                                                                        |
| ------------------ | ------ | -------- | ---------------------------------------------------------------------------------- |
| `serviceName`      | String | Yes      | The name of your service.                                                          |
| `serviceUrl`       | String | Yes      | Link URL for the service name.                                                     |
| `navigationId`     | String | No       | The `id` attribute for the navigation `<ul>`. Defaults to `"service-navigation"`.  |
| `navigation`       | Array  | No       | Navigation items passed to `govukServiceNavigation` (`[{ text, href, current }]`). |
| `regulatorContext` | String | No       | HTML string rendered in the `slots.end` position of the service navigation band.   |
| `locale`           | String | No       | Current locale (`'en'` or `'cy'`). Defaults to `'en'`.                             |
| `languageSwitcher` | Object | Yes      | URLs for language toggling: `{ en: string, cy: string }`.                          |

---

## Stylesheet

To import styles for this component individually:

```scss
@use 'waste-regulator-components-fe/dist/wrc/components/service-header';
```
