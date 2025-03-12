import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { SALT_OR_ROUNDS } from '../../src/users/services'
import { UserType } from '../../src/users/entities/User'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

async function setUserAdmin() {
  const rulles: UserType['rulles'] = [
    'write:users',
    'write:cups',
    'delete:cups',
    'read:cups',
  ]
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

async function cleanCups() {
  await prisma.cup.deleteMany()
}

async function setCups() {
  const cups = await prisma.cup.createManyAndReturn({
    data: [{ size: 300 }, { size: 400 }, { size: 500 }],
  })

  return cups
}

const orchestrator = { cleanUsers, setUserAdmin, setUser, cleanCups, setCups }

export default orchestrator
