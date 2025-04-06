import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { SALT_OR_ROUNDS } from '../../src/users/services'
import { UserType } from '../../src/users/entities/User'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

async function setUserAdmin() {
  const rules: UserType['rules'] = [
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
      rules,
      is_admin: true,
    },
  })
}

async function setUser() {
  const rules: UserType['rules'] = []
  await prisma.user.create({
    data: {
      name: 'josé honorio',
      password: await hash('1111', SALT_OR_ROUNDS),
      phone: '11111111111',
      rules,
    },
  })
}

async function cleanCups() {
  await prisma.cup.deleteMany()
}

async function setCups() {
  const cups = await prisma.cup.createManyAndReturn({
    data: [
      { size: 300, price: 10, description: 'Tem copo', in_stock: true },
      { size: 400, price: 20, description: 'Tem copo', in_stock: true },
      { size: 500, price: 30, description: 'Tem copo', in_stock: true },
      { size: 600, price: 40, description: 'Tem copo', in_stock: false },
    ],
  })

  return cups
}

const orchestrator = { cleanUsers, setUserAdmin, setUser, cleanCups, setCups }

export default orchestrator
