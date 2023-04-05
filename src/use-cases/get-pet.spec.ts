import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { GetPetUseCase } from './get-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let PetsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: GetPetUseCase

describe('Get Pet Use Case', () => {
  beforeEach(async () => {
    PetsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetPetUseCase(PetsRepository)
  })

  it('should be able to Get a pet by id', async () => {
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

    const petCreated = await PetsRepository.create({
      name: 'Cleiton',
      species: 'Cachorro',
      breed: 'Labrador',
      size: 'Grande',
      color: 'Branco',
      city: 'São Carlos',
      org_id: org.id,
    })

    const { pet } = await sut.execute({
      petId: petCreated.id
    })

    expect(pet).toEqual(
      expect.objectContaining({ name: 'Cleiton' }),
    )
  })

  it('should not be able to Get a pet if id does not exist', async () => {
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

    await PetsRepository.create({
      name: 'Cleiton',
      species: 'Cachorro',
      breed: 'Labrador',
      size: 'Grande',
      color: 'Branco',
      city: 'São Carlos',
      org_id: org.id,
    })

    await expect(() => 
      sut.execute({
        petId: 'a78dc0b5-67c3-4607-a0a3-e7216720348f'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
