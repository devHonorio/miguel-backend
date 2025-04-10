import { Request, Response, NextFunction } from 'express'
import { InternalServerError, UnauthorizedError } from '../errors/error-base'
import { verify } from 'jsonwebtoken'

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization

  if (!authToken)
    throw new UnauthorizedError({
      message: 'Usuário não autorizado.',
      action: 'Verifique se o token foi setado.',
    })

  const [type, token] = authToken.split(' ')

  if (type !== 'Bearer')
    throw new UnauthorizedError({
      message: 'Usuário não autorizado.',
      action: 'Verifique o se o tipo do token é "Bearer"',
    })

  try {
    const payload = verify(token, process.env.SECRET!)

    if (typeof payload === 'string')
      throw new InternalServerError('Payload não pode ser uma string.')

    const { name, phone, sub: id, rulles } = payload

    req.user = { name, phone, id, rulles }

    return next()
  } catch (error) {
    throw new UnauthorizedError({
      message: 'Token inválido.',
      action: 'Verifique o token.',
      cause: error,
    })
  }
}

const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rulles } = user

  if (!rulles.includes('write:users'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rulle "write:users".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const UserAuthMiddlewares = { authMiddleware, authorizationMiddleware }

export default UserAuthMiddlewares
