import { PetsRepository } from "@/repositories/pets-repository"
import { Pet } from "@prisma/client"
import { CityRequiredError } from "./errors/city-required-error"

export interface ListPetsUseCaseRequest {
  city: string
  page: number
  name?: string
  species?: string
  breed?: string
  size?: string
  color?: string
}

interface ListPetsUseCaseResponse {
  pets: Pet[]
}

export class ListPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    page,
    name,
    species,
    breed,
    size,
    color,
  }: ListPetsUseCaseRequest): Promise<ListPetsUseCaseResponse> {
    if (!city) {
      throw new CityRequiredError()
    }

    const pets = await this.petsRepository.listMany({
      city, 
      page, 
      name,
      species,
      breed,
      size,
      color,
    })

    return { pets }
  }
}
