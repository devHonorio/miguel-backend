import { compare } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'

import { NotFoundError, UnauthorizedError } from '../errors/error-base'
import { UserType } from '../users/entities/User'
import Auth from './entities/Auth'

async function login(phone: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { phone },
    select: {
      password: true,
      name: true,
      phone: true,
      id: true,
      rules: true,
      is_admin: true,
    },
  })

  if (!user)
    throw new NotFoundError({
      action: 'Verifique se o telefone está correto.',
      message: 'Usuário não encontrado.',
    })

  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch)
    throw new UnauthorizedError({
      action: 'Verifique se a senha está correta.',
      message: 'Senha incorreta.',
    })

  const access_token = Auth.generateToken({
    id: user.id,
    name: user.name,
    phone: user.phone,
    rules: user.rules as UserType['rules'],
    is_admin: user.is_admin,
  })

  return access_token
}

const authServices = { login }

export default authServices
