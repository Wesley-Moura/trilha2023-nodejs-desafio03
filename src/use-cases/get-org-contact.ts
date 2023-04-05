import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { OrgsRepository } from "@/repositories/orgs-repository"

interface GetOrgContactUseCaseRequest {
  orgId: string
}

interface GetOrgContactUseCaseResponse {
  orgName: string
  phone: string 
}

export class GetOrgContactUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    orgId,
  }: GetOrgContactUseCaseRequest): Promise<GetOrgContactUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    return {
      orgName: org.name,
      phone: org.phone,
    }
  }
}
