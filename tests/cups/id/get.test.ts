import { Cup } from '@prisma/client'
import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string

let cups: Cup[]

beforeAll(async () => {
  await orchestrator.cleanUsers()

  await orchestrator.setUser()

  await orchestrator.setUserAdmin()
  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin

  await orchestrator.cleanCups()
  cups = await orchestrator.setCups()
})

describe('GET /cups:id', () => {
  describe('Anonymous user', () => {
    test('getting cup in stock', async () => {
      const response = await apiClient.get(`/cups/${cups[0].id}`)

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        ...cups[0],
        id: body.id,
      })
    })

    test('getting cup not stock', async () => {
      const response = await apiClient.get(`/cups/${cups[3].id}`)

      expect(response.status).toBe(404)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        action: 'Verifique a propriedade "id".',
        message: 'Copo não existe.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })

    test('getting cup type token invalid', async () => {
      const response = await apiClient.get('/cups/id', {
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

  describe('Admin user', () => {
    test('getting cup', async () => {
      const response = await apiClient.get(`/cups/${cups[0].id}`, {
        type: 'Bearer',
        token: tokenAdmin,
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        size: 300,
        id: body.id,
        in_stock: true,
        price: 10,
        description: 'Tem copo',
      })
    })

    test('getting not exists cup', async () => {
      const response = await apiClient.get('/cups/not-exists', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(404)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "id".',
        message: 'Copo não existe.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })
  })
})
