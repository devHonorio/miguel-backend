import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'

const userSchema = z.object({
  street: z
    .string({ errorMap: () => ({ message: 'Rua é obrigatório.' }) })
    .max(200, 'Nome da rua deve ter menos de 200 letras.')
    .min(3, 'Nome da rua deve ter pelo menos 3 letras.')
    .transform((street) => street.toLocaleLowerCase()),
  number: z.coerce
    .number({ errorMap: () => ({ message: 'Numero é obrigatório.' }) })
    .int('Numero deve ser um inteiro.')
    .min(0, 'Numero deve ser um numero positivo.'),
  district: z
    .string({ errorMap: () => ({ message: 'Bairro é obrigatório.' }) })
    .max(200, 'Bairro deve ter menos de 200 letras.')
    .min(3, 'Bairro deve ter pelo menos 3 letras.')
    .transform((street) => street.toLocaleLowerCase()),
  complement: z
    .string()
    .max(200, 'Complemento deve ter menos de 300 letras.')
    .min(3, 'Complemento deve ter pelo menos 3 letras.')
    .optional()
    .transform((street) => {
      if (!street) return
      return street.toLocaleLowerCase()
    }),
  user_id: z.string().optional(),
})

const create = (data: unknown) => {
  try {
    return userSchema.parse(data)
  } catch (error) {
    const err = error as ZodError

    const currentError = err.errors[0]

    throw new BadRequestError({
      action: `Verifique a propriedade "${currentError.path}".`,
      message: currentError.message,
    })
  }
}

const Address = { create }

export default Address
