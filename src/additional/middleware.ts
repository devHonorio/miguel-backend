import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../errors/error-base'

const write = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules: rules } = user

  if (!rules.includes('write:additional'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rule "write:additional".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const additionalMiddleware = { write }

export default additionalMiddleware
