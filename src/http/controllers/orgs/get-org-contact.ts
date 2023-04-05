import { makeGetOrgContactUseCase } from '@/use-cases/factories/make-get-org-contact-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getOrgContact(request: FastifyRequest, reply: FastifyReply) {
  const getOrgContactParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getOrgContactParamsSchema.parse(request.params)

  const getOrgContact = makeGetOrgContactUseCase()

  const { orgName, phone } = await getOrgContact.execute({
    orgId: id,
  })

  return reply.status(200).send({
    org: {
      orgName,
      phone,
    },
  })
}
