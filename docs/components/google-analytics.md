---
layout: default
title: Google Analytics
---

# Google Analytics

The Google Analytics component renders Google tag (`gtag.js`) and Google Tag Manager (GTM) scripts with strict Google Consent Mode v2 defaults (`denied`), dynamic consent elevation (`granted` when accepted), CSP nonce support, and `<noscript>` fallback containers.

---

## When to use this component

Use this component to track analytics in accordance with Defra and GOV.UK cookie consent rules:

1. In the document `<head>` (`headIcons` or `head` block) to load the gtag/GTM scripts with default denied consent.
2. At the top of `<body>` (`bodyStart` block) with `noscript: true` to provide a fallback `<noscript>` iframe for non-JS clients when consent is granted.

---

## How it works

### Nunjucks macro import

```njk
{% from "google-analytics/macro.njk" import wrcGoogleAnalytics %}

{# Head scripts (default consent is denied until allowGoogleAnalytics is true) #}
{{ wrcGoogleAnalytics({
  ga4: "G-EXAMPLE123",
  gtm: "GTM-EXAMPLE",
  allowGoogleAnalytics: allowGoogleAnalytics,
  cspNonce: cspNonce
}) }}

{# Body noscript fallback #}
{{ wrcGoogleAnalytics({
  gtm: "GTM-EXAMPLE",
  allowGoogleAnalytics: allowGoogleAnalytics,
  noscript: true
}) }}
```

### Consent Mode v2

The script automatically initializes `dataLayer` and sets default consent:

```js
gtag('consent', 'default', {
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  ad_storage: 'denied',
  analytics_storage: 'denied'
})
```

When `allowGoogleAnalytics` is `true`, it issues:

```js
gtag('consent', 'update', {
  analytics_storage: 'granted'
})
```

---

## Macro options

| Name                   | Type      | Default     | Description                                                                                         |
| ---------------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `ga4`                  | `string`  | `undefined` | Google Analytics 4 Measurement ID (required for script tag rendering).                              |
| `gtm`                  | `string`  | `undefined` | Google Tag Manager Container ID (required).                                                         |
| `allowGoogleAnalytics` | `boolean` | `false`     | When `true`, updates Consent Mode `analytics_storage` to `granted` and enables `<noscript>` iframe. |
| `cspNonce`             | `string`  | `""`        | Content Security Policy nonce attribute attached to all `<script>` tags.                            |
| `noscript`             | `boolean` | `false`     | When `true`, renders the `<noscript>` iframe for body insertion rather than head `<script>` tags.   |
