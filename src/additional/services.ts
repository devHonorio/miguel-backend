import { prisma } from '../../prisma/prisma-client'
import { AdditionalType } from './entities/Additional'

const create = async (data: AdditionalType) => {
  const additional = await prisma.additional.create({ data })

  return additional
}

const findAll = async () => {
  return await prisma.additional.findMany({
    orderBy: { name: 'asc' },
  })
}

const findInStock = async () => {
  return await prisma.additional.findMany({
    orderBy: { name: 'asc' },
    where: { in_stock: true },
  })
}
const additionalServices = { create, findAll, findInStock }

export default additionalServices
