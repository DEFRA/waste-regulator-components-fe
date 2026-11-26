---
layout: default
title: Contributing
---

# Contributing

We welcome contributions to `waste-regulator-components-fe`, from small documentation fixes and research findings to new components.

---

## Contribution process

### 1. Check what already exists

Before proposing a new component or change:

- review the existing [Components](./components/index.md) and [GOV.UK Frontend](https://design-system.service.gov.uk/) to check whether something similar already exists
- search [GitHub Discussions](https://github.com/DEFRA/waste-regulator-components-fe/discussions) and open issues to see if another team has raised the same need
- read the [Contribution criteria](./contribution-criteria.md) so you know what evidence and quality standards apply

### 2. Propose a component or share findings

Anyone can propose a new component or share research findings before writing production code:

- Start or join a thread in [GitHub Discussions](https://github.com/DEFRA/waste-regulator-components-fe/discussions) describing the user need, screenshots, prototype links, or research findings. If a discussion already covers your idea, add your team's examples to it.
- To create a tracked proposal, bug report, or enhancement request, choose a template on [GitHub issues](https://github.com/DEFRA/waste-regulator-components-fe/issues/new/choose).

At the proposal stage, focus on proving the component is **useful** and **unique** — you do not need final code or designs yet.

### 3. Propose a change to a documentation page

Every individual component page includes a **Help improve this page** section at the bottom with a **propose a change to this page on GitHub** link:

1. Select the link to open the page's Markdown file on GitHub (if you do not have direct write access, GitHub will prompt you to fork the repository).
2. Edit the Markdown file and explain why you are making the change in your pull request description.
3. Submit the pull request for review by the maintainers.

### 4. Develop and open a pull request

Once you are ready to build a component or code change, check that it meets the **Before publishing** criteria (**usable**, **consistent**, and **versatile**) in the [Contribution criteria](./contribution-criteria.md), follow the **Development workflow** below, and complete the pull request template (including before and after screenshots for any visual change).

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
3. **Publish to npm and redeploy docs**: Publishing the GitHub Release triggers `.github/workflows/publish.yml` (which syncs `package.json` with the release tag, runs `npm test`, and publishes the package to npm). Once that workflow succeeds, `.github/workflows/pages.yml` runs on `main` via `workflow_run` to rebuild and deploy the documentation site with the new release version in the service navigation.
