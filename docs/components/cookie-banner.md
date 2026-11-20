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

## How it works

### Nunjucks macro import

```njk
{% from "wrc/components/cookie-banner/macro.njk" import wrcCookieBanner %}

{{ wrcCookieBanner({
  serviceName: "Waste Tracking Service",
  CSRFToken: csrfToken,
  cookiePreferenceSet: false,
  hasCookiePolicy: false,
  allowGoogleAnalytics: false,
  bannerActionUrl: "/cookies/banner",
  hideBannerActionUrl: "/cookies/hide-banner",
  cookiesUrl: "/cookies",
  locale: "en"
}) }}
```

### HTML output (when preference has not been set)

```html
<form action="/cookies/banner" method="post" novalidate>
  <input
    id="cookie-banner-csrf-crumb"
    type="hidden"
    name="CSRFToken"
    value="csrf-token-string"
  />
  <div
    class="govuk-cookie-banner"
    data-nosnippet
    role="region"
    aria-label="Cookies on Waste Tracking Service"
  >
    <div class="govuk-cookie-banner__message govuk-width-container">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h2 class="govuk-cookie-banner__heading govuk-heading-m">
            Cookies on Waste Tracking Service
          </h2>
          <div class="govuk-cookie-banner__content">
            <p class="govuk-body">
              We use some essential cookies to make this service work.
            </p>
            <p class="govuk-body">
              We’d also like to use analytics cookies so we can understand how
              you use the service and make improvements.
            </p>
          </div>
        </div>
      </div>
      <div class="govuk-button-group">
        <button
          type="submit"
          name="analytics"
          value="yes"
          class="govuk-button"
          data-module="govuk-button"
        >
          Accept analytics cookies
        </button>
        <button
          type="submit"
          name="analytics"
          value="no"
          class="govuk-button"
          data-module="govuk-button"
        >
          Reject analytics cookies
        </button>
        <a class="govuk-link" href="/cookies">View cookies</a>
      </div>
    </div>
  </div>
</form>
```

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

## Examples

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
