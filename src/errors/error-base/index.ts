interface ErrorBaseProps {
  message?: string
  cause?: ErrorOptions['cause']
  action?: string
}

export default class ErrorBase extends Error {
  action?: string
  statusCode: number
  constructor({ message, cause, action }: ErrorBaseProps) {
    super(message, { cause })
    this.action = action
    this.statusCode = 500
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    }
  }
}

export class BadRequestError extends ErrorBase {
  constructor({ message, action, cause }: ErrorBaseProps) {
    super({ message, action, cause })
    this.name = 'BadRequestError'
    this.statusCode = 400
  }
}

export class InternalServerError extends ErrorBase {
  constructor(cause?: ErrorOptions['cause']) {
    super({ cause })
    this.name = 'InternalServerError'
    this.message = 'Erro interno do servidor.'
    this.action = 'Entre em contato com suporte.'
  }
}

export class NotFoundError extends ErrorBase {
  constructor({ action, cause, message }: ErrorBaseProps) {
    super({ message, action, cause })
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

export class UnauthorizedError extends ErrorBase {
  constructor({ action, cause, message }: ErrorBaseProps) {
    super({ message, action, cause })
    this.name = 'UnauthorizedError'
    this.statusCode = 401
  }
}
