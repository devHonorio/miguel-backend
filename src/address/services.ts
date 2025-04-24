import { Prisma } from '@prisma/client'
import { prisma } from '../../prisma/prisma-client'

interface CreateAddress
  extends Pick<
    Prisma.AddressCreateInput,
    'street' | 'number' | 'district' | 'complement'
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

const addressServices = { create }

export default addressServices
