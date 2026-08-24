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
await sql.query(
  "INSERT INTO settings (cle, valeur) VALUES ('hero_image', 'images/medical100.png') ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur, updated_at = NOW()"
)
const check = await sql.query("SELECT cle, valeur FROM settings WHERE cle = 'hero_image'")
console.log('✅ hero_image mis à jour :', JSON.stringify(check[0]))
