---
layout: default
title: Organisation link
---

# Organisation link

The organisation link component generates contextual navigation links for organisations, compliance schemes, statements, and certificates.

---

## When to use this component

Use this component in table rows, list items, and search results where an organisation name links directly to either the organisation overview or a specific compliance certificate/statement document based on the presence of an item identifier.

---

## How it works

### Nunjucks macro import

```njk
{% from "organisation-link/macro.njk" import wrcOrganisationLink %}

{# Link to organisation overview (item.id is null) #}
{{ wrcOrganisationLink({
  routePrefix: "/organisations",
  organisationType: "compliance-schemes",
  activeTab: "overview",
  complianceYear: "2026",
  item: {
    organisationId: "ORG-001",
    organisationName: "Acme Recycling Ltd"
  }
}) }}

{# Link to specific document (item.id present) #}
{{ wrcOrganisationLink({
  routePrefix: "/organisations",
  organisationType: "producers",
  activeTab: "certificates",
  item: {
    id: "CERT-456",
    organisationId: "ORG-002",
    organisationName: "Northern Packaging Ltd"
  }
}) }}
```

### HTML output

```html
<a href="/organisations/ORG-001?obligationYear=2026&amp;type=compliance-schemes&amp;tab=overview" class="govuk-link govuk-link--no-visited-state">Acme Recycling Ltd</a>
```

---

## Macro options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `routePrefix` | `string` | `undefined` | URL base route prefix for organisation URLs (e.g. `"/organisations"`). |
| `organisationType` | `string` | `undefined` | Organisation category (`"compliance-schemes"` determines document type as `"statement"`; other types use `"certificate"`). |
| `activeTab` | `string` | `undefined` | Tab query parameter passed to the target view. |
| `complianceYear` | `string \| number` | `undefined` | Obligation year query parameter when linking without a document ID. |
| `item` | `object` | `undefined` | Data object with `organisationId`, `organisationName`, and optional document `id`. |
| `item.organisationId` | `string \| number` | `undefined` | Identifier for the organisation. |
| `item.organisationName` | `string` | `undefined` | Display label for the link. |
| `item.id` | `string \| number \| null` | `undefined` | Document ID. When present, targets `/:routePrefix/:orgId/:documentType/:id`. When null/omitted, targets `/:routePrefix/:orgId`. |
