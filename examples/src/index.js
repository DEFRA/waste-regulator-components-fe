import { createServer } from './server.js'

async function start() {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 2000
  const server = await createServer({ port })

  await server.start()
  console.log(
    `Defra Internal Frontend Example App running at: ${server.info.uri}`
  )
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
