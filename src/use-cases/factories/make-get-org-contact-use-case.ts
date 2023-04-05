import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository";
import { GetOrgContactUseCase } from "../get-org-contact";

export function makeGetOrgContactUseCase() {
  const prismaOrgsRepository = new PrismaOrgsRepository()
  const getOrgContactUseCase = new GetOrgContactUseCase(prismaOrgsRepository)

  return getOrgContactUseCase
}