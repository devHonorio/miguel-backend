import { config } from 'dotenv'
import dotenv from 'dotenv-expand'
import { exec } from 'node:child_process'

dotenv.expand(config({ path: '.env.development' }))

function checkNodeEnvIsDevelopment() {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\nAmbintende is ${process.env.NODE_ENV}`)

    console.log('Levantando serviços')

    exec('npm run migrate:dev', (_err, stdout) => {
      console.log(stdout)
    })

    exec('npm run services:stop', (_err, stdout) => {
      console.log(stdout)
    })

    return
  }

  exec('npm run migrate:deploy', (_err, stdout) => {
    console.log(stdout)
  })
}

checkNodeEnvIsDevelopment()
