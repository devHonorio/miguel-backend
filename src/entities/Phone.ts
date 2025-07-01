import z, { ZodError } from 'zod'
import { removeString } from '../utils/remove-string'
import { BadRequestError } from '../errors/error-base'

export const phoneSchema = z
  .string({
    required_error: 'Telefone é obrigatório.',
  })
  .transform((phone) => removeString(phone))
  .refine((phone) => phone.length === PHONE_LENGTH, {
    message: 'Telefone deve conter 11 dígitos contendo DDD e o digito 9.',
  })
  .transform((phone) => '55' + phone)

const PHONE_LENGTH = 11

const validate = (phone: string) => {
  try {
    return phoneSchema.parse(phone)
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}"`,
      cause: error,
    })
  }
}

const Phone = { PHONE_LENGTH, validate }

export default Phone
