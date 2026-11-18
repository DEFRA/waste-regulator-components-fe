import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import nunjucks from 'nunjucks'
import { load } from 'cheerio'
import { camelCase } from 'lodash'

import { translate } from './translate.js'

const require = createRequire(import.meta.url)
const dirname = path.dirname(fileURLToPath(import.meta.url))
const govukFrontendDist = path.join(
  path.dirname(require.resolve('govuk-frontend/package.json')),
  'dist'
)

export const nunjucksTestEnv = nunjucks.configure(
  [
    govukFrontendDist,
    path.normalize(path.resolve(dirname, '../../dist/components'))
  ],
  {
    trimBlocks: true,
    lstripBlocks: true
  }
)

nunjucksTestEnv.addGlobal('govukRebrand', true)
nunjucksTestEnv.addGlobal('t', (locale, key, params = {}) =>
  translate(locale, key, params)
)
nunjucksTestEnv.addGlobal('localeUrl', (url) => url)

export function renderComponent(
  componentName,
  params,
  callBlock,
  options = {}
) {
  const macroPath = `${componentName}/macro.njk`
  const macroName =
    options.macroName ||
    `wrc${
      componentName.charAt(0).toUpperCase() + camelCase(componentName.slice(1))
    }`
  const macroParams = JSON.stringify(params, null, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  if (callBlock) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${callBlock}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return load(nunjucksTestEnv.renderString(macroString, {}))
}
