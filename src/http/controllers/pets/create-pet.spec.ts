import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Create Pet (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token, orgId } = await createAndAuthenticateOrg(app, true)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cleiton',
        species: 'Cachorro',
        breed: 'Labrador',
        size: 'Grande',
        color: 'Branco',
        city: 'São Carlos',
        org_id: orgId,
      })

    expect(response.statusCode).toEqual(201)
  })
})
