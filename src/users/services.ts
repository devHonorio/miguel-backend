import { prisma } from '../../prisma/prisma-client'
import { hash } from 'bcrypt'
import { UserType } from './entities/User'

export const SALT_OR_ROUNDS = 8
const create = async ({ name, password, phone, id, rulles }: UserType) => {
  const passwordHash = await hash(password, SALT_OR_ROUNDS)

  const user = await prisma.user.create({
    data: { name, password: passwordHash, phone, id, rulles },
    select: { id: true, name: true, phone: true, rulles: true },
  })

  return user
}

const userServices = { create }
export default userServices
