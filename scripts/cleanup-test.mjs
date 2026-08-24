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
const d1 = await sql.query("DELETE FROM rendez_vous WHERE nom LIKE 'TEST%' RETURNING id, nom")
const d2 = await sql.query("DELETE FROM inscriptions WHERE nom LIKE 'TEST%' RETURNING id, nom")
const d3 = await sql.query("DELETE FROM campagne_inscriptions WHERE nom LIKE 'TEST%' RETURNING id, nom")
console.log('Rendez-vous supprimés :', JSON.stringify(d1))
console.log('Inscriptions supprimées :', JSON.stringify(d2))
console.log('Inscriptions campagnes supprimées :', JSON.stringify(d3))
