import { config } from 'dotenv'
import dotenv from 'dotenv-expand'
import { exec } from 'node:child_process'

dotenv.expand(config({ path: '.env.development' }))

function checkNodeEnvIsDevelopment() {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\nAmbintende is ${process.env.NODE_ENV}`)
    console.log('Levantando serviços')
    exec('npm run services:up', (_err, stdout) => {
      console.log(stdout)
    })
    return
  }

  console.log(`\n\nAmbintende is ${process.env.NODE_ENV}`)
  console.log('Serviços não são necessários ser levantados')
}

checkNodeEnvIsDevelopment()
