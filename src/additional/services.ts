import { prisma } from '../../prisma/prisma-client'
import { AdditionalType } from './entities/Additional'

const create = async (data: AdditionalType) => {
  const additional = await prisma.additional.create({ data })

  return additional
}

const additionalServices = { create }

export default additionalServices
