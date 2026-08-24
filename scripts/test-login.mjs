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

const sql = neon(process.env.DATABASE_URL)
const users = await sql.query('SELECT id, email, password, role, actif FROM users WHERE email = $1', [
  'admin@cabinet-saintexupery.com',
])
if (users.length === 0) {
  console.log('❌ Utilisateur introuvable')
} else {
  const u = users[0]
  const ok = await bcrypt.compare('MonCabinet2026!', u.password)
  console.log(`Utilisateur : ${u.email} | rôle : ${u.role} | actif : ${u.actif}`)
  console.log(ok ? '✅ Mot de passe MonCabinet2026! VALIDE' : '❌ Mot de passe INVALIDE')
}
