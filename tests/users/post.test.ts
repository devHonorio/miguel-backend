/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string
let token: string

beforeAll(async () => {
  await orchestrator.cleanUsers()
  await orchestrator.setUserAdmin()
  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin

  await orchestrator.setUser()
  const { access_token } = await apiClient.auth()
  token = access_token
})

describe('POST /users', () => {
  describe('Admin user', () => {
    const user = {
      id: '2',
      name: 'vanusa pereira',
      phone: '46999222970',
      password: '1234',
      rules: ['read:users', 'write:users'],
    }
    test('creating user admin', async () => {
      const response = await apiClient.post('/users', user, {
        type: 'Bearer',
        token: tokenAdmin,
      })

      const body = await response.json()

      const { password, ...rest } = user

      expect(body).toEqual(rest)
    })

    test('creating user with length phone invalid', async () => {
      const userPhoneInvalid = {
        id: '2',
        name: 'José Honorio',
        phone: '4498692094',
      }

      const response = await apiClient.post('/users', userPhoneInvalid, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "phone"',
        message: 'Telefone deve conter 11 dígitos contendo DDD e o digito 9.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating user none phone', async () => {
      const user = { id: '2', name: 'José Honorio' }
      const response = await apiClient.post('/users', user, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propriedade "phone"',
        message: 'Telefone é obrigatório.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating user none last name', async () => {
      const user = { id: '3', name: 'José', phone: '44998692094' }
      const response = await apiClient.post('/users', user, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "name"',
        message: 'Digite seu nome completo.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating user with short name', async () => {
      const user = {
        id: '4',
        name: 'José H. de Oliveira',
        phone: '44998692094',
        password: '',
        rules: [],
      }
      const response = await apiClient.post('/users', user, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "name"',
        message: 'Nome não deve ter abreviações.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
  describe('Anonymous user', () => {
    test('creating user', async () => {
      const user = {
        id: '1',
        name: 'vanusa pereira',
        phone: '46999222970',
      }

      const response = await apiClient.post('/users', user)

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('creating user', async () => {
      const user = {
        id: '1',
        name: 'vanusa pereira',
        phone: '46999222970',
      }

      const response = await apiClient.post('/users', user, {
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
    const user = {
      id: '2',
      name: 'vanusa pereira',
      phone: '46999222970',
      password: '1234',
      rules: ['read:users', 'write:users'],
    }
    test('creating new user without write:users rule', async () => {
      const response = await apiClient.post('/users', user, {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(401)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se usuário tem rule "write:users".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })
})
