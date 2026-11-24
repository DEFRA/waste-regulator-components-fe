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
