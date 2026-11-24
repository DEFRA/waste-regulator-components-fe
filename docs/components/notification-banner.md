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

---

## Stylesheet import

Included automatically via `dist/wrc/components/_index.scss` (or imported individually via `@use 'waste-regulator-components-fe/dist/wrc/components/notification-banner';`).
