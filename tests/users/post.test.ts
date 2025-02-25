/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'
beforeAll(async () => {
  await orchestrator.cleanUsers()
})

const apiClient = CreateApiClient('http://localhost:3001')

describe('POST /users', () => {
  describe('Anonymouns user', () => {
    const user = {
      id: '2',
      name: 'vanusa pereira',
      phone: '46999222970',
      password: '1234',
      rulles: ['read:users', 'write:users'],
    }
    test('creating user admin', async () => {
      const response = await apiClient.post('/users', user)

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

      const response = await apiClient.post('/users', userPhoneInvalid)

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "phone"',
        message: 'Telefone deve conter 11 dígitos contendo DDD e o digito 9.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating user none phone', async () => {
      const user = { id: '2', name: 'José Honorio' }
      const response = await apiClient.post('/users', user)

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propiedade "phone"',
        message: 'Telefone é obrigatório.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating user none lastname', async () => {
      const user = { id: '3', name: 'José', phone: '44998692094' }
      const response = await apiClient.post('/users', user)

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "name"',
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
        rulles: [],
      }
      const response = await apiClient.post('/users', user)

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "name"',
        message: 'Nome não deve ter abreviações.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
  // describe('Anonymouns user', () => {
  //   test('creating user', async () => {
  //     const user = {
  //       id: '1',
  //       name: 'vanusa pereira',
  //       phone: '46999222970',
  //     }

  //     await apiClient.post('/users', user)
  //   })
  // })

  // describe('Unauthoriized User', () => {
  //   const user = {
  //     id: '2',
  //     name: 'vanusa pereira',
  //     phone: '46999222970',
  //     password: '1234',
  //     rulles: ['read:users', 'write:users'],
  //   }
  //   test('creating new user without write:users rule', async () => {
  //     await apiClient.post('/users', user)
  //   })
  // })
})
