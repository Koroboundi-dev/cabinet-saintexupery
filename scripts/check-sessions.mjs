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
const rows = await sql.query(`
  SELECT f.slug, s.id AS session_id, s.date_debut, s.date_fin, s.statut, s.places_max, s.places_prises,
         (s.date_debut >= CURRENT_DATE) AS future
  FROM formations f LEFT JOIN sessions_formation s ON s.formation_id = f.id
  ORDER BY f.created_at DESC, s.date_debut ASC`)
console.log(JSON.stringify(rows, null, 2))
