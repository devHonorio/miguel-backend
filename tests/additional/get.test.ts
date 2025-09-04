import { Additional } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

let additional: Additional[]

let adminAccessToken: string

beforeAll(async () => {
  await orchestrator.cleanDb()
  additional = await orchestrator.setAdditional()
  additional.sort((a, b) => a.name.localeCompare(b.name))

  await orchestrator.setUserAdmin()
  const { access_token } = await apiClient.authAdmin()
  adminAccessToken = access_token
})

describe('GET /additional', () => {
  describe('Anonymous user', () => {
    test('retrieve additional', async () => {
      const response = await apiClient.get('/additional')

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(additional.filter(({ in_stock }) => in_stock))
    })
  })

  describe('Admin user', () => {
    test('retrieve all additional', async () => {
      const response = await apiClient.get('/additional', {
        token: adminAccessToken,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(additional)
    })

    test('retrieve all cups in stock', async () => {
      const response = await apiClient.get('/additional', {
        token: adminAccessToken,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(additional)
    })
  })
})
