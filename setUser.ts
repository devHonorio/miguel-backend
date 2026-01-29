import { hash } from 'bcrypt'
import { prisma } from './prisma/prisma-client'
import { UserType } from './src/users/entities/User'
import { SALT_OR_ROUNDS } from './src/users/services'

const main = async () => {
  const user: UserType = {
    rules: [
      'delete:additional',
      'delete:cups',
      'delete:orders',
      'read:cups',
      'read:orders',
      'read:users',
      'write:additional',
      'write:cups',
      'write:users',
    ],
    name: 'Admin',
    password: await hash(`${process.env.ADMIN_PASSWORD}`, SALT_OR_ROUNDS),
    phone: '0000000000000',
    is_admin: true,
  }
  await prisma.user.upsert({
    where: { phone: user.phone },
    create: user,
    update: user,
  })
}

main()
