import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as sass from 'sass-embedded'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'))
}

function resolveKitCliPath() {
  const kitDir = path.join(rootDir, 'node_modules/govuk-prototype-kit')
  const kitPkg = JSON.parse(
    fs.readFileSync(path.join(kitDir, 'package.json'), 'utf8')
  )
  const binEntry =
    typeof kitPkg.bin === 'string'
      ? kitPkg.bin
      : kitPkg.bin['govuk-prototype-kit']

  return path.join(kitDir, binEntry)
}

function assertValidPrototypeCss(css) {
  expect(css).toContain('.defra-internal-header')
  expect(css).toContain('.v3-compact-table tbody th')
  expect(css).not.toContain('.govuk-table tbody th')
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

  test('passes govuk-prototype-kit validate-plugin', () => {
    const output = execFileSync(
      process.execPath,
      [resolveKitCliPath(), 'validate-plugin'],
      { cwd: rootDir, encoding: 'utf8' }
    )

    expect(output).toContain('The plugin config is valid.')
  })

  test('every configured sass entry compiles in a Prototype Kit build', () => {
    const kitFrontendInit = path.join(
      rootDir,
      'node_modules/govuk-frontend/dist/govuk-prototype-kit/init.scss'
    )

    for (const sassEntry of config.sass) {
      const importPath = sassEntry.slice(1).replace(/\.scss$/, '')
      const v13Result = sass.compileString(
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

      assertValidPrototypeCss(v13Result.css)

      // Match how Prototype Kit v14 generates .tmp/sass/_plugins.scss via
      // sassPlugins() and compiles with loadPaths and NodePackageImporter.
      const absoluteEntry = path.join(rootDir, sassEntry.slice(1))
      const v14Result = sass.compileString(
        `
        $govuk-extensions-url-context: "/plugin-assets";
        $govuk-plugins-url-context: "/plugin-assets";
        $govuk-prototype-kit-major-version: 13;
        @import "${kitFrontendInit.split(path.sep).join('/')}";
        @import "${absoluteEntry.split(path.sep).join('/')}";
      `,
        {
          url: pathToFileURL(path.join(rootDir, '.tmp/sass/_plugins.scss')),
          loadPaths: [rootDir],
          quietDeps: true,
          silenceDeprecations: ['import'],
          importers: [new sass.NodePackageImporter(rootDir)]
        }
      )

      assertValidPrototypeCss(v14Result.css)
    }
  })
})
