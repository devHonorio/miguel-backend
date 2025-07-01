import { compare } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { NotFoundError, UnauthorizedError } from '../errors/error-base'

const verify = async (phone: string, code: string) => {
  const response = await prisma.oneTimeCodes.findUnique({
    where: { phone },
  })

  if (!response?.code)
    throw new NotFoundError({ message: 'Código não encontrado.' })

  const codedMatch = await compare(code, response.code)

  if (!codedMatch) throw new UnauthorizedError({ message: 'Código inválido.' })

  await prisma.oneTimeCodes.delete({ where: { phone } })

  const user = await prisma.user.findUnique({
    where: { phone },
    select: { id: true, name: true, rules: true, phone: true },
  })

  if (!user) throw new NotFoundError({ message: 'Usuário não encontrado.' })

  return user
}

const verifyCodeServices = { verify }

export default verifyCodeServices
