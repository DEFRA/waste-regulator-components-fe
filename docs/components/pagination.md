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

---

## Context schema

| Property                 | Type     | Description                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------- |
| `pagination.currentPage` | `number` | The current active 1-indexed page number.                           |
| `pagination.totalPages`  | `number` | The total count of available pages. If `<= 1`, nothing is rendered. |
| `pagination.baseUrl`     | `string` | Base URL used to construct page links (`${baseUrl}&page=${i}`).     |
| `locale`                 | `string` | Optional locale (`"en"` or `"cy"`).                                 |
