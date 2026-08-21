import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'node:fs'

try {
  const content = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {}

const sql = neon(process.env.DATABASE_URL)
const tables = await sql.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
)
console.log('Tables :', tables.map((t) => t.table_name).join(', '))
const users = await sql.query('SELECT email, role, actif FROM users')
console.log('Utilisateurs :', JSON.stringify(users))
const services = await sql.query('SELECT COUNT(*)::int AS n FROM services')
console.log('Services :', services[0].n)
const settings = await sql.query('SELECT COUNT(*)::int AS n FROM settings')
console.log('Paramètres :', settings[0].n)
