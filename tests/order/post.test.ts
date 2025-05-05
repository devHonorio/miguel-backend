import { Additional, Address, Cup } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const api = CreateApiClient()

let token: string
let userId: string
let cups: Cup[]
let additional: Additional[]
let addresses: Address[]

beforeAll(async () => {
  await orchestrator.cleanOrders()
  await orchestrator.cleanCups()
  await orchestrator.cleanUsers()
  await orchestrator.cleanAdditional()

  additional = await orchestrator.setAdditional()

  cups = await orchestrator.setCups()

  const { id } = await orchestrator.setUser()
  userId = id

  const { access_token } = await api.auth()
  token = access_token

  addresses = await orchestrator.setAddresses()
})

interface Order {
  user_id: string
  order_items: OrderItem[]
  address_id?: string
  discount?: number
}

interface OrderItem {
  additional_ids: string[]
  cup_id: string
}

describe('POST /order', () => {
  describe('Anonymous user', () => {
    test('creating order', async () => {
      const response = await api.post('/order', {})

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('User', () => {
    test('creating order with order items with 3 additional', async () => {
      const order: Order = {
        user_id: userId,
        order_items: cups.map(({ id }) => ({
          additional_ids: additional.slice(0, 4).map(({ id }) => id),
          cup_id: id,
        })),
      }

      const response = await api.post('/order', order, {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(201)

      const body = (await response.json()) as { id: string }

      const orderItems = order.order_items.map(({ additional_ids, cup_id }) => {
        const additionalPrice = additional_ids.reduce((acc, additionalId) => {
          const priceAdditional =
            additional.find(({ id }) => id === additionalId)?.price ?? 0

          return acc + priceAdditional
        }, 0)

        const cupPrice = cups.find(({ id }) => id === cup_id)?.price ?? 0

        return {
          price: additionalPrice + cupPrice,
        }
      })

      expect(body).toEqual({
        id: body.id,
        user_id: userId,
        order_items: orderItems,
        total_price: orderItems.reduce((acc, { price }) => acc + price, 0),
      })
    })

    test('creating order with order items with 7 additional', async () => {
      const order: Order = {
        user_id: userId,
        order_items: [
          {
            additional_ids: additional
              .filter(({ in_stock }) => in_stock)
              .slice(0, 7)
              .map(({ id }) => id),
            cup_id: cups[0].id,
          },
        ],
      }

      const response = await api.post('/order', order, {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(201)

      const body = (await response.json()) as { id: string; user_id: string }

      expect(body).toEqual({
        id: body.id,
        order_items: [
          {
            price: 16,
          },
        ],
        total_price: 16,

        user_id: body.user_id,
      })
    })

    test('creating order with address', async () => {
      const order: Order = {
        user_id: userId,
        order_items: [
          {
            additional_ids: additional
              .filter(({ in_stock }) => in_stock)
              .slice(0, 7)
              .map(({ id }) => id),
            cup_id: cups[0].id,
          },
        ],
        address_id: addresses[0].id,
      }

      const response = await api.post('/order', order, {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(201)

      const body = (await response.json()) as { id: string; user_id: string }

      expect(body).toEqual({
        id: body.id,
        order_items: [
          {
            price: 16,
          },
        ],
        total_price: 20,

        user_id: body.user_id,
      })
    })

    test('creating order with discount', async () => {
      const order: Order = {
        user_id: userId,
        order_items: [
          {
            additional_ids: additional
              .filter(({ in_stock }) => in_stock)
              .slice(0, 7)
              .map(({ id }) => id),
            cup_id: cups[0].id,
          },
        ],
        address_id: addresses[0].id,
        discount: 10,
      }

      const response = await api.post('/order', order, {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(201)

      const body = (await response.json()) as { id: string; user_id: string }

      expect(body).toEqual({
        id: body.id,
        order_items: [
          {
            price: 16,
          },
        ],
        total_price: 10,

        user_id: body.user_id,
      })
    })

    test('creating order with discount negative', async () => {
      const order: Order = {
        user_id: userId,
        order_items: [
          {
            additional_ids: additional
              .filter(({ in_stock }) => in_stock)
              .slice(0, 7)
              .map(({ id }) => id),
            cup_id: cups[0].id,
          },
        ],
        address_id: addresses[0].id,
        discount: -10,
      }

      const response = await api.post('/order', order, {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "discount" está correta.',
        message: 'Desconto deve ser maior que zero.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
})
