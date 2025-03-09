import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const apiClient = CreateApiClient()

beforeAll(async () => {
  await orchestrator.cleanCups()
  await orchestrator.setCups()
})

describe('GET /cups', () => {
  describe('Anonymouns user', () => {
    test('retryven cups', async () => {
      const response = await apiClient.get('/cups')

      expect(response.status).toBe(200)

      const body = (await response.json()) as { id: string }[]

      expect(body).toEqual([
        {
          size: 300,
        },
        {
          size: 400,
        },
        {
          size: 500,
        },
      ])
    })
  })
})
