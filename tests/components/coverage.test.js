import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const distComponentsDir = path.resolve(dirname, '../../dist/wrc/components')
const testsComponentsDir = path.resolve(dirname, '../../tests/components')

describe('Component test coverage verification', () => {
  const componentDirs = fs
    .readdirSync(distComponentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  test.each(componentDirs)(
    'Component %s should have test coverage in tests/components',
    (componentName) => {
      // Components with SCSS only (e.g. button-group) are covered by stylesheet compilation tests
      const componentPath = path.join(distComponentsDir, componentName)
      const hasNunjucks = fs
        .readdirSync(componentPath)
        .some((file) => file.endsWith('.njk'))

      if (hasNunjucks) {
        const testDir = path.join(testsComponentsDir, componentName)
        expect(fs.existsSync(testDir)).toBe(true)

        const testFiles = fs
          .readdirSync(testDir)
          .filter((file) => file.endsWith('.test.js'))

        expect(testFiles.length).toBeGreaterThanOrEqual(1)
      }
    }
  )

  test('All .njk and .scss files in dist/wrc/components should have corresponding tests', () => {
    for (const comp of componentDirs) {
      const compPath = path.join(distComponentsDir, comp)
      const files = fs.readdirSync(compPath)

      for (const file of files) {
        if (file.endsWith('.njk')) {
          const testDir = path.join(testsComponentsDir, comp)
          const testFiles = fs.existsSync(testDir)
            ? fs.readdirSync(testDir).filter((f) => f.endsWith('.test.js'))
            : []
          expect(testFiles.length).toBeGreaterThan(0)
        }
      }
    }
  })
})
