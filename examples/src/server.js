import Hapi from '@hapi/hapi'
import Vision from '@hapi/vision'
import Inert from '@hapi/inert'
import { getNunjucksVisionConfig } from './config/nunjucks.js'
import { staticRoutes } from './routes/static.js'
import { cookiesRoutes } from './routes/cookies.js'
import { homeRoutes } from './routes/home.js'

export async function createServer(options = {}) {
  const server = Hapi.server({
    port: options.port ?? 2000,
    host: options.host ?? 'localhost',
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      state: {
        parse: true,
        failAction: 'ignore'
      }
    },
    state: {
      strictHeader: false
    }
  })

  await server.register([Vision, Inert])

  server.views(getNunjucksVisionConfig(options.nunjucksEnvironment))

  server.state('analytics_consent', {
    ttl: 365 * 24 * 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'none',
    clearInvalid: true,
    strictHeader: false,
    ignoreErrors: true
  })

  server.state('hide_cookie_banner', {
    ttl: 365 * 24 * 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'none',
    clearInvalid: true,
    strictHeader: false,
    ignoreErrors: true
  })

  server.route([...staticRoutes, ...cookiesRoutes, ...homeRoutes])

  return server
}

