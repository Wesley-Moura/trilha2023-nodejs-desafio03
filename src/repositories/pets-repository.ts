import { Prisma, Pet } from '@prisma/client'
import { ListPetsUseCaseRequest } from '@/use-cases/list-pets'

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  listMany(data: ListPetsUseCaseRequest): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
}
