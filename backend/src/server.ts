import Fastify from 'fastify'
import cors from '@fastify/cors'
import { movieRoutes } from './routes/movies.js'

const app = Fastify({ logger: true })
const frontendOrigin = process.env.FRONTEND_ORIGIN
const localFrontendOrigin = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\]):\d+$/
await app.register(cors, {
  origin: frontendOrigin ? [frontendOrigin, localFrontendOrigin] : localFrontendOrigin,
  allowedHeaders: ['Content-Type', 'x-user-email'],
})
app.get('/health', async () => ({ status: 'ok' }))
await app.register(movieRoutes, { prefix: '/movies' })

try {
  await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
