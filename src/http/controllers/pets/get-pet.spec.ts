import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'

describe('Get Pet (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a specific pet', async () => {
    const { token, orgId } = await createAndAuthenticateOrg(app, true)

    const petCreated = await prisma.pet.create({
      data: {
        name: 'Cleiton',
        species: 'Cachorro',
        breed: 'Labrador',
        size: 'Grande',
        color: 'Branco',
        city: 'São Carlos',
        org_id: orgId,
      }
    })

    await prisma.pet.create({
      data: {
        name: 'Rex',
        species: 'Cachorro',
        breed: 'Pastor Alemão',
        size: 'Grande',
        color: 'Preto',
        city: 'São Carlos',
        org_id: orgId,
      }
    })

    const response = await request(app.server)
      .get(`/pets/${petCreated.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet.name).toEqual('Cleiton')
  })
})
