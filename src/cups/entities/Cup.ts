import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'

const cupSchema = z.object({
  size: z
    .number({
      invalid_type_error: 'Tamanho do copo deve ser um numero inteiro.',
    })
    .int('Tamanho do copo deve ser um numero inteiro.'),
  price: z.number({
    invalid_type_error: 'Tamanho do copo deve ser um numero.',
  }),
  in_stock: z.boolean({
    invalid_type_error: 'Em estoque deve ser verdadeiro ou falso.',
  }),
  description: z.string().max(300, 'Digite até 300 caracteres.'),
})

export type CupType = z.infer<typeof cupSchema>

function create(cup: CupType) {
  try {
    const cupParse = cupSchema.parse(cup)

    return cupParse
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const remove = (size: number) => {
  try {
    const { size: sizeParse } = cupSchema.pick({ size: true }).parse({ size })

    return {
      size: sizeParse,
    }
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const cupSchemaUpdate = cupSchema.extend({ id: z.string() })

export type CupSchemaUpdateType = z.infer<typeof cupSchemaUpdate>

const update = (cup: CupSchemaUpdateType) => {
  try {
    const cupParse = cupSchemaUpdate.parse(cup)

    return cupParse
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const Cup = {
  create,
  delete: remove,
  update,
}

export default Cup
