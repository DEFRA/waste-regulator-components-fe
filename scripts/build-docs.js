import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_ROOT_DIR, compileDesignSystemScss } from './sass-config.js'

/**
 * Writes a file atomically via a temporary sibling file so concurrent readers
 * never observe a partially written or truncated file.
 * @param {string} destPath
 * @param {(tempPath: string) => void} writeTemp
 */
function writeFileAtomically(destPath, writeTemp) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  const tempPath = `${destPath}.${process.pid}.${crypto.randomUUID()}.tmp`
  writeTemp(tempPath)
  fs.renameSync(tempPath, destPath)
}

export function buildDocsStyles({
  rootDir = DEFAULT_ROOT_DIR,
  scssPath = path.join(rootDir, 'docs/assets/scss/docs.scss'),
  outputCssPath = path.join(rootDir, 'docs/assets/css/docs.css')
} = {}) {
  const source = fs.readFileSync(scssPath, 'utf8')
  const css = compileDesignSystemScss(source, {
    rootDir,
    assetsPath: '../',
    extraLoadPaths: [path.dirname(scssPath)]
  })

  writeFileAtomically(outputCssPath, (tempPath) => {
    fs.writeFileSync(tempPath, css)
  })
  return css
}

export function copyDocsImages({
  rootDir = DEFAULT_ROOT_DIR,
  srcImagesDir = path.join(rootDir, 'dist/wrc/assets/images'),
  destImagesDir = path.join(rootDir, 'docs/assets/images')
} = {}) {
  fs.mkdirSync(destImagesDir, { recursive: true })

  const entries = fs.readdirSync(srcImagesDir, { withFileTypes: true })
  const copied = entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort()

  for (const fileName of copied) {
    writeFileAtomically(path.join(destImagesDir, fileName), (tempPath) => {
      fs.copyFileSync(path.join(srcImagesDir, fileName), tempPath)
    })
  }

  return copied
}

export function buildDocs(options = {}) {
  const css = buildDocsStyles(options)
  const images = copyDocsImages(options)
  return { css, images }
}

/* v8 ignore start */
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { images } = buildDocs()
  console.log(
    `Docs CSS and ${images.length} images built successfully in docs/assets/`
  )
}
/* v8 ignore stop */
