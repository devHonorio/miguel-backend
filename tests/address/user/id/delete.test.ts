import { CreateApiClient } from '../../../api'
import orchestrator from '../../../orchestrator'

const api = CreateApiClient()

let token: string

let addressId: string

beforeAll(async () => {
  await orchestrator.cleanDb()
  const { id } = await orchestrator.setUser()

  const { access_token } = await api.auth()
  token = access_token

  const address = await orchestrator.setAddressesWithUser(id)
  addressId = address.id
})

describe('DELETE /address/user/:id', () => {
  describe('Anonymous user', () => {
    test('removing address', async () => {
      const response = await api.delete('/address/user/id')

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

  describe('Current user', () => {
    test('deleting address', async () => {
      const response = await api.delete(`/address/user/${addressId}`, {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = await response.json()

      expect(body).toEqual({
        address_complete:
          'rua vanusa - 581, água verde, ampére, perto do colégio cecília.',
        id: addressId,
      })
    })

    test('deleting address not found', async () => {
      const response = await api.delete('/address/user/id', {
        token,
        type: 'Bearer',
      })

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
