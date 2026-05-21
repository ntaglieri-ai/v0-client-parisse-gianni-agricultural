import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || 'postgresql://neondb_owner:npg_fTAO9JBPFbi3@ep-delicate-voice-alsoxn5e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'

export function getDb() {
  return neon(DATABASE_URL)
}
