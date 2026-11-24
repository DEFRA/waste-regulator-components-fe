---
layout: default
title: Page template
---

# Page template

Create a consistent base page layout for a production Node.js service using `govuk/template.njk` and `waste-regulator-components-fe` components. For GOV.UK Prototype Kit layouts, see [Prototype installation](./prototype-kit.md).

---

## Example base layout (`page.njk`)

Save this layout as `src/server/common/templates/layouts/page.njk` in your project:

```njk
{% set htmlLang = locale %}
{% set themeColor = "#00A33B" %}
{% set bodyClasses = "defra-internal" %}
{% extends "govuk/template.njk" %}

{# Import GOV.UK Frontend components #}
{% from "govuk/components/breadcrumbs/macro.njk" import govukBreadcrumbs %}
{% from "govuk/components/skip-link/macro.njk" import govukSkipLink %}
{% from "govuk/components/back-link/macro.njk" import govukBackLink %}

{# Import WCE internal components #}
{% from "wrc/components/heading/macro.njk" import wrcHeading %}
{% from "wrc/components/header/macro.njk" import wrcHeader %}
{% from "wrc/components/service-header/macro.njk" import wrcServiceHeader %}
{% from "wrc/components/cookie-banner/macro.njk" import wrcCookieBanner %}
{% from "wrc/components/footer/macro.njk" import wrcFooter %}
{% from "wrc/components/google-analytics/macro.njk" import wrcGoogleAnalytics %}

{% block headIcons %}
  <link rel="icon" sizes="48x48" href="{{ assetPath }}/images/favicon.ico?v=2">
  <link rel="icon" sizes="any" href="{{ assetPath }}/images/favicon.svg?v=2" type="image/svg+xml">
  <link rel="apple-touch-icon" href="{{ assetPath }}/images/apple-touch-icon.png?v=2">
{% endblock %}

{% block head %}
  {{ wrcGoogleAnalytics({
    ga4: ga4,
    gtm: gtm,
    allowGoogleAnalytics: allowGoogleAnalytics,
    cspNonce: cspNonce
  }) }}
  <link href="{{ getAssetPath('stylesheets/application.scss') }}" rel="stylesheet">
{% endblock %}

{% block header %}
  {{ wrcHeader({
    organisationName: t(locale, "common.organisationName") | safe,
    navigation: accountNavigation
  }) }}
  {{ wrcServiceHeader({
    serviceName: serviceName,
    serviceUrl: serviceUrl,
    navigationId: "service-navigation",
    navigation: navigation,
    regulatorContext: regulatorContext,
    locale: locale,
    languageSwitcher: languageSwitcher
  }) }}
{% endblock %}

{% block bodyStart %}
  {{ wrcGoogleAnalytics({
    ga4: ga4,
    gtm: gtm,
    allowGoogleAnalytics: allowGoogleAnalytics,
    noscript: true
  }) }}
  {{ wrcCookieBanner({
    hideCookieBanner: hideCookieBanner,
    hasCookiePolicy: hasCookiePolicy,
    cookiePreferenceSet: cookiePreferenceSet,
    allowGoogleAnalytics: allowGoogleAnalytics,
    CSRFToken: CSRFToken,
    locale: locale,
    serviceName: serviceName,
    bannerActionUrl: localeUrl('/cookies/banner'),
    hideBannerActionUrl: localeUrl('/cookies/hide-banner'),
    cookiesUrl: localeUrl('/cookies')
  }) }}
{% endblock %}

{% block pageTitle %}
  {{ pageTitle }} | {{ serviceName }}
{% endblock %}

{% block beforeContent %}
  {% if breadcrumbs.length > 1 %}
    {{ govukBreadcrumbs({ items: breadcrumbs }) }}
  {% endif %}
{% endblock %}

{% block footer %}
  {{ wrcFooter({
    getHelp: {
      heading: t(locale, "common.footer.getHelp"),
      email: helpDeskEmail,
      emailLabel: t(locale, "common.footer.emailLabel"),
      telephone: "0300 060 0002",
      telephoneLabel: t(locale, "common.footer.telephoneLabel"),
      hours: t(locale, "common.footer.hours")
    },
    links: [
      { href: "https://www.gov.uk/help/accessibility-statement", text: t(locale, "common.footer.accessibility") },
      { href: localeUrl("/cookies"), text: t(locale, "common.footer.cookies") },
      { href: "https://www.gov.uk/help/privacy-notice", text: t(locale, "common.footer.privacy") }
    ],
    supportLinksLabel: t(locale, "common.footer.supportLinks"),
    oglPrefix: t(locale, "common.footer.oglPrefix"),
    oglLink: t(locale, "common.footer.oglLink"),
    oglSuffix: t(locale, "common.footer.oglSuffix"),
    crownCopyright: t(locale, "common.footer.crownCopyright")
  }) }}
{% endblock %}

{% block bodyEnd %}
  <script type="module" src="{{ getAssetPath('javascripts/application.js') }}"></script>
{% endblock %}
```

---

## How to use the template in your pages

Page routes in your application extend `layouts/page.njk` and supply the `pageTitle` and `content` blocks:

```njk
{% extends "layouts/page.njk" %}

{% set pageTitle = "Dashboard" %}

{% block content %}
  {{ wrcHeading({
    text: "Regulators' Dashboard",
    caption: "Environment Agency"
  }) }}

  <p class="govuk-body">Welcome to the pEPR service.</p>
{% endblock %}
```

---

## Next steps

Explore the [Component library](../components/index.md) to learn how to configure each individual component macro.
