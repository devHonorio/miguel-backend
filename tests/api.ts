const headers = { 'Content-type': 'application/json' }
export const CreateApiClient = (url: string) => {
  const post = async <T>(route: string, data: T) => {
    return await fetch(url + route, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
  }

  return { post }
}
