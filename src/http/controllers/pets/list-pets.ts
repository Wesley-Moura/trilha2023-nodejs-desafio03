import { makeListPetsUseCase } from '@/use-cases/factories/make-list-pets-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function listPets(request: FastifyRequest, reply: FastifyReply) {
  const listPetsQuerySchema = z.object({
    city: z.string(),
    page: z.coerce.number().min(1).default(1),
    name: z.optional(z.string()),
    species: z.optional(z.string()),
    breed: z.optional(z.string()),
    size: z.optional(z.string()),
    color: z.optional(z.string()),
  })

  const { city, page, name, species, breed, size, color } = listPetsQuerySchema.parse(request.query)

  const listPetsUseCase = makeListPetsUseCase()

  const { pets } = await listPetsUseCase.execute({
    city,
    page,
    name,
    species,
    breed,
    size,
    color
  })

  return reply.status(200).send({
    pets,
  })
}
