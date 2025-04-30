import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const api = CreateApiClient()

let token: string
let address: { id: string; address_complete: string; shipping_price: number }

beforeAll(async () => {
  await orchestrator.cleanUsers()
  await orchestrator.cleanAddresses()

  const { id } = await orchestrator.setUser()

  address = await orchestrator.setAddressesWithUser(id)

  const { access_token } = await api.auth()
  token = access_token
})

describe('GET /address/:id', () => {
  describe('Anonymous user', () => {
    test('getting address', async () => {
      const response = await api.get('/address/id')

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
    test('getting address for id', async () => {
      const response = await api.get(`/address/${address.id}`, {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual({ ...address })
    })
  })
})
