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

describe('PATCH /cups/:id', () => {
  describe('Anonymouns user', () => {
    test('updatting cup', async () => {
      const response = await apiClient.patch('/cups/id', {})

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })

    test('updatting cup type token invalid', async () => {
      const cup = {
        size: 300,
      }

      const response = await apiClient.patch('/cups/id', cup, {
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
    test('updatting new cup without write:cups rule', async () => {
      const response = await apiClient.patch(
        '/cups/id',
        {},
        {
          token,
          type: 'Bearer',
        },
      )

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
      price: 50,
      in_stock: true,
      description: '44',
    }
    test('updatting cup', async () => {
      const response = await apiClient.patch(`/cups/${cups[0].id}`, cup, {
        type: 'Bearer',
        token: tokenAdmin,
      })

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({ ...cup, id: body.id })
    })

    test('updatting cup with type size string', async () => {
      const cupSizeInvalid = {
        size: 'jj',
      }

      const response = await apiClient.patch(
        `/cups/${cups[0].id}`,
        cupSizeInvalid,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "size" está correta.',
        message: 'Tamanho do copo deve ser um numero inteiro.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('updatting cup with type price string', async () => {
      const cupSizeInvalid = {
        size: 300,
        price: 'jj',
      }

      const response = await apiClient.patch(
        `/cups/${cups[0].id}`,
        cupSizeInvalid,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "price" está correta.',
        message: 'Tamanho do copo deve ser um numero.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('updatting cup with type in_stock not boolean', async () => {
      const cupSizeInvalid = {
        size: 100,
        price: 10.5,
        in_stock: '---',
      }

      const response = await apiClient.patch(
        `/cups/${cups[0].id}`,
        cupSizeInvalid,
        {
          token: tokenAdmin,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se a propiedade "in_stock" está correta.',
        message: 'Em estoque deve ser verdadeiro ou falso.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('updatting cup with descrption length +301', async () => {
      const cup = {
        size: 25,
        price: 10,
        in_stock: true,
        description:
          'Imagine um copo de açaí, uma sinfonia de sabores e texturas que se unem em uma experiência verdadeiramente brasileira. A base, um creme denso e roxo-escuro, feito da polpa da fruta amazônica, exala um aroma terroso e levemente adocicado. A textura é um convite à gula: cremosa, porém com pequenos pedaços da fruta que se dissolvem na boca, liberando um sabor único e inconfundível. O doce do açaí, sutil e equilibrado, contrasta com a acidez suave da fruta, criando uma harmonia perfeita.',
      }
      const response = await apiClient.patch(`/cups/${cups[0].id}`, cup, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toEqual({
        action: 'Verifique se a propiedade "description" está correta.',
        message: 'Digite até 300 caracteres.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('updatting cup with number float', async () => {
      const user = { size: 2.5 }
      const response = await apiClient.patch(`/cups/${cups[0].id}`, user, {
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

    test('updatting exists cup', async () => {
      const cup = {
        size: 25,
        price: 10,
        in_stock: true,
        description: '',
      }
      const response = await apiClient.patch(`/cups/id`, cup, {
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
