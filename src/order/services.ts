import { prisma } from '../../prisma/prisma-client'
import { NotFoundError } from '../errors/error-base'
import Order, { OrderItem } from './entities/Order'

interface CreateProps {
  userId: string
  orderItems: OrderItem[]
  addressId?: string
  discount: number
}

const removeDuplicateStrings = (strings: string[]) =>
  strings.reduce((acc, str) => {
    if (acc.find((item) => item === str)) {
      return acc
    }

    return [...acc, str]
  }, [] as string[])

const findCups = async (ids: string[]) => {
  const idsDuplicateRemoved = removeDuplicateStrings(ids)

  return await prisma.cup.findMany({
    where: { id: { in: idsDuplicateRemoved } },
    select: { id: true, price: true, quantity_additional: true },
  })
}

const findAdditional = async (ids: string[]) => {
  const idsDuplicateRemoved = removeDuplicateStrings(ids)

  return await prisma.additional.findMany({
    where: {
      id: {
        in: idsDuplicateRemoved,
      },
    },
    select: { id: true, price: true },
  })
}

const create = async ({
  userId,
  orderItems,
  addressId,
  discount,
}: CreateProps) => {
  const cupsIds = orderItems.map(({ cup_id }) => cup_id)

  const additionalIds = orderItems.reduce((acc, { additional_ids }) => {
    return [...acc, ...additional_ids]
  }, [] as string[])

  const cups = await findCups(cupsIds)
  const additional = await findAdditional(additionalIds)

  const items = Order.createOrderItemsWithPrice({
    cups,
    additional,
    orderItems: orderItems,
  })

  let shipping_price = 0

  if (addressId) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      select: { shipping_price: true },
    })

    if (!address)
      throw new NotFoundError({
        action: 'Verifique o "id" do endereço.',
        message: 'Endereço não encontrado.',
      })

    shipping_price = address.shipping_price
  }

  const totalPrice =
    items.reduce((acc, { price }) => acc + price, 0) - discount + shipping_price

  return await prisma.order.create({
    data: {
      user_id: userId,
      total_price: totalPrice,
      discount,
      address_id: addressId,

      order_items: {
        create: items.map(({ cup_id, price, additional_ids }) => ({
          cup_id,
          price,
          additional: { connect: additional_ids },
        })),
      },
    },
    select: {
      user_id: true,
      id: true,
      total_price: true,
      order_items: { select: { price: true } },
    },
  })
}

const orderServices = { create }

export default orderServices
