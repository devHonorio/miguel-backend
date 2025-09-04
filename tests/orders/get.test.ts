import { $Enums } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const api = CreateApiClient()

let token: string
let adminToken: string

interface OrdersReturn {
  id: string
  address_id: string | null
  total_price: number
  status: $Enums.OrderStatus
  created_at: Date
  updated_at: Date
  user: {
    name: string
  }
}
let orders: OrdersReturn[]

beforeAll(async () => {
  await orchestrator.cleanDb()

  await orchestrator.setUser()
  await orchestrator.setUserAdmin()

  const { access_token } = await api.auth()
  token = access_token

  const { access_token: access_token_admin } = await api.authAdmin()
  adminToken = access_token_admin

  orders = await orchestrator.setOrders()
})

describe('GET /orders', () => {
  describe('Anonymous user', () => {
    test('retrieve orders', async () => {
      const response = await api.get('/orders')

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
    test('retrieve orders', async () => {
      const response = await api.get('/orders', {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se usuário tem rule "read:orders".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('Admin user', () => {
    test('retrieve orders', async () => {
      const response = await api.get('/orders', {
        type: 'Bearer',
        token: adminToken,
      })

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual(
        orders
          .map(
            ({
              address_id,
              id,
              total_price,
              user: { name },
              status,
              updated_at,
              created_at,
            }) => ({
              id,
              user: name,
              address_id,
              total_price,
              status,
              updated_at: updated_at.toISOString(),
              created_at: created_at.toISOString(),
            }),
          )
          .sort((a) => {
            if (a.status === 'confirmar_pedido') return -1

            return 0
          }),
      )
    })

    test('retrieve orders', async () => {
      const response = await api.get('/orders?page=', {
        type: 'Bearer',
        token: adminToken,
      })

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual(
        orders
          .map(
            ({
              address_id,
              id,
              total_price,
              user: { name },
              status,
              updated_at,
              created_at,
            }) => ({
              id,
              user: name,
              address_id,
              total_price,
              status,
              updated_at: updated_at.toISOString(),
              created_at: created_at.toISOString(),
            }),
          )
          .sort((a) => {
            if (a.status === 'confirmar_pedido') return -1

            return 0
          }),
      )
    })
  })
})
