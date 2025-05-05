import z, { ZodError } from 'zod'
import { BadRequestError, NotFoundError } from '../../errors/error-base'

const schemaOrderItem = z.object({
  cup_id: z.string(),
  additional_ids: z.array(z.string()),
})

const schemaCreate = z.object({
  user_id: z.string(),
  address_id: z.string().optional(),
  order_items: z.array(schemaOrderItem),
  discount: z.coerce
    .number()
    .nonnegative('Desconto deve ser maior que zero.')
    .default(0),
})

const createOrder = (data: unknown) => {
  try {
    return schemaCreate.parse(data)
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

interface Cup {
  id: string
  price: number
  quantity_additional: number
}

interface Additional {
  id: string
  price: number
}
export interface OrderItem {
  cup_id: string
  additional_ids: string[]
}

interface CreateOrderItemsWithPriceProps {
  orderItems: OrderItem[]
  cups: Cup[]
  additional: Additional[]
}

const extractCupPriceAndAdditionalQuantity = (cups: Cup[], cupId: string) => {
  const cup = cups.find(({ id }) => id === cupId)

  if (!cup)
    throw new NotFoundError({
      message: 'Copo não encontrado.',
      action: 'Verifique o "id" do copo.',
    })

  return { cupPrice: cup.price, additionalQuantity: cup.quantity_additional }
}

const extractAdditionalTotalPrice = (
  additional: Additional[],
  additionalIds: string[],
  quantityAdditional: number,
) => {
  const AdditionalWithPrices = additionalIds.map((id) => {
    const currentAdditional = additional.find((add) => add.id === id)

    if (!currentAdditional)
      throw new NotFoundError({
        message: 'Adicional não encontrado.',
        action: 'Verifique o "id" do adicional.',
      })

    return { id, price: currentAdditional.price }
  })

  let countAdditional = 0

  return AdditionalWithPrices.reduce((acc, { price }) => {
    if (price > 0) return acc + price

    if (countAdditional <= quantityAdditional) {
      countAdditional++

      return acc
    }

    return acc + 2
  }, 0)
}

const createOrderItemsWithPrice = ({
  orderItems,
  cups,
  additional,
}: CreateOrderItemsWithPriceProps) => {
  return orderItems.map(({ additional_ids, cup_id }) => {
    const { cupPrice, additionalQuantity } =
      extractCupPriceAndAdditionalQuantity(cups, cup_id)

    const additionalPrice = extractAdditionalTotalPrice(
      additional,
      additional_ids,
      additionalQuantity,
    )

    return {
      price: additionalPrice + cupPrice,
      cup_id,
      additional_ids: additional_ids.map((id) => ({ id })),
    }
  })
}

const Order = { createOrder, createOrderItemsWithPrice }

export default Order
