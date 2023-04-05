import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetOrgContactUseCase } from './get-org-contact'

let orgsRepository: InMemoryOrgsRepository
let sut: GetOrgContactUseCase

describe('Get Org Contact Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetOrgContactUseCase(orgsRepository)
  })

  it('should be able to get contact of a org', async () => {
    const org = await orgsRepository.create({
      name: 'Empresa Teste',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132'
    })

    const { orgName, phone } = await sut.execute({
      orgId: org.id
    })

    expect(orgName).toEqual('Empresa Teste')
    expect(phone).toEqual('16987469132')
  })

  it('should not be able to contact of a org if id does not exist', async () => {
    await orgsRepository.create({
      name: 'Empresa Teste',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132'
    })

    await expect(() => 
      sut.execute({
        orgId: 'a78dc0b5-67c3-4607-a0a3-e7216720348f'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
