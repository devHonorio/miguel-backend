interface HeadersTypes {
  type?: 'Bearer'
  token?: string
}

const headers = (auth?: HeadersTypes) => {
  const authorization = () => {
    if (auth?.type === 'Bearer')
      return { Authorization: `${auth?.type} ${auth?.token}` }
    if (auth?.token) return { Authorization: auth?.token }
  }
  return {
    'Content-type': 'application/json',
    ...authorization(),
  }
}

const baseUrl = 'http://localhost:3001'

export const CreateApiClient = () => {
  const post = async <T>(route: string, data: T, auth?: HeadersTypes) => {
    return await fetch(baseUrl + route, {
      method: 'POST',
      headers: headers(auth),
      body: JSON.stringify(data),
    })
  }

  const authAdmin = async () => {
    const response = await fetch(baseUrl + '/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ phone: '00000000000', password: '0000' }),
    })

    return (await response.json()) as { access_token: string }
  }

  const auth = async () => {
    const response = await fetch(baseUrl + '/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ phone: '11111111111', password: '1111' }),
    })

    return (await response.json()) as { access_token: string }
  }

  const get = async (route: string) => {
    return await fetch(baseUrl + route)
  }

  const remove = async (route: string, auth?: HeadersTypes) => {
    return await fetch(baseUrl + route, {
      method: 'DELETE',
      headers: headers(auth),
    })
  }

  return { post, authAdmin, auth, get, delete: remove }
}
