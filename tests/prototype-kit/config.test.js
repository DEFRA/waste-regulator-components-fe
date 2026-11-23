import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass-embedded'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'))
}

function listComponentMacroPaths(componentsDir) {
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const macroFile = path.join(componentsDir, entry.name, 'macro.njk')
      return fs.existsSync(macroFile)
        ? `wrc/components/${entry.name}/macro.njk`
        : null
    })
    .filter(Boolean)
    .sort()
}

describe('GOV.UK Prototype Kit plugin configuration', () => {
  const pkg = readJson('package.json')
  const config = readJson('govuk-prototype-kit.config.json')

  test('package publishes govuk-prototype-kit.config.json and dist', () => {
    expect(pkg.files).toContain('dist')
    expect(pkg.files).toContain('govuk-prototype-kit.config.json')
  })

  test('declares govuk-frontend v6+ plugin dependency', () => {
    expect(config.pluginDependencies).toContainEqual({
      packageName: 'govuk-frontend',
      minVersion: '6.0.0'
    })
  })

  test('declares valid root-relative assets, sass, and nunjucksPaths', () => {
    for (const key of ['assets', 'sass', 'nunjucksPaths']) {
      expect(Array.isArray(config[key])).toBe(true)
      expect(config[key].length).toBeGreaterThan(0)

      for (const entryPath of config[key]) {
        expect(entryPath.startsWith('/')).toBe(true)
        const resolved = path.join(rootDir, entryPath.slice(1))
        expect(fs.existsSync(resolved)).toBe(true)
      }
    }
  })

  test('registers every component macro with valid importFrom and macro definition', () => {
    const nunjucksRoot = path.join(rootDir, config.nunjucksPaths[0].slice(1))
    const actualMacros = listComponentMacroPaths(
      path.join(rootDir, 'dist/wrc/components')
    )
    const configuredMacros = config.nunjucksMacros
      .map((entry) => entry.importFrom)
      .sort()

    expect(configuredMacros).toEqual(actualMacros)

    for (const { importFrom, macroName } of config.nunjucksMacros) {
      const macroFile = path.join(nunjucksRoot, importFrom)
      expect(fs.existsSync(macroFile)).toBe(true)
      const content = fs.readFileSync(macroFile, 'utf8')
      expect(content).toContain(`macro ${macroName}(`)
    }
  })

  test('every configured sass entry compiles in a Prototype Kit build', () => {
    for (const sassEntry of config.sass) {
      const importPath = sassEntry.slice(1).replace(/\.scss$/, '')
      const result = sass.compileString(
        `
        $govuk-prototype-kit-major-version: 13;
        $govuk-extensions-url-context: "/plugin-assets";
        @import "node_modules/govuk-frontend/dist/govuk-prototype-kit/init";
        @import "${importPath}";
      `,
        {
          loadPaths: [rootDir],
          quietDeps: true
        }
      )

      expect(result.css).toContain('.defra-internal-header')
      expect(result.css).toContain('.v3-compact-table tbody th')
      expect(result.css).not.toContain('.govuk-table tbody th')
    }
  })
})
