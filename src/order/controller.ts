import { RequestHandler } from 'express'
import orderServices from './services'
import Order from './entities/Order'
import Zap from '../entities/Zap'
import { toCentsInBRL } from '../utils/toCentInBRL'

const create: RequestHandler = async (req, res) => {
  const { order_items, user_id, address_id, discount } = Order.createOrder({
    ...req.body,
    user_id: req.user?.id,
  })

  const order = await orderServices.create({
    userId: user_id,
    orderItems: order_items,
    discount,
    addressId: address_id,
  })

  const itemTemplate = order.orderItems.map(
    (item) =>
      `- *${item.size}ml* ${item.additional.join(', ')} ${toCentsInBRL(item.price)}`,
  )

  const orderTemplate = `${order.name.toUpperCase()}

${itemTemplate.join('\n')}

${order.address.address ? `${order.address.address.toUpperCase()} \n*${toCentsInBRL(order.address.shippingPrice ?? 4)}*` : 'Retirada no local'}

Total ${toCentsInBRL(order.totalPrice)}
`
  await Zap.sendText(order.phone, orderTemplate)

  if (address_id) {
    await Zap.sendText(order.phone, 'Aguarde a confirmação do valor do frete.')
  }

  res.status(201).json(order)
}

const orderController = { create }

export default orderController
