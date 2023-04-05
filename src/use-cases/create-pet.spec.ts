import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })

  it('should be able to create a pet', async () => {
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

    const { pet } = await sut.execute({
      name: 'Cleiton',
      species: 'Cachorro',
      breed: 'Labrador',
      size: 'Grande',
      color: 'Branco',
      city: 'São Carlos',
      org_id: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.org_id).toEqual(org.id)
  })
})
