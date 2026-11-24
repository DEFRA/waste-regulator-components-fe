---
layout: default
title: Cookie banner
---

# Cookie banner

The Defra internal cookie banner prompts users to accept or reject Google Analytics cookies and shows a confirmation message after a preference has been selected. It integrates with GOV.UK Cookie Banner components and CSRF token protection.

---

## When to use this component

Use the Defra internal cookie banner at the very top of your page template, directly inside the `bodyStart` block (before the header).

---

## Macro options

| Name                   | Type      | Default                  | Description                                                                                                                |
| ---------------------- | --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `serviceName`          | `string`  | `undefined`              | Service name interpolated into banner aria-label and heading.                                                              |
| `CSRFToken`            | `string`  | `undefined`              | CSRF token rendered in the hidden input for post actions.                                                                  |
| `hideCookieBanner`     | `boolean` | `false`                  | If `true`, suppresses rendering the cookie banner altogether.                                                              |
| `hasCookiePolicy`      | `boolean` | `false`                  | If `true`, suppresses the initial prompt banner (e.g. on the cookie policy page itself).                                   |
| `cookiePreferenceSet`  | `boolean` | `false`                  | If `true`, displays the confirmation banner with a "Hide cookie message" action.                                           |
| `allowGoogleAnalytics` | `boolean` | `false`                  | When `cookiePreferenceSet` is `true`, toggles whether the confirmation message states analytics were accepted or rejected. |
| `bannerActionUrl`      | `string`  | `"/cookies/banner"`      | The POST endpoint URL for accepting or rejecting cookies.                                                                  |
| `hideBannerActionUrl`  | `string`  | `"/cookies/hide-banner"` | The POST endpoint URL for dismissing the confirmation message.                                                             |
| `cookiesUrl`           | `string`  | `"/cookies"`             | Link destination for "View cookies" and inside the confirmation text.                                                      |
| `locale`               | `string`  | `"en"`                   | Locale code passed to the `t()` translation helper (`en` or `cy`).                                                         |

---

## More examples

### Cookie preference confirmation

```njk
{{ wrcCookieBanner({
  serviceName: "Waste Tracking Service",
  CSRFToken: csrfToken,
  cookiePreferenceSet: true,
  allowGoogleAnalytics: true
}) }}
```

### Suppressing on cookie policy pages

```njk
{{ wrcCookieBanner({
  serviceName: "Waste Tracking Service",
  CSRFToken: csrfToken,
  hasCookiePolicy: true
}) }}
```
