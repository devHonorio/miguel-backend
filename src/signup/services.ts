import { prisma } from '../../prisma/prisma-client'
import { BadRequestError } from '../errors/error-base'
import { CreateUser } from './controller'
import { UserType } from '../users/entities/User'
import sendCodeServices from '../send-code/services'

const create = async ({ name, phone }: CreateUser) => {
  const user = await prisma.user.findUnique({ where: { phone } })

  if (user) throw new BadRequestError({ message: 'Usuário já existe.' })

  await prisma.user.create({
    data: {
      name,
      phone: phone,
      password: '',
      is_admin: false,
      rules: ['read:cups'] as UserType['rules'],
    },
  })

  await sendCodeServices.sendCode(phone)
}

const signupServices = { create }

export default signupServices
