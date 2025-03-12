import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import { routes } from './routes'
import ErrorBase, { InternalServerError } from './errors/error-base'
import cors from 'cors'

const app = express()

app.use(
  cors({
    origin:
      process.env.VERCEL_TARGET_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://miguelacai.vercel.app',
  }),
)

app.use(express.json())

app.use(routes)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ErrorBase) {
    res.status(err.statusCode).json(err.toJSON())
    return
  }

  const errorPublic = new InternalServerError(err)
  console.error(errorPublic)
  res.status(errorPublic.statusCode).json(errorPublic.toJSON())
})

app.listen(process.env.PORT ?? 3001, () => {
  console.log('http://localhost:3001')
})
