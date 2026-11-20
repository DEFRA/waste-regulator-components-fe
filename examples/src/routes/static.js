import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, '../public')
const rootDir = path.resolve(dirname, '../../..')
const defraAssetsDir = path.join(rootDir, 'dist/wrc/assets')
const govukAssetsDir = path.join(
  rootDir,
  'node_modules/govuk-frontend/dist/govuk/assets'
)

export const staticRoutes = [
  {
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: publicDir,
        redirectToSlash: true,
        index: false
      }
    }
  },
  {
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: [publicDir, defraAssetsDir, govukAssetsDir],
        redirectToSlash: true,
        index: false
      }
    }
  }
]
