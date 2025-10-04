import { Prisma } from '@prisma/client'
import { prisma } from '../../prisma/prisma-client'
import { BadRequestError, NotFoundError } from '../errors/error-base'

type CreateAddress = Pick<
  Prisma.AddressCreateInput,
  | 'street'
  | 'number'
  | 'district'
  | 'complement'
  | 'city'
  | 'address_complete'
  | 'shipping_price'
>

type UpdateAddress = CreateAddress & { id: string }

const create = async (data: CreateAddress) => {
  const { address_complete, ...rest } = await prisma.address.create({
    data,
    select: { id: true, address_complete: true, shipping_price: true },
  })

  return { address: address_complete, ...rest }
}

const listAddress = async (take: number, page: number, query: string) => {
  const addresses = await prisma.address.findMany({
    where: {
      address_complete: {
        contains: query.trim().toLocaleLowerCase(),
        mode: 'insensitive',
      },
    },
    take,
    skip: page * take,
    orderBy: { address_complete: 'asc' },
    select: {
      id: true,
      address_complete: true,
      shipping_price: true,
    },
  })

  return addresses.map(({ address_complete, ...rest }) => ({
    address: address_complete,
    ...rest,
  }))
}

const remove = async (id: string) => {
  const countUsers = await prisma.user.count({
    where: { addresses: { some: { id } } },
  })

  const countOrders = await prisma.order.count({
    where: { address: { id } },
  })

  if (countUsers + countOrders > 0)
    throw new BadRequestError({
      message: 'Esse endereço está ligado a um pedido ou a um cliente.',
    })

  const existsAddress = await prisma.address.findUnique({ where: { id } })

  if (!existsAddress)
    throw new NotFoundError({
      action: 'Verifique o id do endereço.',
      message: 'Endereço não encontrado para ser excluído.',
    })

  return await prisma.address.delete({
    where: { id },
    select: {
      id: true,
      address_complete: true,
    },
  })
}

const findUnique = async (id: string) => {
  const address = await prisma.address.findUnique({
    where: { id },
    omit: { address_complete: true },
  })

  if (!address) throw new NotFoundError({ message: 'Endereço não encontrado!' })

  return address
}

const update = async ({ id, ...data }: UpdateAddress) => {
  const { address_complete, ...rest } = await prisma.address.update({
    where: { id },
    data,
    select: { id: true, address_complete: true, shipping_price: true },
  })

  return { address: address_complete, ...rest }
}

const addressesServices = {
  create,
  listAddress,
  delete: remove,
  findUnique,
  update,
}

export default addressesServices
