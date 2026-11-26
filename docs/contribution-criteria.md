---
layout: default
title: Contribution criteria
---

# Contribution criteria

All proposals and contributions to `waste-regulator-components-fe` must meet these criteria so components stay high quality, accessible, and relevant to Defra internal services.

---

## New proposals

Before starting a build, a proposed component or major addition needs to be both **useful** and **unique**.

### Useful

There must be evidence that the component or pattern would be useful for multiple Defra teams or internal services.

This could include screenshots or links showing where different teams have needed or built something similar, prototype examples, or research notes explaining the shared user need.

### Unique

The proposal must not replicate something that already exists in [GOV.UK Frontend](https://design-system.service.gov.uk/) or in `waste-regulator-components-fe`.

If it is meant to extend or replace an existing component or pattern, explain why and include evidence showing what needs changing or how the proposal improves on what is there.

---

## Before publishing

Before a new component or update is merged and published, the implementation is reviewed to make sure it is **usable**, **consistent**, and **versatile**.

### Usable

The component must be tested through user research and proven to work well for a representative sample of users, including users with disabilities and those using assistive technologies.

Interactions must follow progressive enhancement principles, meet WCAG 2.2 AA accessibility standards, and work cleanly with keyboard navigation and screen readers.

### Consistent

The component must reuse styles, tokens, spacing, and markup from [GOV.UK Frontend](https://design-system.service.gov.uk/) v6 wherever possible.

- Follow existing naming conventions: `wrc*` for Nunjucks macros and `wrc-` (or `defra-internal-` for chrome extensions) for CSS classes.
- Follow the GOV.UK style guide and Defra domain terminology in guidance and example copy.
- Follow repository code standards: functional JavaScript, DRY and KISS principles, self-contained Sass, Prettier formatting, ESLint/Stylelint rules, and 100% test coverage thresholds.

### Versatile

The implementation must be flexible enough to work across different Defra internal services and environments:

- Avoid hard-coding service-specific text, routes, or business logic inside templates or stylesheets.
- Expose options or macro parameters for labels, links, and classes, with sensible defaults where appropriate.
- Support both production Node.js/Nunjucks apps and the GOV.UK Prototype Kit plugin cleanly.
- Support localisation (`t()`, `localeUrl()`, and Welsh `cy` copy) wherever a component renders user-facing text.

---

## What a component pull request should include

When opening a pull request for a new or updated component, make sure it includes:

1. Component macro/template (`dist/wrc/components/<component>/`) and self-contained stylesheet (`_index.scss`).
2. Registration in `govuk-prototype-kit.config.json` when adding a new `wrc*` Nunjucks macro.
3. Unit, template, Prototype Kit validation, and Sass compilation tests in `tests/` maintaining 100% statement, branch, function, and line coverage.
4. A component documentation page in `docs/components/<component>.md`, a live example in `docs/_examples/<component>.njk`, and entries in `docs/index.md`, `docs/components/index.md`, and `docs/_data/navigation.yml`.
5. Before and after screenshots in the pull request description for any visual change.

---

## Next steps

- Read the [Contributing guide](./contributing.md) for the end-to-end contribution workflow, local checks, and release process.
- Start or join a conversation in [GitHub Discussions](https://github.com/DEFRA/waste-regulator-components-fe/discussions) to propose an idea or share research findings.
- Use the [GitHub issue templates](https://github.com/DEFRA/waste-regulator-components-fe/issues/new/choose) to log a formal component proposal, bug, or improvement.
