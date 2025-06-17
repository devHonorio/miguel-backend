import { Address } from '@prisma/client'
import { CreateApiClient } from '../../../api'
import orchestrator from '../../../orchestrator'

const api = CreateApiClient()

let addresses: Address[]
let token: string

beforeAll(async () => {
  await orchestrator.cleanDb()
  await orchestrator.setUser()
  addresses = await orchestrator.setAddresses()
  const { access_token } = await api.auth()
  token = access_token
})

describe('POST /address/user/:id', () => {
  describe('Anonymous user', () => {
    test('setting address', async () => {
      const response = await api.post('/address/user/id', {})

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
    test('setting address', async () => {
      const address = addresses[0]

      const response = await api.post(
        `/address/user/${address.id}`,
        {},
        { type: 'Bearer', token },
      )

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual({
        id: address.id,
        address_complete: address.address_complete,
      })
    })

    test('setting address not found', async () => {
      const response = await api.post(
        '/address/user/id',
        {},
        { type: 'Bearer', token },
      )

      expect(response.status).toBe(404)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique o id do endereço.',
        message: 'Endereço não encontrado para ser excluído.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })
  })
})
