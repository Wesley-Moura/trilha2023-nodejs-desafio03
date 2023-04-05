import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterOrgUseCase } from './register-org'
import { OrgAlreadyExistsError } from './errors/org-already-existis-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register a org', async () => {
    const { org } = await sut.execute({
      name: 'Empresa Teste',
      email: 'teste@teste.com',
      password: '123456',
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132'
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'Empresa Teste',
      email: 'teste@teste.com',
      password: '123456',
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132'
    })


    const isPasswordCorrectlyHashed = await compare(
      '123456',
      org.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'teste@teste.com'

    await sut.execute({
      name: 'Empresa Teste',
      email,
      password: '123456',
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132'
    })

    await expect(() =>
    sut.execute({
      name: 'Empresa Teste',
      email,
      password: '123456',
      state: 'São Paulo',
      city: 'São Carlos',
      neighborhood: 'Cruzeiro do Sul',
      street: 'José Carlos',
      number: '189',
      phone: '16987469132'
    }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
