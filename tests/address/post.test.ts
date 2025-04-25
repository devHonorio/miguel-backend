import { Prisma } from '@prisma/client'
import { CreateApiClient } from '../api'
import orchestrator from '../orchestrator'

const STREET_WITH_LENGTH_300 =
  'Rua da Celebração da Amizade Duradoura e da Cooperação Fraternal entre os Povos de Todas as Nações, um Caminho que Floresce com a Paz, a Compreensão Mútua e a Alegria Compartilhada, Iluminado pela Esperança de um Futuro Brilhante e Harmonioso para Toda a Humanidade'

const api = CreateApiClient()

let token: string

let user_id: string

beforeAll(async () => {
  await orchestrator.cleanUsers()
  const { id } = await orchestrator.setUser()
  user_id = id

  const { access_token } = await api.auth()

  token = access_token
})

describe('POST /address', () => {
  describe('Anonymous user', () => {
    test('creating new address', async () => {
      const response = await api.post('/address', {})

      expect(response.status).toBe(401)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique se o token foi setado.',
        message: 'Usuário não autorizado.',
        name: 'UnauthorizedError',
        statusCode: 401,
      })
    })
  })

  describe('User', () => {
    const address: Prisma.AddressCreateInput = {
      street: 'Rua Papa João Paulo II',
      number: 538,
      district: 'Água Verde',
      complement: 'Perto do Colégio Nereu.',
      city: 'Ampére',
      address_complete: '',
    }

    // street
    test('creating address with street length bigger 200', async () => {
      const response = await api.post(
        '/address',
        { ...address, street: STREET_WITH_LENGTH_300 },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "street".',
        message: 'Nome da rua deve ter menos de 200 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address with street name shorter than 3 letters.', async () => {
      const response = await api.post(
        '/address',
        { ...address, street: '' },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "street".',
        message: 'Nome da rua deve ter pelo menos 3 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address without street.', async () => {
      const response = await api.post(
        '/address',
        { ...address, street: undefined },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "street".',
        message: 'Rua é obrigatório.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    // number
    test('creating address with number less than 0.', async () => {
      const response = await api.post(
        '/address',
        { ...address, number: -1 },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "number".',
        message: 'Numero deve ser um numero positivo.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address without number.', async () => {
      const response = await api.post(
        '/address',
        { ...address, number: undefined },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "number".',
        message: 'Numero é obrigatório.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address with float number.', async () => {
      const response = await api.post(
        '/address',
        { ...address, number: 1.5 },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "number".',
        message: 'Numero deve ser um inteiro.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    // district
    test('creating address with district length bigger 200', async () => {
      const response = await api.post(
        '/address',
        { ...address, district: STREET_WITH_LENGTH_300 },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "district".',
        message: 'Bairro deve ter menos de 200 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address with district name shorter than 3 letters.', async () => {
      const response = await api.post(
        '/address',
        { ...address, district: '' },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "district".',
        message: 'Bairro deve ter pelo menos 3 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address without district.', async () => {
      const response = await api.post(
        '/address',
        { ...address, district: undefined },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "district".',
        message: 'Bairro é obrigatório.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    // complement
    test('creating address with complement length bigger 299', async () => {
      const response = await api.post(
        '/address',
        { ...address, complement: STREET_WITH_LENGTH_300 },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "complement".',
        message: 'Complemento deve ter menos de 300 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    test('creating address with complement name shorter than 3 letters.', async () => {
      const response = await api.post(
        '/address',
        { ...address, complement: '' },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(400)

      const body = await response.json()

      expect(body).toEqual({
        action: 'Verifique a propriedade "complement".',
        message: 'Complemento deve ter pelo menos 3 letras.',
        name: 'BadRequestError',
        statusCode: 400,
      })
    })

    // address
    test('creating address.', async () => {
      const response = await api.post('/address', address, {
        token,
        type: 'Bearer',
      })

      expect(response.status).toBe(201)

      const body = (await response.json()) as { id: string }

      expect(body).toEqual({
        id: body.id,
        street: address.street.toLocaleLowerCase(),
        number: address.number,
        district: address.district.toLocaleLowerCase(),
        complement: address.complement?.toLocaleLowerCase(),
        city: address.city.toLocaleLowerCase(),
        address_complete:
          `${address.street} - ${address.number}, ${address.district}, ${address.city}, ${address.complement}`.toLocaleLowerCase(),
      })
    })

    test('creating address with user.', async () => {
      const response = await api.post(
        '/address',
        { ...address, user_id },
        {
          token,
          type: 'Bearer',
        },
      )

      expect(response.status).toBe(201)

      const body = (await response.json()) as { id: string; user_id: string }

      expect(body).toEqual({
        id: body.id,
        street: address.street.toLocaleLowerCase(),
        number: address.number,
        district: address.district.toLocaleLowerCase(),
        complement: address.complement?.toLocaleLowerCase(),
        city: address.city.toLocaleLowerCase(),
        address_complete:
          `${address.street} - ${address.number}, ${address.district}, ${address.city}, ${address.complement}`.toLocaleLowerCase(),
        user_id: body.user_id,
      })
    })
  })
})
