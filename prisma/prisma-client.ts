import dotenv from 'dotenv-expand'

import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.expand(config({ path: '.env.development' }))

export const prisma = new PrismaClient()
