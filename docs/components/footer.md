---
layout: default
title: Footer
---

# Footer

The WCE internal footer provides standard links, departmental meta information, support contact details, the Open Government Licence (OGL) v3.0 statement, and the Crown copyright crest.

---

## When to use this component

Use the WCE internal footer at the bottom of every page in WCE internal services, typically placed inside the `footer` block of `page.njk`.

---

## Macro options

| Name                | Type      | Default                                | Description                                                                                                               |
| ------------------- | --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `getHelp`           | `object`  | `undefined`                            | Optional contact/support block with properties: `heading`, `email`, `emailLabel`, `telephone`, `telephoneLabel`, `hours`. |
| `meta`              | `string`  | `undefined`                            | Service or departmental meta line rendered above the support links.                                                       |
| `links`             | `array`   | `[]`                                   | Array of link objects `{ href: string, text: string }` displayed in an inline list.                                       |
| `supportLinksLabel` | `string`  | `"Support links"`                      | Visually hidden heading text for screen readers preceding the link list.                                                  |
| `licence`           | `boolean` | `true`                                 | Set to `false` to suppress the Open Government Licence logo and description.                                              |
| `oglPrefix`         | `string`  | `"All content is available under the"` | Prefix text for the licence description.                                                                                  |
| `oglLink`           | `string`  | `"Open Government Licence v3.0"`       | Link text for the OGL v3.0 licence link.                                                                                  |
| `oglSuffix`         | `string`  | `", except where otherwise stated"`    | Suffix text following the licence link.                                                                                   |
| `copyright`         | `boolean` | `true`                                 | Set to `false` to suppress the Crown copyright crest.                                                                     |
| `crownCopyright`    | `string`  | `"Crown copyright"`                    | Text for the Crown copyright link.                                                                                        |
