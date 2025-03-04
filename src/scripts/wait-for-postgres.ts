import { exec } from 'node:child_process'

process.stdout.write('\n\n🔴 Aguardando conexão com Postgres.')

async function checkPostgres() {
  exec('docker exec miguel-db pg_isready --host localhost', (err, stdout) => {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.')
      return checkPostgres()
    }

    process.stdout.write('\n🟢 Postgres está aceitando conexões.\n\n\n')
  })
}

checkPostgres()
