const sendText = async (phone: string, text: string) => {
  const options = {
    method: 'POST',
    headers: {
      apikey: process.env.AUTHENTICATION_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ number: phone, text }),
  }

  return await fetch(
    `${process.env.EVOLUTION_SERVER_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
    options,
  )
}

const Zap = { sendText }

export default Zap
