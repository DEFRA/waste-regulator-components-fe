---
layout: default
title: Footer
---

# Footer

The Defra internal footer provides standard links, departmental meta information, support contact details, the Open Government Licence (OGL) v3.0 statement, and the Crown copyright crest.

---

## When to use this component

Use the Defra internal footer at the bottom of every page in internal Defra services, typically placed inside the `footer` block of `page.njk`.

---

## How it works

### Nunjucks macro import

```njk
{% from "footer/macro.njk" import wrcFooter %}

{{ wrcFooter({
  meta: "Department for Environment, Food & Rural Affairs",
  getHelp: {
    heading: "Get help",
    email: "waste-tracking-support@defra.gov.uk",
    telephone: "0300 060 4400",
    hours: "Monday to Friday, 8:30am to 5pm"
  },
  links: [
    { text: "Privacy", href: "/privacy" },
    { text: "Cookies", href: "/cookies" },
    { text: "Accessibility statement", href: "/accessibility" }
  ]
}) }}
```

### HTML output

```html
<footer class="defra-internal-footer">
  <div class="govuk-width-container">
    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
        <div class="govuk-!-margin-bottom-6">
          <h2 class="govuk-heading-s govuk-!-margin-bottom-2">Get help</h2>
          <p class="govuk-body-s govuk-!-margin-bottom-1">Email: <a class="defra-internal-footer__link" href="mailto:waste-tracking-support@defra.gov.uk">waste-tracking-support@defra.gov.uk</a></p>
          <p class="govuk-body-s govuk-!-margin-bottom-1">Telephone: 0300 060 4400</p>
          <p class="govuk-body-s govuk-!-margin-bottom-0">Monday to Friday, 8:30am to 5pm</p>
        </div>
        <p class="govuk-body-s govuk-!-margin-bottom-2">Department for Environment, Food & Rural Affairs</p>
        <h2 class="govuk-visually-hidden">Support links</h2>
        <ul class="govuk-footer__inline-list">
          <li class="govuk-footer__inline-list-item">
            <a class="defra-internal-footer__link" href="/privacy">Privacy</a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="defra-internal-footer__link" href="/cookies">Cookies</a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="defra-internal-footer__link" href="/accessibility">Accessibility statement</a>
          </li>
        </ul>
        <svg aria-hidden="true" focusable="false" class="govuk-footer__licence-logo" ...></svg>
        <span class="govuk-footer__licence-description govuk-body-s govuk-!-margin-bottom-0">
          All content is available under the
          <a class="defra-internal-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">Open Government Licence v3.0</a>, except where otherwise stated
        </span>
      </div>
      <div class="govuk-footer__meta-item">
        <a class="defra-internal-footer__link govuk-footer__copyright-logo govuk-body-s" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">&copy; Crown copyright</a>
      </div>
    </div>
  </div>
</footer>
```

---

## Macro options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `getHelp` | `object` | `undefined` | Optional contact/support block with properties: `heading`, `email`, `emailLabel`, `telephone`, `telephoneLabel`, `hours`. |
| `meta` | `string` | `undefined` | Service or departmental meta line rendered above the support links. |
| `links` | `array` | `[]` | Array of link objects `{ href: string, text: string }` displayed in an inline list. |
| `supportLinksLabel` | `string` | `"Support links"` | Visually hidden heading text for screen readers preceding the link list. |
| `licence` | `boolean` | `true` | Set to `false` to suppress the Open Government Licence logo and description. |
| `oglPrefix` | `string` | `"All content is available under the"` | Prefix text for the licence description. |
| `oglLink` | `string` | `"Open Government Licence v3.0"` | Link text for the OGL v3.0 licence link. |
| `oglSuffix` | `string` | `", except where otherwise stated"` | Suffix text following the licence link. |
| `copyright` | `boolean` | `true` | Set to `false` to suppress the Crown copyright crest. |
| `crownCopyright` | `string` | `"Crown copyright"` | Text for the Crown copyright link. |
