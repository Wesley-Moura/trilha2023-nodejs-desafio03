import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const getPetParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getPetParamsSchema.parse(request.params)

  const getPetUseCase = makeGetPetUseCase()

  const { pet } = await getPetUseCase.execute({
    petId: id
  })

  return reply.status(200).send({
    pet,
  })
}
