import { CreateApiClient } from '../../../api'
import orchestrator from '../../../orchestrator'

const api = CreateApiClient()

let token: string
let address: { address_complete: string; id: string }
beforeAll(async () => {
  await orchestrator.cleanAddresses()
  await orchestrator.cleanUsers()

  await orchestrator.setAddresses()

  const { id } = await orchestrator.setUser()

  await orchestrator.setUserAdmin()

  const { access_token } = await api.auth()
  token = access_token

  address = await orchestrator.setAddressesWithUser(id)
})

describe('GET /address/user', () => {
  describe('Anonymous user', () => {
    test('getting address for user', async () => {
      const response = await api.get('/address/user')

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

  describe('Unauthorized user', () => {
    test('searching for addresses of another user', async () => {
      const response = await api.get('/address/user', {
        type: 'Bearer',
        token,
      })

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual([address])
    })
  })
})
