import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string
let token: string

beforeAll(async () => {
  await orchestrator.cleanUsers()
  await orchestrator.setUserAdmin()
  await orchestrator.setUser()

  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin

  const { access_token } = await apiClient.auth()
  token = access_token

  await orchestrator.cleanCups()
  await orchestrator.setCups()
})

describe('DELETE /cups:id', () => {
  describe('Anonymous user', () => {
    test('deleting cup', async () => {
      const response = await apiClient.delete('/cups/size')

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('deleting cup type token invalid', async () => {
      const response = await apiClient.delete('/cups/size', {
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
    test('creating new cup without delete:cups rule', async () => {
      const response = await apiClient.delete('/cups/size', {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se usuário tem rule "delete:cups".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('Admin user', () => {
    test('deleting cup', async () => {
      const response = await apiClient.delete('/cups/300', {
        type: 'Bearer',
        token: tokenAdmin,
      })

      expect(response.status).toBe(200)
    })

    test('deleting cup with type size string', async () => {
      const response = await apiClient.delete('/cups/jj', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "size" está correta.',
        message: 'Tamanho do copo deve ser um numero inteiro.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('deleting cup with number float', async () => {
      const response = await apiClient.delete('/cups/2.5', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propriedade "size" está correta.',
        message: 'Tamanho do copo deve ser um numero inteiro.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('deleting not exists cup', async () => {
      const response = await apiClient.delete('/cups/1', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "size"',
        message: 'Copo não existe.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
})
