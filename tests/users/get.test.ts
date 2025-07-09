import { User } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

let users: User[]

let tokenAdmin: string
let token: string

beforeAll(async () => {
  await orchestrator.cleanDb()

  users = await orchestrator.setUsers()
  users.sort((a, b) => a.name.localeCompare(b.name))

  await orchestrator.setUserAdmin()
  await orchestrator.setUser()
  const { access_token } = await apiClient.authAdmin()
  const { access_token: userToken } = await apiClient.auth()

  tokenAdmin = access_token
  token = userToken
})

describe('GET /users/:query', () => {
  describe('Anonymous user', () => {
    test('retrieve all users', async () => {
      const response = await apiClient.get('/users/:query')

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

  describe('Unauthorized User', () => {
    test('retrieve all users without read:users rule', async () => {
      const response = await apiClient.get(
        '/users/:query',

        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(401)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se usuário tem rule "read:users".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('Admin user', () => {
    test('retrieve all users', async () => {
      const userQuery = users
        .filter(({ name }) => {
          return name.includes('a')
        })
        .slice(0, 10)
        .map(({ id, name, phone }) => ({ id, name, phone }))
      const response = await apiClient.get('/users/a', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as []

      expect(body.length).toBe(10)

      expect(body).toEqual(userQuery)
    })
  })
})
