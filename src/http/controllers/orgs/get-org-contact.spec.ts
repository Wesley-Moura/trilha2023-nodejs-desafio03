import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Get Org Contact (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get contact of a org', async () => {
    const { token, orgId } = await createAndAuthenticateOrg(app)

    const getOrgContactResponse = await request(app.server)
      .get(`/orgs/${orgId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getOrgContactResponse.statusCode).toEqual(200)
    expect(getOrgContactResponse.body.org).toEqual(
      expect.objectContaining({ orgName: 'Empresa Teste', phone: '16987469132' }),
    )
  })
})
