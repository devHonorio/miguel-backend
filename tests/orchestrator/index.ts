import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { SALT_OR_ROUNDS } from '../../src/users/services'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

async function setUserAdmin() {
  await prisma.user.create({
    data: {
      name: 'josé honorio',
      password: await hash('0000', SALT_OR_ROUNDS),
      phone: '00000000000',
      rulles: ['read:users'],
    },
  })
}
const orchestrator = { cleanUsers, setUserAdmin }

export default orchestrator
