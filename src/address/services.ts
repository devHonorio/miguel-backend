import { Prisma } from '@prisma/client'
import { prisma } from '../../prisma/prisma-client'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/error-base'

interface CreateAddress
  extends Pick<
    Prisma.AddressCreateInput,
    | 'street'
    | 'number'
    | 'district'
    | 'complement'
    | 'city'
    | 'address_complete'
  > {
  user_id?: string
}

const create = async ({ user_id, ...data }: CreateAddress) => {
  if (user_id) {
    const address = await prisma.address.create({
      data: { ...data, shipping_price: 4, users: { connect: { id: user_id } } },
    })

    return { ...address, user_id: user_id }
  }

  return await prisma.address.create({ data: { ...data, shipping_price: 4 } })
}

const search = async (query: string) => {
  return prisma.address.findMany({
    orderBy: { address_complete: 'asc' },
    take: 10,
    select: { id: true, address_complete: true, complement: true },

    where: { address_complete: { contains: query, mode: 'insensitive' } },
  })
}

const listAddressOfUser = async (user_id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      addresses: {
        select: { address_complete: true, id: true, shipping_price: true },
      },
    },
  })

  return user?.addresses.map((address) => address)
}

const remove = async (id: string, user_id?: string) => {
  if (!user_id)
    throw new BadRequestError({
      action: 'Deslogue e logue a conta novamente.',
      message: 'id do usuário não encontrado.',
    })

  const existsUser = await prisma.user.findUnique({ where: { id: user_id } })

  if (!existsUser) throw new NotFoundError({})

  const existsAddress = await prisma.address.findUnique({ where: { id } })

  if (!existsAddress)
    throw new NotFoundError({
      action: 'Verifique o id do endereço.',
      message: 'Endereço não encontrado para ser excluído.',
    })

  return await prisma.address.update({
    where: { id },
    data: { users: { disconnect: { id: user_id } } },
    select: {
      id: true,
      address_complete: true,
    },
  })
}

const set = async (id: string, user_id?: string) => {
  if (!user_id)
    throw new UnauthorizedError({
      action: 'Deslogue e logue a conta novamente.',
      message: 'id do usuário não encontrado.',
    })

  const existsUser = await prisma.user.findUnique({ where: { id: user_id } })

  if (!existsUser)
    throw new NotFoundError({
      action: 'Verifique o login.',
      message: 'Usuário não encontrado.',
    })

  const existsAddress = await prisma.address.findUnique({ where: { id } })

  if (!existsAddress)
    throw new NotFoundError({
      action: 'Verifique o id do endereço.',
      message: 'Endereço não encontrado para ser excluído.',
    })

  return await prisma.address.update({
    data: { users: { connect: { id: user_id } } },
    where: { id },
    select: { address_complete: true, id: true },
  })
}

const findUnique = async (id: string) => {
  return await prisma.address.findUnique({
    where: { id },
    select: { address_complete: true, id: true, shipping_price: true },
  })
}

const addressServices = {
  create,
  search,
  listAddressOfUser,
  delete: remove,
  set,
  findUnique,
}

export default addressServices
