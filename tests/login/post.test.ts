import { decode } from 'jsonwebtoken'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

beforeAll(async () => {
  await orchestrator.cleanUsers()
  await orchestrator.setUserAdmin()
  await orchestrator.setUser()
})

const apiClient = CreateApiClient()

describe('POST /login', () => {
  describe('Anonymous user', () => {
    test('logging in as administrator user', async () => {
      const response = await apiClient.post('/login', {
        phone: '00000000000',
        password: '0000',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { access_token: string }

      expect(body).toHaveProperty('access_token')

      const payload = decode(body.access_token) as { is_admin: boolean }

      expect(payload).not.toBeNull()

      expect(payload.is_admin).toBe(true)
    })

    test('logging user', async () => {
      const response = await apiClient.post('/login', {
        phone: '11111111111',
        password: '1111',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { access_token: string }

      expect(body).toHaveProperty('access_token')

      const payload = decode(body.access_token) as { is_admin: boolean }

      expect(payload).not.toBeNull()

      expect(payload.is_admin).toBe(false)
    })

    test('logging in with user not found', async () => {
      const response = await apiClient.post('/login', {
        phone: '0',
        password: '0',
      })

      expect(response.status).toBe(404)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o telefone está correto.',
        message: 'Usuário não encontrado.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })

    test('logging in with invalid password', async () => {
      const response = await apiClient.post('/login', {
        phone: '00000000000',
        password: '0',
      })

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a senha está correta.',
        message: 'Senha incorreta.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('logging not send password', async () => {
      const response = await apiClient.post('/login', { phone: '0' })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se "password" foi enviado.',
        message: 'Senha é obrigatória.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('logging not send phone', async () => {
      const response = await apiClient.post('/login', { password: '0' })

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se "phone" foi enviado.',
        message: 'Telefone é obrigatório.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
})
