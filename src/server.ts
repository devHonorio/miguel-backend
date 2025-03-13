import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import { routes } from './routes'
import ErrorBase, { InternalServerError } from './errors/error-base'
import cors from 'cors'

const app = express()
const environments = {
  preview: 'https://miguelacaipreview.vercel.app',
  development: 'http://localhost:3000',
  production: 'https://miguelacai.vercel.app',
}
const vercelTargetEnv = (process.env.VERCEL_TARGET_ENV ??
  'production') as keyof typeof environments

app.use(
  cors({
    origin: environments[vercelTargetEnv],
  }),
)

app.use(express.json())

app.use(routes)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.log(err)
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
