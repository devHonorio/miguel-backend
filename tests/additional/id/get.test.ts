import { Additional } from '@prisma/client'
import { CreateApiClient } from '../../api'
import orchestrator from '../../orchestrator'

const apiClient = CreateApiClient()

let tokenAdmin: string

let additional: Additional[]

beforeAll(async () => {
  await orchestrator.cleanDb()

  await orchestrator.setUser()

  await orchestrator.setUserAdmin()
  const { access_token: access_token_admin } = await apiClient.authAdmin()
  tokenAdmin = access_token_admin

  additional = await orchestrator.setAdditional()
})

describe('GET /additional:id', () => {
  describe('Anonymous user', () => {
    test('getting additional in stock', async () => {
      const response = await apiClient.get(`/additional/${additional[0].id}`)

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        ...additional[0],
        id: body.id,
      })
    })

    test('getting additional not stock', async () => {
      const response = await apiClient.get(`/additional/${additional[7].id}`)

      expect(response.status).toBe(404)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        action: 'Verifique a propriedade "id".',
        message: 'Additional não existe.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })
  })

  describe('Admin user', () => {
    test('getting additional', async () => {
      const response = await apiClient.get(`/additional/${additional[0].id}`, {
        type: 'Bearer',
        token: tokenAdmin,
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        ...additional[0],
        id: body.id,
      })
    })
    test('getting additional not stock', async () => {
      const response = await apiClient.get(`/additional/${additional[2].id}`, {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        ...additional[2],
        id: body.id,
      })
    })
    test('getting not exists additional', async () => {
      const response = await apiClient.get('/additional/not-exists', {
        token: tokenAdmin,
        type: 'Bearer',
      })

      expect(response.status).toBe(404)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "id".',
        message: 'Additional não existe.',
        name: 'NotFoundError',
        statusCode: 404,
      })
    })
  })
})
