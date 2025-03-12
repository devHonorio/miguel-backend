import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../errors/error-base'

const write = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rulles } = user

  if (!rulles.includes('write:cups'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rulle "write:cups".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rulles } = user

  if (!rulles.includes('delete:cups'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rulle "delete:cups".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const read = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rulles } = user

  if (!rulles.includes('read:cups'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rulle "read:cups".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const cupsMiddlewares = { write, delete: remove, read }

export default cupsMiddlewares
