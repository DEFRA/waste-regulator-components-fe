---
layout: default
title: Contributing
---

# Contributing

We welcome contributions to `waste-regulator-components-fe`.

---

## Development workflow

1. Fork or branch from `main`.
2. Ensure JavaScript changes follow functional patterns, DRY, and KISS principles.
3. Write unit tests in `tests/` covering all cases (maintaining 100% statement, branch, function, and line coverage).
4. Update or add component and guide documentation under `docs/`.
5. Verify checks locally before opening a pull request:

```bash
npm run format:check
npm run lint
npm test
npm run example:test
```

Husky also runs `npm run git:pre-commit-hook` (`security-audit`, `format:check`, `lint`, and `test`) before each commit via `.husky/pre-commit`.

### Previewing documentation locally

See the [Running documentation locally](./running-locally.md) guide for prerequisites, starting the local server (`npm run docs:start`), overriding the port, and building documentation assets (`npm run docs:build`).

---

## Semantic commits and automated release notes

Release notes and semantic version bumps are automated from [Conventional Commits](https://www.conventionalcommits.org/) using `git-cliff` (`cliff.toml`), based on Tim Abell's article [Automatic release notes with semantic commits and git-cliff](https://0x5.uk/2026/03/12/automatic-release-notes-with-semantic-commits-and-git-cliff/).

### Commit message prefixes

- `feat:` — new features (`minor` version bump)
- `fix:`, `perf:`, `content:`, `style:`, `refactor:`, `security:` — fixes and improvements (`patch` version bump)
- `docs:` — documentation entries included in release notes
- `feat!:` or a `BREAKING CHANGE:` footer — breaking changes (`major` version bump)
- Optional footer overrides: `bump: major`, `bump: minor`, or `bump: patch`

Commits with prefixes such as `chore:` do not trigger a version bump (`none`) unless a footer override or breaking change is present.

### JIRA ticket tracking

Include a ticket URL in the commit body or footer to surface JIRA references in generated release notes:

- `https://eaflood.atlassian.net/browse/<TICKET>` — listed under **Related Tickets**
- `Fixes https://eaflood.atlassian.net/browse/<TICKET>` or `Closes https://eaflood.atlassian.net/browse/<TICKET>` — listed under **Completed Tickets**

### Local commands

```bash
npm run release-notes:preview       # Preview unreleased changes since the latest tag
npm run release-notes               # Generate notes for the latest release tag
npm run release-notes:bump          # Print calculated bump (major | minor | patch | none)
npm run release-notes:next-version  # Print next semantic version tag
```

### CI release lifecycle

1. **Pull request preview**: Opening or updating a PR targeting `main` runs `.github/workflows/pr-release-notes.yml`, posting and updating a preview comment with the calculated version bump and release notes.
2. **Draft release on `main`**: Merging into `main` runs `.github/workflows/release.yml`, which creates or updates a Draft GitHub Release when a version bump is detected.
3. **Publish to npm**: Publishing the GitHub Release triggers `.github/workflows/publish.yml` (which syncs `package.json` with the release tag, runs `npm test`, and publishes the package to npm) and `.github/workflows/pages.yml` (which rebuilds and deploys the documentation site with the new release version in the service navigation).
