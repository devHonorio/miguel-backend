import { RequestHandler } from 'express'
import orderServices from './services'
import Order from './entities/Order'
import Zap from '../entities/Zap'
import { toBRL } from '../utils/toBRL'

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
      `- *${item.size}ml* ${item.additional.join(', ')} ${toBRL(item.price)}`,
  )

  const orderTemplate = `${order.name.toUpperCase()}

${itemTemplate.join('\n')}

${order.address.address ? `${order.address.address.toUpperCase()} \n*${toBRL(order.address.shippingPrice ?? 4)}*` : 'Retirada no local'}

Total ${toBRL(order.totalPrice)}
`
  await Zap.sendText(order.phone, orderTemplate)
  await Zap.sendText(order.phone, 'Aguarde a confirmação do valor do frete.')

  res.status(201).json(order)
}

const orderController = { create }

export default orderController
