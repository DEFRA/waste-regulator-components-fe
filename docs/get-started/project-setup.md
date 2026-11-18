---
layout: default
title: Project setup
---

# Project setup

Configure your Nunjucks view engine, Sass compiler, and asset bundler to use `defra-internal-frontend`.

---

## 1. Configure Nunjucks

Add `node_modules/defra-internal-frontend/dist/components` to your Nunjucks template search paths alongside `govuk-frontend/dist`. This allows templates to import Defra components using standard paths (for example `{% from "defra-internal-header/macro.njk" import defraInternalHeader %}`).

```js
// src/config/nunjucks/nunjucks.js
import path from 'node:path'
import nunjucks from 'nunjucks'

const nunjucksEnvironment = nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist',
    'node_modules/defra-internal-frontend/dist/components',
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

| Helper / Context key | Type | Description |
| --- | --- | --- |
| `t(locale, key, params)` | Function | Global translation function resolving locale strings from dictionaries. |
| `localeUrl(path)` | Function | Helper that prefixes or appends active locale and proxy route prefix to URLs. |
| `locale` | String | Active locale identifier (`'en'` or `'cy'`, defaults to `'en'`). |

---

## 2. Configure Sass

### Define Defra brand colour variables

The Defra header, footer, and service navigation components use `@use "variables" as *;` and require these Sass variables in your stylesheet variables file:

```scss
// src/client/stylesheets/variables/_colours.scss
@use "sass:color";

$defra-internal-brand: #00a33b;
$defra-internal-footer-link: #3b3b3b;

// Navigation band: lightest tint that reads as a band rather than off-white
$defra-internal-nav-background: color.mix(#ffffff, $defra-internal-brand, 92%);

// Link colour on the green band (minimum 4.5:1 contrast ratio)
$defra-internal-link: #00703c;
$defra-internal-link-hover: color.mix(#000000, $defra-internal-link, 40%);
```

### Import component styles in `application.scss`

In your main `application.scss`, import the `defra-internal-frontend` component styles after `govuk-frontend`:

```scss
// src/client/stylesheets/application.scss
@use "govuk-frontend";
@use "defra-internal-frontend/dist/components" as *;

@use "variables";
@use "helpers";
@use "core";
@use "components";

:root {
  --govuk-brand-colour: #00a33b;
  --govuk-template-background-colour: #ffffff;
}
```

> [!TIP]
> If you only need specific components, you can import individual stylesheets instead:
> ```scss
> @use "defra-internal-frontend/dist/components/defra-internal-header";
> @use "defra-internal-frontend/dist/components/defra-internal-footer";
> @use "defra-internal-frontend/dist/components/defra-internal-cookie-banner";
> @use "defra-internal-frontend/dist/components/service-navigation";
> ```

### Configure Sass compiler load paths

Ensure your bundler's Sass compiler resolves `node_modules` and your local stylesheets directory.

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
        loadPaths: [
          '.',
          'node_modules',
          'src/client/stylesheets'
        ],
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

`defra-internal-frontend` provides Defra favicons, `apple-touch-icon.png`, and `govuk-crest.svg` in `dist/assets/images/`. Copy these into your public assets folder alongside `govuk-frontend` assets.

#### Vite (`vite.config.js`)

```js
import fs from 'node:fs'
import path from 'node:path'

const govukAssets = path.join(dirname, 'node_modules/govuk-frontend/dist/govuk/assets')
const defraAssets = path.join(dirname, 'node_modules/defra-internal-frontend/dist/assets')
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
      from: path.join(defraInternalFrontendPath, 'dist/assets'),
      to: 'assets',
      force: true
    }
  ]
})
```

---

## Next steps

Now that your project is configured, see how to build your base layout in the [Page template guide](./page-template.md).
