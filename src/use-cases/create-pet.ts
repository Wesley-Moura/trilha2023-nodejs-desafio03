import { PetsRepository } from "@/repositories/pets-repository"
import { Pet } from "@prisma/client"


interface CreatePetUseCaseRequest {
  name: string
  species: string
  breed: string
  size: string
  color: string
  city: string
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    species,
    breed,
    size,
    color,
    city,
    org_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      species,
      breed,
      size,
      color,
      city,
      org_id,
    })

    return { pet }
  }
}
