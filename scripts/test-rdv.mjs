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

const b = {
  nom: 'TEST-DIAG',
  prenom: 'Diagnostic',
  telephone: '+22670000000',
  medecin_id: '',
  date_souhaitee: '2026-08-25',
  heure_souhaitee: '10:30',
  motif: 'test automatique',
}
const medecinId = b.medecin_id ? Number(b.medecin_id) : null
const serviceId = b.service_id ? Number(b.service_id) : null
const heure = `${b.heure_souhaitee}:00`

const inserted = await sql`
  INSERT INTO rendez_vous (nom, prenom, telephone, whatsapp, email, type_consultation, medecin_id, service_id, date_souhaitee, heure_souhaitee, motif, commentaire, statut)
  VALUES (${b.nom}, ${b.prenom}, ${b.telephone}, ${null}, ${null},
          ${null}, ${medecinId}, ${serviceId},
          ${b.date_souhaitee}, ${heure}, ${b.motif}, ${null}, 'en_attente')
  RETURNING id, nom, heure_souhaitee, statut`
console.log('✅ INSERT OK :', JSON.stringify(inserted[0]))

const deleted = await sql`DELETE FROM rendez_vous WHERE nom = 'TEST-DIAG' RETURNING id`
console.log(`🧹 Ligne de test supprimée (${deleted.length})`)
