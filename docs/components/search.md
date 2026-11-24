---
layout: default
title: Search
---

# Search

The search component renders an accessible search input and submit button panel with customizable GET form action, inline validation error support, Welsh language propagation, and arbitrary hidden state fields.

---

## When to use this component

Use this component above filtered tables or record lists where users need to search by keyword (for example, organisation name or ID) while preserving active view query state (such as active tab, filter type, or sort order).

---

## Macro options

| Name           | Type     | Default                      | Description                                                                                                                                                                        |
| -------------- | -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`       | `string` | `"/"`                        | Target URL for the GET `<form>` submission.                                                                                                                                        |
| `locale`       | `string` | `"en"`                       | Active locale code (`"en"` or `"cy"`). When `"cy"`, outputs `<input type="hidden" name="lang" value="cy">` and defaults button text via `t('cy', 'common.search')`.                |
| `hiddenFields` | `object` | `undefined`                  | Optional key-value map of hidden `<input type="hidden">` fields rendered inside the form. Nullish (`null`/`undefined`) values and duplicate `lang` keys in Welsh mode are skipped. |
| `label`        | `string` | `undefined`                  | Label text for the search input (`govukInput`).                                                                                                                                    |
| `id`           | `string` | `"search"`                   | HTML `id` attribute for the `<input>`.                                                                                                                                             |
| `name`         | `string` | `"search"`                   | Form field `name` attribute for the `<input>`.                                                                                                                                     |
| `searchTerm`   | `string` | `undefined`                  | Current search input value.                                                                                                                                                        |
| `buttonText`   | `string` | `t(locale, "common.search")` | Text displayed on the submit button (`"Search"` in English, `"Chwilio"` in Welsh).                                                                                                 |
| `errorMessage` | `object` | `undefined`                  | GOV.UK `govukInput` error message object (for example `{ text: "Enter at least 3 characters" }`).                                                                                  |

---

## More examples

### Search with validation error

```njk
{{ wrcSearch({
  action: "/organisations",
  label: "Search organisations",
  searchTerm: "ab",
  errorMessage: { text: "Enter at least 3 characters" }
}) }}
```
