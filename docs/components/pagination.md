---
layout: default
title: Pagination
---

# Pagination

The pagination component renders accessible GOV.UK pagination navigation for multi-page lists and data tables. It handles truncated page lists with ellipsis (`&ctdot;`), previous/next links, and screen reader announcements.

---

## When to use this component

Use this component directly below data tables or search result lists when results span across multiple pages.

---

## How it works

The pagination component is implemented as a Nunjucks template partial rather than a macro, reading directly from the `pagination` object in the rendering context.

### Template include

```njk
{% include "defra-internal-frontend/components/pagination/template.njk" %}
```

Or when `node_modules/defra-internal-frontend/dist/components` is included in Nunjucks search paths:

```njk
{% include "pagination/template.njk" %}
```

### Context variables

Pass a `pagination` object into your template view context:

```js
const context = {
  pagination: {
    currentPage: 2,
    totalPages: 10,
    baseUrl: '/records?status=active'
  },
  locale: 'en' // optional, defaults to 'en'
}
```

### HTML output

```html
<nav class="govuk-pagination" aria-label="Pagination">
  <div class="govuk-pagination__prev">
    <a
      class="govuk-link govuk-pagination__link"
      href="/records?status=active&amp;page=1"
      rel="prev"
    >
      <svg
        class="govuk-pagination__icon govuk-pagination__icon--prev"
        ...
      ></svg>
      <span class="govuk-pagination__link-title">Previous</span>
    </a>
  </div>
  <ul class="govuk-pagination__list">
    <li class="govuk-pagination__item">
      <a
        class="govuk-link govuk-pagination__link"
        href="/records?status=active&amp;page=1"
        aria-label="Page 1"
        >1</a
      >
    </li>
    <li class="govuk-pagination__item govuk-pagination__item--current">
      <a
        class="govuk-link govuk-pagination__link"
        href="/records?status=active&amp;page=2"
        aria-label="Page 2"
        aria-current="page"
        >2</a
      >
    </li>
    <li class="govuk-pagination__item govuk-pagination__item--ellipsis">
      &ctdot;
    </li>
    <li class="govuk-pagination__item">
      <a
        class="govuk-link govuk-pagination__link"
        href="/records?status=active&amp;page=10"
        aria-label="Page 10"
        >10</a
      >
    </li>
  </ul>
  <div class="govuk-pagination__next">
    <a
      class="govuk-link govuk-pagination__link"
      href="/records?status=active&amp;page=3"
      rel="next"
    >
      <span class="govuk-pagination__link-title">Next</span>
      <svg
        class="govuk-pagination__icon govuk-pagination__icon--next"
        ...
      ></svg>
    </a>
  </div>
</nav>
```

---

## Context schema

| Property                 | Type     | Description                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------- |
| `pagination.currentPage` | `number` | The current active 1-indexed page number.                           |
| `pagination.totalPages`  | `number` | The total count of available pages. If `<= 1`, nothing is rendered. |
| `pagination.baseUrl`     | `string` | Base URL used to construct page links (`${baseUrl}&page=${i}`).     |
| `locale`                 | `string` | Optional locale (`"en"` or `"cy"`).                                 |
