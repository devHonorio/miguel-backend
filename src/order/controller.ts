import { RequestHandler } from 'express'
import orderServices from './services'
import Order from './entities/Order'

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

  res.status(201).json(order)
}

const orderController = { create }

export default orderController
