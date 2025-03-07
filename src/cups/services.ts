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

const cupServices = { create }
export default cupServices
