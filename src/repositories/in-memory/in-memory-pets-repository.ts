import { Prisma, Pet } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { PetsRepository } from '../pets-repository'
import { ListPetsUseCaseRequest } from '@/use-cases/list-pets'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      species: data.species,
      breed: data.breed,
      size: data.size,
      color: data.color,
      city: data.city,
      org_id: data.org_id,
      created_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }

  async listMany({
    city,
    page,
    name,
    species,
    breed,
    size,
    color
  }: ListPetsUseCaseRequest) {
    const allFilters = [name, species, breed, size, color]
    
    const filters = allFilters.filter((item) => {
      return item;
    });

    let filter = this.items
      .filter((item) => item.city.includes(city))
      .slice((page - 1) * 20, page * 20)

    if (filters) {
      const optionnalFilter = filter.filter((item) => {
        let value = 0;
        filters.forEach((filter) => {
          Object.values(item).forEach((key) => {
            if (filter === key) {
              value += 1;
            }
          });
        });

        if (filters.length === value) {
          return item;
        }
  
        return null;
      });

      filter = optionnalFilter;
    }

    return filter
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }
}
