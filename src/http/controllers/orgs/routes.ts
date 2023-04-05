// import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { registerOrg } from './register-org'
import { authenticate } from './authenticate'
import { refresh } from './refresh'
import { getOrgContact } from './get-org-contact'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', registerOrg)
  app.post('/sessions', authenticate)

  app.get('/orgs/:id', getOrgContact)

  app.patch('/token/refresh', refresh)
}
