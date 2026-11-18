import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass-embedded'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')
const outputPath = path.resolve(dirname, '../src/public/css/application.css')

const mockVariablesScss = `
@use 'sass:color';
$defra-internal-brand: #00a33b;
$defra-internal-footer-link: #3b3b3b;
$defra-internal-nav-background: color.mix(#ffffff, $defra-internal-brand, 92%);
$defra-internal-link: #00703c;
$defra-internal-link-hover: color.mix(#000000, $defra-internal-link, 40%);
`

export function buildCss() {
  const result = sass.compileString(
    `
    @use 'govuk/index' as govuk;
    @use 'dist/index' as defra;
  `,
    {
      loadPaths: [
        rootDir,
        path.join(rootDir, 'node_modules'),
        path.join(rootDir, 'node_modules/govuk-frontend/dist')
      ],
      importers: [
        new sass.NodePackageImporter(rootDir),
        {
          canonicalize(url) {
            if (url === 'variables' || url === 'govuk-frontend') {
              return new URL(`custom:${url}`)
            }
            return null
          },
          load(canonicalUrl) {
            if (canonicalUrl.href === 'custom:variables') {
              return { contents: mockVariablesScss, syntax: 'scss' }
            }
            if (canonicalUrl.href === 'custom:govuk-frontend') {
              return { contents: '@forward "pkg:govuk-frontend";', syntax: 'scss' }
            }
            return null
          }
        }
      ]
    }
  )

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, result.css)
  return result.css
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildCss()
  console.log(`Application CSS built successfully at: ${outputPath}`)
}

