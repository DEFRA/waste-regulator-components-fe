import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.resolve(dirname, '../../dist/assets/images')

describe('Static assets', () => {
  const expectedImages = [
    'favicon.ico',
    'favicon.svg',
    'apple-touch-icon.png',
    'govuk-crest.svg'
  ]

  test.each(expectedImages)('Image asset %s should exist and not be empty', (fileName) => {
    const filePath = path.join(imagesDir, fileName)
    expect(fs.existsSync(filePath)).toBe(true)

    const stats = fs.statSync(filePath)
    expect(stats.size).toBeGreaterThan(0)
  })

  test('SVG images should contain valid SVG markup', () => {
    for (const svgFile of ['favicon.svg', 'govuk-crest.svg']) {
      const content = fs.readFileSync(path.join(imagesDir, svgFile), 'utf-8')
      expect(content).toContain('<svg')
      expect(content).toContain('</svg>')
    }
  })

  test('apple-touch-icon.png should have valid PNG magic bytes', () => {
    const buffer = fs.readFileSync(path.join(imagesDir, 'apple-touch-icon.png'))
    // PNG magic bytes: 0x89 0x50 0x4E 0x47
    expect(buffer[0]).toBe(0x89)
    expect(buffer[1]).toBe(0x50)
    expect(buffer[2]).toBe(0x4e)
    expect(buffer[3]).toBe(0x47)
  })

  test('favicon.ico should have valid ICO magic bytes', () => {
    const buffer = fs.readFileSync(path.join(imagesDir, 'favicon.ico'))
    // ICO header: 0x00 0x00 0x01 0x00
    expect(buffer[0]).toBe(0x00)
    expect(buffer[1]).toBe(0x00)
    expect(buffer[2]).toBe(0x01)
    expect(buffer[3]).toBe(0x00)
  })
})
