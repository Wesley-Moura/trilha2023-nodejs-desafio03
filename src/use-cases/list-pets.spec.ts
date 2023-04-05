import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { ListPetsUseCase } from './list-pets'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { CityRequiredError } from './errors/city-required-error'

let PetsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: ListPetsUseCase

describe('List Pets Use Case', () => {
  beforeEach(async () => {
    PetsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new ListPetsUseCase(PetsRepository)
  })

  it('should be able to List all pets by city', async () => {
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

    await PetsRepository.create({
      name: 'Rex',
      species: 'Cachorro',
      breed: 'Pastor Alemão',
      size: 'Grande',
      color: 'Preto',
      city: 'São Carlos',
      org_id: org.id,
    })

    const { pets } = await sut.execute({
      city: 'São Carlos',
      page: 1,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Cleiton' }),
      expect.objectContaining({ name: 'Rex' }),
    ])
  })

  it('should be able to fetch paginated pets search', async () => {
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
    
    for (let i = 1; i <= 22; i++) {
      await PetsRepository.create({
        name: `Cleiton ${i}`,
        species: 'Cachorro',
        breed: 'Labrador',
        size: 'Grande',
        color: 'Branco',
        city: 'São Carlos',
        org_id: org.id,
      })
    }

    const { pets } = await sut.execute({
      city: 'São Carlos',
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Cleiton 21' }),
      expect.objectContaining({ name: 'Cleiton 22' }),
    ])
  })

  it('should be able to List Pets by city and breed', async () => {
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

    await PetsRepository.create({
      name: 'Rex',
      species: 'Cachorro',
      breed: 'Pastor Alemão',
      size: 'Grande',
      color: 'Preto',
      city: 'São Carlos',
      org_id: org.id,
    })

    const { pets } = await sut.execute({
      city: 'São Carlos',
      breed: 'Labrador',
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Cleiton' })])
  })

  it('should not be able to List Pets if city was not sent', async () => {
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
        city: '',
        page: 1,
      })
    ).rejects.toBeInstanceOf(CityRequiredError)
  })
})
