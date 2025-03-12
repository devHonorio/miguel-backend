import { prisma } from '../../prisma/prisma-client'
import { BadRequestError, NotFoundError } from '../errors/error-base'
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

const findUnique = async (id: string) => {
  const cup = await prisma.cup.findUnique({ where: { id } })

  if (!cup)
    throw new NotFoundError({
      action: 'Verifique a propiedade "id".',
      message: 'Copo não existe.',
    })

  return cup
}

const cupServices = { create, findAll, delete: remove, findUnique }
export default cupServices
