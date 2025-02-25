import { prisma } from '../../prisma/prisma-client'

async function cleanUsers() {
  await prisma.user.deleteMany()
}

const orchestrator = { cleanUsers }

export default orchestrator
