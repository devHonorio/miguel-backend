import { config } from 'dotenv'
import dotenv from 'dotenv-expand'
dotenv.expand(config({ path: '.env.development' }))

export default {
  earlyAccess: true,
}

console.log(process.env.DATABASE_URL)
