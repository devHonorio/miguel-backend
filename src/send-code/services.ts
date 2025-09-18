import { hash } from 'bcrypt'
import { prisma } from '../../prisma/prisma-client'
import { InternalServerError, NotFoundError } from '../errors/error-base'
import Zap from '../entities/Zap'

const send = async (phone: string) => {
  const user = await prisma.user.findUnique({ where: { phone } })

  if (!user) throw new NotFoundError({ message: 'Usuário não encontrado.' })

  const code = `${Math.random()}`.replace('.', '').slice(1, 5)
  const codeHash = await hash(code, 8)

  await prisma.oneTimeCodes.upsert({
    where: { phone },
    update: { code: codeHash },
    create: { phone, code: codeHash },
  })

  const response = await Zap.sendText(phone, code)

  if (!response.ok) throw new InternalServerError('Erro ná api do WhatsApp')

  setTimeout(
    async () => {
      const userTemp = await prisma.oneTimeCodes.findUnique({
        where: { phone },
      })

      const userPermanent = await prisma.user.findUnique({
        where: { phone, password: '' },
      })

      if (userTemp) {
        await prisma.oneTimeCodes.delete({ where: { phone } })

        if (userPermanent) {
          await prisma.user.delete({ where: { phone } })
        }
      }
    },
    1000 * 60 * 5,
  )
  return { name: user.name }
}

const sendCodeServices = { sendCode: send }

export default sendCodeServices
