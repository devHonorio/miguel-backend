import orchestrator from '../tests/orchestrator'
import { prisma } from './prisma-client'

async function main() {
  await orchestrator.cleanDb()

  await orchestrator.setUserAdmin()
  const { id } = await orchestrator.setUser()
  await orchestrator.setAddressesWithUser(id)
  await orchestrator.setCups()
  await orchestrator.setAdditional()
  await orchestrator.setUsers()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
