---
layout: default
title: Running documentation locally
---

# Running documentation locally

How to build and preview the WCE internal design system documentation site locally without installing Ruby or Jekyll.

---

## Prerequisites

Before starting the local documentation server, make sure you have:

- **Node.js** (`>=20`, LTS `>=22` recommended)
- Project dependencies installed with `npm install`

---

## Start the local documentation server

Run:

```bash
npm run docs:start
```

This runs `scripts/serve-docs.js`, which:

1. Compiles `docs/assets/scss/docs.scss` into `docs/assets/css/docs.css` using the shared WCE internal/GOV.UK Sass configuration.
2. Copies static images from `dist/wrc/assets/images/` into `docs/assets/images/`.
3. Writes the current release version tag to `docs/_data/release.yml` (from the latest `vX.Y.Z` Git tag, falling back to `package.json`).
4. Starts a local Hapi server intentionally bound to `localhost` only (`http://localhost:1999`) so the development preview is not exposed on other network interfaces.

Markdown pages and `docs/_layouts/default.html` are read on each request, so changes to `.md` files or layouts appear after refreshing the browser. Changes to `docs/_config.yml`, `docs/_data/navigation.yml`, `docs/_data/release.yml`, SCSS files, or images require restarting `npm run docs:start` (or re-running `npm run docs:build` for CSS, images, and release data).

---

## Changing the port

Set the `PORT` environment variable to serve the documentation on a different port (must be an integer between `1` and `65535`; invalid values fail at startup with a `RangeError`):

**macOS / Linux (Bash / Zsh):**

```bash
PORT=8080 npm run docs:start
```

**Windows (PowerShell):**

```powershell
$env:PORT=8080; npm run docs:start
```

---

## Building documentation assets only

To compile `docs/assets/css/docs.css`, copy `dist/wrc/assets/images/`, and write `docs/_data/release.yml` without starting the server, run:

```bash
npm run docs:build
```

This executes `scripts/build-docs.js` (the same asset build step run by `.github/workflows/pages.yml` before Jekyll deploys to GitHub Pages). `docs/assets/css/`, `docs/assets/images/`, and `docs/_data/release.yml` are generated outputs and are ignored by Git.

---

## Local preview vs. GitHub Pages

GitHub Pages builds Markdown with Jekyll using `kramdown` and `Rouge` syntax highlighting (`docs/_config.yml`), whereas `npm run docs:start` renders Markdown with `marked` (GitHub Flavored Markdown) and LiquidJS without Rouge syntax highlighting. Layout, navigation, relative links, and compiled CSS/images match the published site, while code-block syntax highlighting appears only in the Jekyll/GitHub Pages build.

---

## Running documentation tests

Verify documentation frontmatter, navigation links, asset builds, and local server routing:

```bash
npx vitest run tests/scripts/build-docs.test.js tests/scripts/serve-docs.test.js
```

Or run the full test suite and coverage check with `npm test`.

---

## Related guides

- [Contributing and semantic commits](./contributing.md)
- [WCE internal design system home](./index.md)
