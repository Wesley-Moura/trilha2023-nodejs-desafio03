import { OrgAlreadyExistsError } from "@/use-cases/errors/org-already-existis-error";
import { makeRegisterOrgUseCase } from "@/use-cases/factories/make-register-org-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function registerOrg(request: FastifyRequest, reply: FastifyReply) {
  const registerOrgBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    state: z.string().min(2),
    city: z.string().min(2),
    neighborhood: z.string().min(2),
    street: z.string().min(1),
    number: z.string().min(1),
    phone: z.string().min(11),
  })

  const { 
    name,
    email,
    password,
    state,
    city,
    neighborhood,
    street,
    number,
    phone,
  } = registerOrgBodySchema.parse(request.body)

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute({
      name,
      email,
      password,
      state,
      city,
      neighborhood,
      street,
      number,
      phone,
    })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
