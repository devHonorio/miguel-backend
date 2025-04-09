import { Additional } from '@prisma/client'
import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const apiClient = CreateApiClient()

let token: string
let tokenAdmin: string

let additional: Additional[]

beforeAll(async () => {
  await orchestrator.cleanUsers()

  await orchestrator.setUser()
  const { access_token } = await apiClient.auth()
  token = access_token

  await orchestrator.setUserAdmin()
  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin

  await orchestrator.cleanAdditional()
  additional = await orchestrator.setAdditional()
})

describe('PATCH /additional/:id', () => {
  describe('Anonymous user', () => {
    test('updating additional', async () => {
      const response = await apiClient.patch('/additional/id', {})

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('updating additional type token invalid', async () => {
      const response = await apiClient.patch(
        '/additional/id',
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
    test('updating additional without write:additional rule', async () => {
      const response = await apiClient.patch(
        '/additional/id',
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
    const data = {
      name: 'ninho',
      price: 5,
      in_stock: true,
    }
    test('updating additional', async () => {
      const response = await apiClient.patch(
        `/additional/${additional[0].id}`,
        data,
        {
          type: 'Bearer',
          token: tokenAdmin,
        },
      )

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({ ...data, id: body.id })
    })

    test('updating additional with type price string', async () => {
      const cupSizeInvalid = {
        price: 'string',
        name: 'nome',
      }

      const response = await apiClient.patch(
        `/additional/${additional[0].id}`,
        cupSizeInvalid,
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

    test('updating additional with type in_stock not boolean', async () => {
      const cupSizeInvalid = {
        size: 100,
        price: 10.5,
        in_stock: '---',
        name: 'name',
      }

      const response = await apiClient.patch(
        `/additional/${additional[0].id}`,
        cupSizeInvalid,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propriedade "in_stock" está correta.',
        message: 'Em estoque deve ser verdadeiro ou falso.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('updating additional with name length +25', async () => {
      const data = {
        price: 10,
        in_stock: true,
        name: 'Imagine um copo de açaí, uma sinfonia de sabores e texturas que se unem em uma experiência verdadeiramente brasileira. A base, um creme denso e roxo-escuro, feito da polpa da fruta amazônica, exala um aroma terroso e levemente adocicado. A textura é um convite à gula: cremosa, porém com pequenos pedaços da fruta que se dissolvem na boca, liberando um sabor único e inconfundível. O doce do açaí, sutil e equilibrado, contrasta com a acidez suave da fruta, criando uma harmonia perfeita.',
      }
      const response = await apiClient.patch(
        `/additional/${additional[0].id}`,
        data,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propriedade "name" está correta.',
        message: 'Digite até 25 caracteres.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('updating not exists additional', async () => {
      const data = {
        name: 'name',
        price: 0,
      }
      const response = await apiClient.patch(`/additional/id`, data, {
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
