import { prisma } from '../../prisma/prisma-client'
import { BadRequestError } from '../errors/error-base'
import { CupType } from './entities/Cup'

const create = async ({ size }: CupType) => {
  const cupExists = await prisma.cup.findUnique({ where: { size } })

  if (cupExists)
    throw new BadRequestError({
      message: 'Copo já está cadastrado.',
      action: 'Verifique se a propiedade "size"',
    })

  const cup = await prisma.cup.create({
    data: { size },
    select: { id: true, size: true },
  })

  return cup
}

const findAll = async () => {
  return await prisma.cup.findMany({
    orderBy: { size: 'asc' },
    select: { size: true },
  })
}

const remove = async (size: number) => {
  const cupExists = await prisma.cup.findUnique({ where: { size } })

  if (!cupExists)
    throw new BadRequestError({
      action: 'Verifique a propiedade "size"',
      message: 'Copo não existe.',
    })

  await prisma.cup.delete({
    where: { size },
  })
}

const cupServices = { create, findAll, delete: remove }
export default cupServices
