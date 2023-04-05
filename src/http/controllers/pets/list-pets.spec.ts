import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('List Pets (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list all pets', async () => {
    const { token, orgId } = await createAndAuthenticateOrg(app, true)

    await request(app.server)
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

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        species: 'Cachorro',
        breed: 'Pastor Alemão',
        size: 'Grande',
        color: 'Preto',
        city: 'São Carlos',
        org_id: orgId,
      })

    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'São Carlos', page: 1 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(2)
    expect(response.body.pets[0].name).toEqual('Cleiton')
    expect(response.body.pets[1].name).toEqual('Rex')
  })
})
