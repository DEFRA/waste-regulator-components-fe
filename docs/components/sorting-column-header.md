---
layout: default
title: Sorting column header
---

# Sorting column header

The sorting column header component renders an accessible table header cell (`<th scope="col">`) with interactive sorting controls, ARIA sort status (`aria-sort="ascending|descending|none"`), and sort direction icons.

---

## When to use this component

Use this component inside table header rows (`<thead><tr>...</tr></thead>`) when tabular data can be sorted by column.

---

## How it works

### Nunjucks macro import

```njk
{% from "sorting-column-header/macro.njk" import wrcSortingColumnHeader %}

{{ wrcSortingColumnHeader({
  columnName: "organisationName",
  columnLabel: "Organisation name",
  firstColumn: true,
  sortable: true,
  defaultDirection: "asc",
  sort: {
    column: "organisationName",
    direction: "asc",
    baseUrl: "/compliance?filter=all"
  }
}) }}
```

### HTML output

```html
<th
  class="govuk-table__header govuk-!-width-one-quarter"
  scope="col"
  aria-sort="ascending"
>
  <a
    class="govuk-link govuk-link--no-visited-state"
    href="/compliance?filter=all&amp;sort=organisationName[desc]"
  >
    Organisation name
    <svg
      width="22"
      height="22"
      focusable="false"
      aria-hidden="true"
      role="img"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        desc="Sort by Organisation name, asc"
        d="M6.5625 15.5L11 6.63125L15.4375 15.5H6.5625Z"
        fill="currentColor"
      ></path>
    </svg>
  </a>
</th>
```

---

## Macro options

| Name               | Type      | Default     | Description                                                                                     |
| ------------------ | --------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `columnName`       | `string`  | `undefined` | Key name for the column in sort queries (e.g. `"organisationName"`).                            |
| `columnLabel`      | `string`  | `undefined` | User-facing display text for the column header.                                                 |
| `firstColumn`      | `boolean` | `false`     | When `true`, adds `govuk-!-width-one-quarter` class to constrain the first column.              |
| `sortable`         | `boolean` | `true`      | When `false`, renders plain column label text without link or sort icons.                       |
| `defaultDirection` | `string`  | `"asc"`     | Default sort direction when column is clicked from unsorted state (`"asc"` or `"desc"`).        |
| `sort`             | `object`  | `undefined` | Active sorting state object containing `column`, `direction`, and `baseUrl`.                    |
| `sort.column`      | `string`  | `undefined` | Name of the currently sorted column.                                                            |
| `sort.direction`   | `string`  | `undefined` | Current direction (`"asc"` or `"desc"`).                                                        |
| `sort.baseUrl`     | `string`  | `undefined` | Base URL used to form the sort toggle link (`${baseUrl}&sort=${columnName}[${nextDirection}]`). |
