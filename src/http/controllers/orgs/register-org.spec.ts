import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register Org (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a org', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'Empresa Teste',
      email: 'teste@teste.com',
      password: '123456',
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132',
    })

    expect(response.statusCode).toEqual(201)
  })
})
