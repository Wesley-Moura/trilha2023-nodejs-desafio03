import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { createPet } from './create-pet'
import { listPets } from './list-pets'
import { getPet } from './get-pet'

export async function petsRoutes(app: FastifyInstance) {
  // app.addHook('onRequest', verifyJWT)

  app.post('/pets', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, createPet)
  app.get('/pets', listPets)
  app.get('/pets/:id', getPet)
}
