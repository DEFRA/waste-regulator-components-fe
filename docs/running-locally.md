---
layout: default
title: Running documentation locally
---

# Running documentation locally

How to build and preview the Defra Internal Design System documentation site locally without installing Ruby or Jekyll.

---

## Prerequisites

Before starting the local documentation server, make sure you have:

- **Node.js** (`>=22`)
- Project dependencies installed with `npm install`

---

## Start the local documentation server

Run:

```bash
npm run docs:start
```

This runs `scripts/serve-docs.js`, which:

1. Compiles `docs/assets/scss/docs.scss` into `docs/assets/css/docs.css` using the shared Defra/GOV.UK Sass configuration.
2. Copies static images from `dist/wrc/assets/images/` into `docs/assets/images/`.
3. Starts a local Hapi server at `http://localhost:1999`.

Markdown pages and `docs/_layouts/default.html` are read on each request, so changes to `.md` files or layouts appear after refreshing the browser. Changes to `docs/_config.yml`, `docs/_data/navigation.yml`, SCSS files, or images require restarting `npm run docs:start` (or re-running `npm run docs:build` for CSS and images).

---

## Changing the port

Set the `PORT` environment variable to serve the documentation on a different port:

```bash
PORT=8080 npm run docs:start
```

---

## Building documentation assets only

To compile `docs/assets/css/docs.css` and copy `dist/wrc/assets/images/` without starting the server, run:

```bash
npm run docs:build
```

This executes `scripts/build-docs.js` (the same asset build step run by `.github/workflows/pages.yml` before Jekyll deploys to GitHub Pages). Both `docs/assets/css/` and `docs/assets/images/` are generated outputs and are ignored by Git.

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
- [Defra Internal Design System home](./index.md)
