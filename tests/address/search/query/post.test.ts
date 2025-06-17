import { Address } from '@prisma/client'
import { CreateApiClient } from '../../../api'
import orchestrator from '../../../orchestrator'

const api = CreateApiClient()

let token: string

let addresses: Address[]

beforeAll(async () => {
  await orchestrator.cleanDb()
  await orchestrator.setUser()

  const { access_token } = await api.auth()
  token = access_token

  addresses = await orchestrator.setAddresses()
})

describe('POST /address/search/:query', () => {
  describe('Anonymous user', () => {
    test('getting address', async () => {
      const response = await api.get('/address/search/query')

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
    test('getting address', async () => {
      const address = addresses[0]
      const response = await api.get(
        `/address/search/${address.street} - ${address.number}, ${address.district}, ${address.city}`,
        { token, type: 'Bearer' },
      )

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual([
        {
          id: address.id,
          address_complete: address.address_complete,
          complement: address.complement,
        },
      ])
    })
  })
})
