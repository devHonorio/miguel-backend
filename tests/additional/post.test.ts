import { Prisma } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string
let token: string

beforeAll(async () => {
  await orchestrator.cleanDb()

  await orchestrator.setUser()
  const { access_token } = await apiClient.auth()
  token = access_token

  await orchestrator.setUserAdmin()
  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin
})

describe('POST /additional', () => {
  describe('Anonymous user', () => {
    test('creating additional', async () => {
      const response = await apiClient.post('/additional', {})

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('creating additional type token invalid', async () => {
      const response = await apiClient.post(
        '/additional',
        {},
        {
          token: tokenAdmin,
        },
      )

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
    test('creating new additional without write:additional rule', async () => {
      const response = await apiClient.post(
        '/additional',
        {},
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(401)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se usuário tem rule "write:additional".',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })
  describe('Admin user', () => {
    const additional: Prisma.AdditionalCreateInput = {
      name: 'morango',
      price: 2,
      in_stock: true,
    }
    test('creating additional', async () => {
      const response = await apiClient.post('/additional', additional, {
        type: 'Bearer',
        token: tokenAdmin,
      })

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({ ...additional, id: body.id })
    })

    test('creating additional name invalid', async () => {
      const additionalNameInvalid = {
        name: 'j',
      }

      const response = await apiClient.post(
        '/additional',
        additionalNameInvalid,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "name" está correta.',
        message: 'Nome deve conter pelo menos 3 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating additional with type price string', async () => {
      const additionalSizeInvalid = {
        name: 'morango',
        price: 'jj',
      }

      const response = await apiClient.post(
        '/additional',
        additionalSizeInvalid,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "price" está correta.',
        message: 'Preço deve ser um numero.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating additional with price negative', async () => {
      const additionalPriceNegative = {
        name: 'morango',
        price: -1,
      }

      const response = await apiClient.post(
        '/additional',
        additionalPriceNegative,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "price" está correta.',
        message: 'Preço deve ser um numero positivo.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating additional with name length +25', async () => {
      const additional = {
        name: 'Imagine um copo de açaí, uma sinfonia de sabores e texturas que se unem em uma experiência verdadeiramente brasileira. A base, um creme denso e roxo-escuro, feito da polpa da fruta amazônica, exala um aroma terroso e levemente adocicado. A textura é um convite à gula: cremosa, porém com pequenos pedaços da fruta que se dissolvem na boca, liberando um sabor único e inconfundível. O doce do açaí, sutil e equilibrado, contrasta com a acidez suave da fruta, criando uma harmonia perfeita.',
        price: 15,
      }
      const response = await apiClient.post('/additional', additional, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propriedade "name" está correta.',
        message: 'Digite até 25 caracteres.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })
  })
})
