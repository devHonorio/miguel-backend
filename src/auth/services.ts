import { compare } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'

import { sign } from 'jsonwebtoken'
import { NotFoundError, UnauthorizedError } from '../errors/error-base'
import { UserType } from '../users/entities/User'

async function login(phone: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { phone },
    select: { password: true, name: true, phone: true, id: true, rulles: true },
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

  const access_token = sign(
    {
      name: user.name,
      phone: user.phone,
      rulles: user.rulles as UserType['rulles'],
    },
    process.env.SECRET!,
    { subject: user.id, expiresIn: '500d' },
  )

  return access_token
}

const authServices = { login }

export default authServices
