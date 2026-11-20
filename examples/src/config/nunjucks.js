import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import { translate } from '../../../tests/helpers/translate.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../../..')
const viewsDir = path.resolve(dirname, '../views')

export function createNunjucksEnvironment(customPaths = []) {
  const templatePaths = [
    viewsDir,
    path.join(rootDir, 'dist/components'),
    path.join(rootDir, 'node_modules/govuk-frontend/dist'),
    ...customPaths
  ]

  const env = nunjucks.configure(templatePaths, {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true
  })

  env.addGlobal('govukRebrand', true)
  env.addGlobal('t', (locale, key, params = {}) =>
    translate(locale, key, params)
  )
  env.addGlobal('localeUrl', (url) => url)

  return env
}

export function getNunjucksVisionConfig(env = createNunjucksEnvironment()) {
  return {
    engines: {
      njk: {
        compile(src, options) {
          const template = nunjucks.compile(src, options.environment)
          return (ctx) => template.render(ctx)
        }
      }
    },
    compileOptions: {
      environment: env
    },
    relativeTo: path.resolve(dirname, '..'),
    path: 'views'
  }
}
