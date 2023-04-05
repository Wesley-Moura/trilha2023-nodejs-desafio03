import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    species: z.string(),
    breed: z.string(),
    size: z.string(),
    color: z.string(),
    city: z.string(),
    org_id: z.string().uuid(),
  })

  const { name, species, breed, size, color, city, org_id } = createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    name,
    species,
    breed,
    size,
    color,
    city,
    org_id,
  })

  return reply.status(201).send()
}
