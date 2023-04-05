import { OrgsRepository } from "@/repositories/orgs-repository";
import { Org } from "@prisma/client";
import { hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "./errors/org-already-existis-error";

interface RegisterOrgUseCaseRequest {
  name: string
  email: string
  password: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  phone: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({ 
    name,
    email,
    password,
    state,
    city,
    neighborhood,
    street,
    number,
    phone,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      state,
      city,
      neighborhood,
      street,
      number,
      phone,
    })

    return { org }
  }
}