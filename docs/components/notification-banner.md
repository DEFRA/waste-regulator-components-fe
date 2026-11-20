---
layout: default
title: Notification banner
---

# Notification banner

The notification banner stylesheet provides the `.wrc-notification-banner--cancelled` modifier class for GOV.UK notification banners representing cancelled compliance records.

---

## When to use this component

Use the `.wrc-notification-banner--cancelled` modifier class alongside `govukNotificationBanner` when notifying regulators that a certificate or statement has been cancelled.

---

## How it works

GOV.UK Frontend provides default (blue Important) and `govuk-notification-banner--success` (green) banner variants, but no dark grey variant for cancelled state notifications. This stylesheet sets both `border-color` and `background-color` to legacy GOV.UK dark grey (`#505a5f`) within `govuk-exports("wrc/component/notification-banner")`.

### Nunjucks macro usage

```njk
{% from "govuk/components/notification-banner/macro.njk" import govukNotificationBanner %}

{{ govukNotificationBanner({
  titleText: "Cancelled",
  classes: "wrc-notification-banner--cancelled",
  html: "<p class=\"govuk-notification-banner__heading\">This certificate has been cancelled.</p>"
}) }}
```

### HTML output

```html
<div
  class="govuk-notification-banner wrc-notification-banner--cancelled"
  role="region"
  aria-labelledby="govuk-notification-banner-title"
  data-module="govuk-notification-banner"
>
  <div class="govuk-notification-banner__header">
    <h2
      class="govuk-notification-banner__title"
      id="govuk-notification-banner-title"
    >
      Cancelled
    </h2>
  </div>
  <div class="govuk-notification-banner__content">
    <p class="govuk-notification-banner__heading">
      This certificate has been cancelled.
    </p>
  </div>
</div>
```

---

## Stylesheet import

Included automatically via `dist/components/_index.scss` (or imported individually via `@use "dist/components/notification-banner";`).
