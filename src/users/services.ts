import { prisma } from '../../prisma/prisma-client'
import { hash } from 'bcrypt'
import { UserType } from './entities/User'

export const SALT_OR_ROUNDS = 8
const create = async ({ name, password, phone, id, rules }: UserType) => {
  const passwordHash = await hash(password, SALT_OR_ROUNDS)

  const user = await prisma.user.create({
    data: { name, password: passwordHash, phone, id, rules },
    select: { id: true, name: true, phone: true, rules: true },
  })

  return user
}

const search = async (query: string) => {
  return await prisma.user.findMany({
    take: 10,
    select: { id: true, name: true, phone: true },
    where: {
      OR: [
        { phone: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
  })
}

const userServices = { create, search }
export default userServices
