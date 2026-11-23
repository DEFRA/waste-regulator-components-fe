import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass-embedded'

const dirname = path.dirname(fileURLToPath(import.meta.url))
export const DEFAULT_ROOT_DIR = path.resolve(dirname, '..')

export function createGovukForwardScss({ assetsPath } = {}) {
  const settings = ['$govuk-font-family: (arial, sans-serif)']
  if (assetsPath) {
    settings.push(`$govuk-assets-path: "${assetsPath}"`)
  }
  return `@forward "pkg:govuk-frontend" with (${settings.join(', ')});`
}

export function createSassOptions({
  rootDir = DEFAULT_ROOT_DIR,
  assetsPath,
  extraLoadPaths = []
} = {}) {
  return {
    loadPaths: [
      ...extraLoadPaths,
      rootDir,
      path.join(rootDir, 'node_modules'),
      path.join(rootDir, 'node_modules/govuk-frontend/dist')
    ],
    importers: [
      new sass.NodePackageImporter(rootDir),
      {
        canonicalize(url) {
          if (url === 'govuk-frontend') {
            return new URL(`custom:${url}`)
          }
          return null
        },
        load(canonicalUrl) {
          if (canonicalUrl.href === 'custom:govuk-frontend') {
            return {
              contents: createGovukForwardScss({ assetsPath }),
              syntax: 'scss'
            }
          }
          return null
        }
      }
    ],
    quietDeps: true
  }
}

export function compileDesignSystemScss(source, options = {}) {
  const result = sass.compileString(source, createSassOptions(options))
  return result.css
}
