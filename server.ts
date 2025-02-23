import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.json({
    ok: true,
  })
})

app.listen(process.env.PORT ?? 3001, () => {
  console.log('http://localhost:3001')
})
