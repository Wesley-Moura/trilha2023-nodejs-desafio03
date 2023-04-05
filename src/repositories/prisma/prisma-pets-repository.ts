import { Pet, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PetsRepository } from "../pets-repository";
import { ListPetsUseCaseRequest } from "@/use-cases/list-pets";


export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }

  async listMany({ city, page, name, species, breed, size, color }: ListPetsUseCaseRequest) {
    const pets = await prisma.pet.findMany({
      where: {
        city: {
          contains: city,
        },
        name: {
          contains: name
        },
        species: {
          contains: species
        },
        breed: {
          contains: breed
        },
        size: {
          contains: size
        },
        color: {
          contains: color
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { created_at: 'asc' }
    })

    return pets
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }


}