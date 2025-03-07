import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string
let token: string

beforeAll(async () => {
  await orchestrator.cleanUsers()
  await orchestrator.cleanCups()

  await orchestrator.setUser()
  const { access_token } = await apiClient.auth()
  token = access_token

  await orchestrator.setUserAdmin()
  const { access_token: access_token_adimin } = await apiClient.authAdmin()
  tokenAdmin = access_token_adimin
})

describe('POST /cups', () => {
  describe('Anonymouns user', () => {
    test('creating cup', async () => {
      const cup = {
        size: 300,
      }

      const response = await apiClient.post('/cups', cup)

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('creating cup type token invalid', async () => {
      const cup = {
        size: 300,
      }

      const response = await apiClient.post('/cups', cup, {
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
    const cup = {
      size: 300,
    }
    test('creating new cup without write:cups rule', async () => {
      const response = await apiClient.post('/cups', cup, {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(401)

      const bory = await response.json()
      expect(bory).toEqual({
        action: 'Verifique se usuário tem rulle "write:cups".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })
  describe('Admin user', () => {
    const cup = {
      size: 300,
    }
    test('creating cup', async () => {
      const response = await apiClient.post('/cups', cup, {
        type: 'Bearer',
        token: tokenAdmin,
      })

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({ ...cup, id: body.id })
    })

    test('creating cup with type size string', async () => {
      const cupSizeInvalid = {
        size: 'jj',
      }

      const response = await apiClient.post('/cups', cupSizeInvalid, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "size" está correta.',
        message: 'Tamanho do copo deve ser um numero inteiro.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating cup with number float', async () => {
      const user = { size: 2.5 }
      const response = await apiClient.post('/cups', user, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propiedade "size" está correta.',
        message: 'Tamanho do copo deve ser um numero inteiro.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating exists cup', async () => {
      const cup = { size: 300 }
      const response = await apiClient.post('/cups', cup, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "size"',
        message: 'Copo já está cadastrado.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
})
