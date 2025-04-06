import { Cup } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

let cups: Cup[]

let adminAccessToken: string

beforeAll(async () => {
  await orchestrator.cleanUsers()
  await orchestrator.cleanCups()
  cups = await orchestrator.setCups()

  await orchestrator.setUserAdmin()
  const { access_token } = await apiClient.authAdmin()
  adminAccessToken = access_token
})

describe('GET /cups', () => {
  describe('Anonymous user', () => {
    test('retrieve all cups', async () => {
      const response = await apiClient.get('/cups')

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(cups.filter(({ in_stock }) => in_stock))
    })

    test('retrieve all cups in stock', async () => {
      const response = await apiClient.get('/cups')

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(cups.filter(({ in_stock }) => in_stock))
    })
  })

  describe('Admin user', () => {
    test('retrieve all cups', async () => {
      const response = await apiClient.get('/cups', {
        token: adminAccessToken,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(cups)
    })

    test('retrieve all cups in stock', async () => {
      const response = await apiClient.get('/cups', {
        token: adminAccessToken,
        type: 'Bearer',
      })

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual(cups)
    })
  })
})
