import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { SALT_OR_ROUNDS } from '../../src/users/services'
import { UserType } from '../../src/users/entities/User'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

async function setUserAdmin() {
  const rulles: UserType['rulles'] = ['write:users']
  await prisma.user.create({
    data: {
      name: 'josé honorio',
      password: await hash('0000', SALT_OR_ROUNDS),
      phone: '00000000000',
      rulles: rulles,
      is_admin: true,
    },
  })
}

async function setUser() {
  const rulles: UserType['rulles'] = []
  await prisma.user.create({
    data: {
      name: 'josé honorio',
      password: await hash('1111', SALT_OR_ROUNDS),
      phone: '11111111111',
      rulles: rulles,
    },
  })
}
const orchestrator = { cleanUsers, setUserAdmin, setUser }

export default orchestrator
