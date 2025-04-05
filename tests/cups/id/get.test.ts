import { Cup } from '@prisma/client'
import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const apiClient = CreateApiClient()

let token: string
let tokenAdmin: string

let cups: Cup[]

beforeAll(async () => {
  await orchestrator.cleanUsers()

  await orchestrator.setUser()
  const { access_token } = await apiClient.auth()
  token = access_token

  await orchestrator.setUserAdmin()
  const { access_token: access_token_adimin } = await apiClient.authAdmin()
  tokenAdmin = access_token_adimin

  await orchestrator.cleanCups()
  cups = await orchestrator.setCups()
})

describe('GET /cups:id', () => {
  describe('Anonymouns user', () => {
    test('getting cup', async () => {
      const response = await apiClient.get('/cups/id')

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
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

  describe('Unauthoriized User', () => {
    test('getting new cup without delete:cups rule', async () => {
      const response = await apiClient.get('/cups/id', {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(401)

      const bory = await response.json()

      expect(bory).toEqual({
        action: 'Verifique se usuário tem rulle "read:cups".',
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

      const bory = (await response.json()) as { id: string }

      expect(bory).toEqual({
        size: 300,
        id: bory.id,
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
        action: 'Verifique a propiedade "id".',
        message: 'Copo não existe.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })
  })
})
