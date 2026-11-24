---
layout: default
title: Project setup
---

# Project setup

Configure your production Node.js project's Nunjucks view engine, Sass compiler, and asset bundler to use `waste-regulator-components-fe`. If you are using the GOV.UK Prototype Kit, these steps are handled automatically — see [Prototype installation](./prototype-kit.md).

---

## 1. Configure Nunjucks

Add `node_modules/waste-regulator-components-fe/dist` to your Nunjucks template search paths alongside `govuk-frontend/dist`. This allows templates to import Defra components using namespaced paths matching GOV.UK Frontend (for example `{% from "wrc/components/header/macro.njk" import wrcHeader %}`).

```js
// src/config/nunjucks/nunjucks.js
import path from 'node:path'
import nunjucks from 'nunjucks'

const nunjucksEnvironment = nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist',
    'node_modules/waste-regulator-components-fe/dist',
    path.resolve(dirname, '../../server/common/templates'),
    path.resolve(dirname, '../../server/routes')
  ],
  {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true
  }
)
```

### Required Nunjucks globals and context helpers

Several Defra components rely on standard internationalisation and routing helpers registered in your Nunjucks environment or view context:

| Helper / Context key     | Type     | Description                                                                   |
| ------------------------ | -------- | ----------------------------------------------------------------------------- |
| `t(locale, key, params)` | Function | Global translation function resolving locale strings from dictionaries.       |
| `localeUrl(path)`        | Function | Helper that prefixes or appends active locale and proxy route prefix to URLs. |
| `locale`                 | String   | Active locale identifier (`'en'` or `'cy'`, defaults to `'en'`).              |

---

## 2. Configure Sass

### Customise Defra brand colour variables (optional)

`waste-regulator-components-fe` ships default Defra colour variables (`!default`) in `dist/wrc/_variables.scss`, so no separate `variables` module is required:

```scss
// Default values in dist/wrc/_variables.scss
$defra-internal-brand: #00a33b !default;
$defra-internal-footer-link: #3b3b3b !default;
$defra-internal-nav-background: color.mix(
  #ffffff,
  $defra-internal-brand,
  92%
) !default;
$defra-internal-link: #00703c !default;
$defra-internal-link-hover: color.mix(
  #000000,
  $defra-internal-link,
  40%
) !default;
```

You can optionally override any variable with a Sass `@use ... with (...)` clause when importing the package:

```scss
@use 'waste-regulator-components-fe/dist/wrc/index' as * with (
  $defra-internal-brand: #00a33b
);
```

### Import component styles in `application.scss`

In your main `application.scss`, import the `waste-regulator-components-fe` component styles after `govuk-frontend`:

```scss
// src/client/stylesheets/application.scss
@use 'govuk-frontend';
@use 'waste-regulator-components-fe/dist/wrc/index' as *;

:root {
  --govuk-brand-colour: #00a33b;
  --govuk-template-background-colour: #ffffff;
}
```

> [!TIP]
> If you only need specific components, you can import individual stylesheets instead:
>
> ```scss
> @use 'waste-regulator-components-fe/dist/wrc/components/header';
> @use 'waste-regulator-components-fe/dist/wrc/components/footer';
> @use 'waste-regulator-components-fe/dist/wrc/components/cookie-banner';
> @use 'waste-regulator-components-fe/dist/wrc/components/service-header';
> ```

### Configure Sass compiler load paths

Ensure your bundler's Sass compiler resolves the directory containing `node_modules` (usually the project root `.`, or the workspace root in a monorepo) alongside `node_modules` so `node_modules/govuk-frontend/dist/govuk/base` resolves cleanly.

#### Vite (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import { NodePackageImporter } from 'sass-embedded'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        importers: [new NodePackageImporter()],
        loadPaths: ['.', 'node_modules', 'src/client/stylesheets'],
        quietDeps: true
      }
    }
  }
})
```

#### Webpack (`webpack.config.js`)

```js
{
  test: /\.scss$/,
  use: [
    'postcss-loader',
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          loadPaths: [
            dirname,
            path.join(dirname, 'node_modules'),
            path.join(dirname, 'src/client/stylesheets')
          ],
          quietDeps: true
        }
      }
    }
  ]
}
```

---

## 3. Copy static image assets

`waste-regulator-components-fe` provides Defra favicons, `apple-touch-icon.png`, and `govuk-crest.svg` in `dist/wrc/assets/images/`. Copy these into your public assets folder alongside `govuk-frontend` assets.

#### Vite (`vite.config.js`)

```js
import fs from 'node:fs'
import path from 'node:path'

const govukAssets = path.join(
  dirname,
  'node_modules/govuk-frontend/dist/govuk/assets'
)
const defraAssets = path.join(
  dirname,
  'node_modules/waste-regulator-components-fe/dist/wrc/assets'
)
const dest = path.join(dirname, 'src/client/static/assets')

fs.cpSync(govukAssets, dest, {
  recursive: true,
  force: false,
  filter: (src) => !src.endsWith('manifest.json')
})
fs.cpSync(defraAssets, dest, {
  recursive: true,
  force: true
})
```

#### Webpack (`webpack.config.js`)

```js
import CopyPlugin from 'copy-webpack-plugin'

new CopyPlugin({
  patterns: [
    {
      from: path.join(govukFrontendPath, 'dist/govuk/assets'),
      to: 'assets'
    },
    {
      from: path.join(wrcPath, 'dist/wrc/assets'),
      to: 'assets',
      force: true
    }
  ]
})
```

---

## Next steps

Now that your project is configured, see how to build your base layout in the [Page template guide](./page-template.md).
