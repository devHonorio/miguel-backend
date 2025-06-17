import { prisma } from '../../prisma/prisma-client'
import { NotFoundError } from '../errors/error-base'
import { AdditionalType, UpdateAdditionalType } from './entities/Additional'

const sortAdditional = (additional: AdditionalType[]) => {
  return additional.sort((a, b) => a.name.localeCompare(b.name))
}

const create = async (data: AdditionalType) => {
  const additional = await prisma.additional.create({ data })

  return additional
}

const findAll = async () => {
  const additional = await prisma.additional.findMany({
    orderBy: { name: 'asc' },
  })
  return sortAdditional(additional)
}

const findInStock = async () => {
  const additional = await prisma.additional.findMany({
    orderBy: { name: 'asc' },
    where: { in_stock: true },
  })
  return sortAdditional(additional)
}

const findUnique = async (id: string) => {
  const additional = await prisma.additional.findUnique({ where: { id } })

  if (!additional)
    throw new NotFoundError({
      action: 'Verifique a propriedade "id".',
      message: 'Additional não existe.',
    })

  return additional
}

const findUniqueInStock = async (id: string) => {
  const additional = await prisma.additional.findUnique({
    where: { id, in_stock: true },
  })

  if (!additional)
    throw new NotFoundError({
      action: 'Verifique a propriedade "id".',
      message: 'Additional não existe.',
    })

  return additional
}

const update = async ({ id, ...data }: UpdateAdditionalType) => {
  const additional = await prisma.additional.findUnique({ where: { id } })

  if (!additional)
    throw new NotFoundError({
      action: 'Verifique a propriedade "id".',
      message: 'Adicional não existe.',
    })
  return await prisma.additional.update({ where: { id }, data })
}

const remove = async (id: string) => {
  const additional = await prisma.additional.findUnique({ where: { id } })

  if (!additional)
    throw new NotFoundError({
      action: 'Verifique a propriedade "id".',
      message: 'Adicional não existe.',
    })

  return await prisma.additional.delete({ where: { id } })
}

const additionalServices = {
  create,
  findAll,
  findInStock,
  findUnique,
  findUniqueInStock,
  update,
  delete: remove,
}

export default additionalServices
