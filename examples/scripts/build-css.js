import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileDesignSystemScss } from '../../scripts/sass-config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')
const outputPath = path.resolve(dirname, '../src/public/css/application.css')

export function buildCss() {
  const css = compileDesignSystemScss(
    `
    @use 'govuk-frontend' as govuk;
    @use 'dist/wrc/index' as defra;
  `,
    { rootDir }
  )

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, css)
  return css
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildCss()
  console.log(`Application CSS built successfully at: ${outputPath}`)
}
