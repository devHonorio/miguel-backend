import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'

const cupSchema = z.object({
  size: z
    .number({
      invalid_type_error: 'Tamanho do copo deve ser um numero inteiro.',
    })
    .int('Tamanho do copo deve ser um numero inteiro.'),
})

export type CupType = z.infer<typeof cupSchema>

function create(cup: CupType) {
  try {
    const { size } = cupSchema.parse(cup)

    return {
      size,
    }
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propiedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const remove = (cup: CupType) => {
  try {
    const { size } = cupSchema.parse({ size: +cup.size })

    return {
      size,
    }
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propiedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const cupSchemaUpdate = cupSchema.extend({ id: z.string() })

type CupSchemaUpdateType = z.infer<typeof cupSchemaUpdate>

const update = (cup: CupSchemaUpdateType) => {
  try {
    const { size, id } = cupSchemaUpdate.parse(cup)

    return {
      size,
      id,
    }
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propiedade "${err.issues[0].path}" está correta.`,
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
