import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'

export const additionalSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve conter pelo menos 3 letras.')
    .max(25, 'Digite até 25 caracteres.'),
  price: z
    .number({
      errorMap: () => ({ message: 'Adicional deve ser um numero.' }),
    })
    .min(0, 'Preço deve ser um numero positivo.'),
})

export type AdditionalType = z.infer<typeof additionalSchema>

const create = (data: AdditionalType) => {
  try {
    const additionalParse = additionalSchema.parse(data)

    return additionalParse
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const Additional = { create }

export default Additional
