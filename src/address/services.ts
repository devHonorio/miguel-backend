import { Prisma } from '@prisma/client'
import { prisma } from '../../prisma/prisma-client'

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
      data: { ...data, users: { connect: { id: user_id } } },
    })

    return { ...address, user_id: user_id }
  }

  return await prisma.address.create({ data })
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
    select: { addresses: { select: { address_complete: true, id: true } } },
  })

  return user?.addresses.map((address) => address)
}
const addressServices = { create, search, listAddressOfUser }

export default addressServices
