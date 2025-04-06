import { config } from 'dotenv'
import dotenv from 'dotenv-expand'
import { exec } from 'node:child_process'

dotenv.expand(config({ path: '.env.development' }))

if (process.env.VERCEL_TARGET_ENV === 'development') {
  console.log(`\nAmbiente é ${process.env.VERCEL_TARGET_ENV}`)

  console.log('Levantando serviços')

  exec('npm run services:up', (_err, stdout) => {
    console.log(stdout)
  })
} else {
  console.log(`\n\nAmbiente de ${process.env.VERCEL_TARGET_ENV}`)

  console.log(
    'Serviços não são necessários ser levantados para ambientes que não seja development',
  )
}
