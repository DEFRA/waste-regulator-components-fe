import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_ROOT_DIR, compileDesignSystemScss } from './sass-config.js'

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

  fs.mkdirSync(path.dirname(outputCssPath), { recursive: true })
  fs.writeFileSync(outputCssPath, css)
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
    fs.copyFileSync(
      path.join(srcImagesDir, fileName),
      path.join(destImagesDir, fileName)
    )
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
