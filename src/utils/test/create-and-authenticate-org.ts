import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg(
  app: FastifyInstance,
  isAdmin = false,
) {
  const org = await prisma.org.create({
    data: {
      name: 'Empresa Teste',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'teste@teste.com',
    password: '123456',
  })

  const { token } = authResponse.body
  const { id } = org

  return { token, orgId: id }
}
