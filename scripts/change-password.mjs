import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'node:fs'

try {
  const content = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {}

const email = process.argv[2] || 'admin@cabinet-saintexupery.com'
const newPassword = process.argv[3]

if (!newPassword || newPassword.length < 8) {
  console.error('Usage : node scripts/change-password.mjs <email> <nouveau-mot-de-passe> (min. 8 caractères)')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const hash = await bcrypt.hash(newPassword, 10)
const result = await sql.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING email', [
  hash,
  email,
])
if (result.length === 0) {
  console.error(`❌ Aucun utilisateur trouvé avec l'email ${email}`)
  process.exit(1)
}
console.log(`✅ Mot de passe mis à jour pour ${email}`)
