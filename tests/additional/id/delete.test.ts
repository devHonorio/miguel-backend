import { Additional } from '@prisma/client'
import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string
let token: string

let additional: Additional[]

beforeAll(async () => {
  await orchestrator.cleanDb()
  additional = await orchestrator.setAdditional()

  await orchestrator.setUserAdmin()
  await orchestrator.setUser()

  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin

  const { access_token } = await apiClient.auth()
  token = access_token
})

describe('DELETE /additional:id', () => {
  describe('Anonymous user', () => {
    test('deleting additional', async () => {
      const response = await apiClient.delete('/additional/id')

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('deleting additional type token invalid', async () => {
      const response = await apiClient.delete('/additional/id', {
        token: tokenAdmin,
      })

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique o se o tipo do token é "Bearer"',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('Unauthorized User', () => {
    test('creating new additional without delete:additional rule', async () => {
      const response = await apiClient.delete('/additional/id', {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se usuário tem rule "delete:additional".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('Admin user', () => {
    test('deleting additional', async () => {
      const response = await apiClient.delete(
        `/additional/${additional[0].id}`,
        {
          type: 'Bearer',
          token: tokenAdmin,
        },
      )

      expect(response.status).toBe(200)
    })

    test('deleting not exists additional', async () => {
      const response = await apiClient.delete('/additional/1', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(404)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "id".',
        message: 'Adicional não existe.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })
  })
})
