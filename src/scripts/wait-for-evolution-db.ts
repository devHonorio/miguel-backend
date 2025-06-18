import { config } from 'dotenv'
import dotenv from 'dotenv-expand'
import { exec } from 'node:child_process'

dotenv.expand(config({ path: '.env.development' }))

async function checkPostgres() {
  exec(
    'docker exec evolution-db pg_isready --host localhost',
    (err, stdout) => {
      if (stdout.search('accepting connections') === -1) {
        process.stdout.write('.')
        return checkPostgres()
      }

      process.stdout.write('\n🟢 Postgres está aceitando conexões.\n\n\n')
    },
  )
}

if (process.env.VERCEL_TARGET_ENV === 'development') {
  process.stdout.write('\n\n🔴 Aguardando conexão com Postgres.')

  checkPostgres()
} else {
  console.log('Script não necessário para ambientes que não seja development')
}
