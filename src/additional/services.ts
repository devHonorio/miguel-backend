import { prisma } from '../../prisma/prisma-client'
import { NotFoundError } from '../errors/error-base'
import { AdditionalType, UpdateAdditionalType } from './entities/Additional'

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
