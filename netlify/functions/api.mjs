import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getSql, ensureSchema } from './db.mjs'

const JWT_SECRET = process.env.AUTH_SECRET || 'cabinet-saintexupery-secret-2026'

/* ---------- Helpers ---------- */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const slugify = (str) =>
  String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function getUserFromAuth(request) {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

function requireAdmin(request) {
  const payload = getUserFromAuth(request)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

function paginate(items, page, perPage) {
  const total = items.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(Math.max(1, parseInt(page) || 1), lastPage)
  const start = (currentPage - 1) * perPage
  return {
    data: items.slice(start, start + perPage),
    current_page: currentPage,
    last_page: lastPage,
    per_page: perPage,
    total,
    from: total === 0 ? null : start + 1,
    to: Math.min(start + perPage, total),
  }
}

const fmtDate = (d) => {
  if (!d) return null
  const date = new Date(d)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
const fmtTime = (t) => (t ? String(t).slice(0, 5) : null)

function mapSession(s) {
  const restantes = Number(s.places_max) - Number(s.places_prises)
  return {
    ...s,
    places_restantes: restantes,
    est_complete: Number(s.places_prises) >= Number(s.places_max),
    periode: `${fmtDate(s.date_debut)} au ${fmtDate(s.date_fin)}`,
    heure_debut: fmtTime(s.heure_debut),
    heure_fin: fmtTime(s.heure_fin),
  }
}

function mapFormation(f, sessions = []) {
  const now = new Date().toISOString().slice(0, 10)
  const futurePlanned = sessions
    .filter((s) => s.statut === 'planifiee' && s.date_debut >= now)
    .sort((a, b) => (a.date_debut < b.date_debut ? -1 : 1))
  const prochaine = futurePlanned[0] || null
  return {
    ...f,
    tarif_adulte: Number(f.tarif_adulte),
    tarif_enfant: f.tarif_enfant != null ? Number(f.tarif_enfant) : null,
    prochaine_session: prochaine ? mapSession(prochaine) : null,
    places_disponibles: prochaine
      ? Number(prochaine.places_max) - Number(prochaine.places_prises)
      : null,
  }
}

function mapCampagne(c) {
  const now = new Date().toISOString().slice(0, 10)
  const debut = String(c.date_debut).slice(0, 10)
  const fin = String(c.date_fin).slice(0, 10)
  const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  const d = new Date(fin + 'T00:00:00')
  const periodeFin = `${String(d.getDate()).padStart(2, '0')} ${mois[d.getMonth()]} ${d.getFullYear()}`
  return {
    ...c,
    est_en_cours: now >= debut && now <= fin,
    est_terminee: now > fin,
    periode: `${debut.slice(8, 10)} → ${periodeFin}`,
    heure_debut: fmtTime(c.heure_debut),
    heure_fin: fmtTime(c.heure_fin),
  }
}

const MOIS_COURT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
function formatDateFr(value, withTime = false) {
  if (!value) return ''
  const d = new Date(value)
  const base = `${String(d.getDate()).padStart(2, '0')} ${MOIS_COURT[d.getMonth()]} ${d.getFullYear()}`
  if (!withTime) return base
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${base} à ${hh}:${mi}`
}

/* ---------- Validations ---------- */

function validateRendezVous(b) {
  const errors = {}
  if (!b.nom || typeof b.nom !== 'string' || b.nom.length > 255) errors.nom = 'Le champ nom est obligatoire.'
  if (!b.prenom || typeof b.prenom !== 'string' || b.prenom.length > 255) errors.prenom = 'Le champ prénom est obligatoire.'
  if (!b.telephone || typeof b.telephone !== 'string' || b.telephone.length > 20) errors.telephone = 'Le champ téléphone est obligatoire.'
  if (b.whatsapp && String(b.whatsapp).length > 20) errors.whatsapp = 'Le whatsapp ne doit pas dépasser 20 caractères.'
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.email = 'Le champ email doit être une adresse email valide.'
  if (!b.date_souhaitee) {
    errors.date_souhaitee = 'Le champ date souhaitée est obligatoire.'
  } else {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    if (new Date(b.date_souhaitee + 'T00:00:00') < today) errors.date_souhaitee = 'La date souhaitée doit être une date postérieure ou égale à aujourd\'hui.'
  }
  if (!b.heure_souhaitee) errors.heure_souhaitee = 'Le champ heure souhaitée est obligatoire.'
  if (b.motif && String(b.motif).length > 1000) errors.motif = 'Le motif ne doit pas dépasser 1000 caractères.'
  if (b.commentaire && String(b.commentaire).length > 1000) errors.commentaire = 'Le commentaire ne doit pas dépasser 1000 caractères.'
  return errors
}

function validateInscription(b) {
  const errors = {}
  if (!b.nom || String(b.nom).length > 255) errors.nom = 'Le champ nom est obligatoire.'
  if (!b.prenom || String(b.prenom).length > 255) errors.prenom = 'Le champ prénom est obligatoire.'
  if (!b.telephone || String(b.telephone).length > 20) errors.telephone = 'Le champ téléphone est obligatoire.'
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.email = 'Le champ email doit être une adresse email valide.'
  if (b.whatsapp && String(b.whatsapp).length > 20) errors.whatsapp = 'Le whatsapp ne doit pas dépasser 20 caractères.'
  if (b.organisation && String(b.organisation).length > 255) errors.organisation = 'L\'organisation ne doit pas dépasser 255 caractères.'
  if (!['moins_15_ans', 'adulte'].includes(b.categorie)) errors.categorie = 'Le champ catégorie est obligatoire.'
  return errors
}

function validateCampagneInscription(b) {
  const errors = {}
  if (!b.nom || String(b.nom).length > 255) errors.nom = 'Le champ nom est obligatoire.'
  if (!b.prenom || String(b.prenom).length > 255) errors.prenom = 'Le champ prénom est obligatoire.'
  if (!b.telephone || String(b.telephone).length > 20) errors.telephone = 'Le champ téléphone est obligatoire.'
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.email = 'Le champ email doit être une adresse email valide.'
  if (b.whatsapp && String(b.whatsapp).length > 20) errors.whatsapp = 'Le whatsapp ne doit pas dépasser 20 caractères.'
  return errors
}

function validateContact(b) {
  const errors = {}
  if (!b.nom || String(b.nom).length > 255) errors.nom = 'Le champ nom est obligatoire.'
  if (b.prenom && String(b.prenom).length > 255) errors.prenom = 'Le prénom ne doit pas dépasser 255 caractères.'
  if (!b.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.email = 'Le champ email est obligatoire et doit être valide.'
  if (b.telephone && String(b.telephone).length > 20) errors.telephone = 'Le téléphone ne doit pas dépasser 20 caractères.'
  if (!b.sujet || String(b.sujet).length > 255) errors.sujet = 'Le champ sujet est obligatoire.'
  if (!b.message || String(b.message).length > 5000) errors.message = 'Le champ message est obligatoire.'
  return errors
}

function validateEntreprise(b) {
  const errors = {}
  if (!b.nom || String(b.nom).length > 255) errors.nom = 'Le champ nom de l\'organisation est obligatoire.'
  if (!b.contact_nom || String(b.contact_nom).length > 255) errors.contact_nom = 'Le champ nom du contact est obligatoire.'
  if (b.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.contact_email)) errors.contact_email = 'Le champ email doit être une adresse email valide.'
  if (!b.contact_telephone || String(b.contact_telephone).length > 20) errors.contact_telephone = 'Le champ téléphone est obligatoire.'
  if (b.nombre_employes && !Number.isInteger(Number(b.nombre_employes))) errors.nombre_employes = 'Le nombre d\'employés doit être un entier.'
  return errors
}

/* ---------- Main handler ---------- */

export default async (request) => {
  const url = new URL(request.url)
  // /api/xxx or /.netlify/functions/api/xxx
  let path = url.pathname
  path = path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '')
  if (!path.startsWith('/')) path = '/' + path
  const method = request.method.toUpperCase()

  try {
    await ensureSchema()
    const sql = getSql()
    const seg = path.split('/').filter(Boolean)

    /* ===== AUTH ===== */
    if (path === '/auth/login' && method === 'POST') {
      const b = await readBody(request)
      const errors = {}
      if (!b.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.email = 'Le champ email est obligatoire.'
      if (!b.password) errors.password = 'Le champ mot de passe est obligatoire.'
      if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)

      const users = await sql`SELECT * FROM users WHERE email = ${b.email} LIMIT 1`
      const user = users[0]
      if (!user || !(await bcrypt.compare(b.password, user.password))) {
        return json({ message: 'Identifiants incorrects.', errors: { email: 'Identifiants incorrects.' } }, 422)
      }
      const token = jwt.sign(
        { sub: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      return json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, telephone: user.telephone },
      })
    }

    if (path === '/auth/me' && method === 'GET') {
      const payload = getUserFromAuth(request)
      if (!payload) return json({ message: 'Non authentifié.' }, 401)
      return json({ user: { id: payload.sub, name: payload.name, email: payload.email, role: payload.role } })
    }

    /* ===== SETTINGS PUBLIC ===== */
    if (path === '/settings' && method === 'GET') {
      const rows = await sql`SELECT cle, valeur FROM settings`
      const out = {}
      for (const r of rows) out[r.cle] = r.valeur
      return json(out)
    }

    /* ===== ACCUEIL ===== */
    if (path === '/accueil' && method === 'GET') {
      const services = await sql`SELECT * FROM services WHERE actif = TRUE ORDER BY ordre ASC`
      const medecins = await sql`SELECT * FROM medecins WHERE actif = TRUE LIMIT 6`
      const campagnesRows = await sql`
        SELECT * FROM campagnes
        WHERE active = TRUE AND date_fin >= CURRENT_DATE
        ORDER BY date_debut ASC`
      const actualites = await sql`SELECT * FROM actualites WHERE active = TRUE ORDER BY created_at DESC LIMIT 3`
      const formationsRows = await sql`SELECT * FROM formations WHERE active = TRUE ORDER BY created_at DESC LIMIT 3`
      const sessionsAll = await sql`
        SELECT s.* FROM sessions_formation s
        JOIN formations f ON f.id = s.formation_id
        WHERE f.active = TRUE AND s.statut = 'planifiee' AND s.date_debut >= CURRENT_DATE
        ORDER BY s.date_debut ASC`
      const byFormation = {}
      for (const s of sessionsAll) {
        ;(byFormation[s.formation_id] ||= []).push(mapSession(s))
      }
      return json({
        services,
        medecins,
        campagnes: campagnesRows.map(mapCampagne),
        actualites,
        formations: formationsRows.map((f) => mapFormation(f, byFormation[f.id] || [])),
      })
    }

    /* ===== SERVICES ===== */
    if (path === '/services' && method === 'GET') {
      const services = await sql`SELECT * FROM services WHERE actif = TRUE ORDER BY ordre ASC`
      const medecins = await sql`SELECT * FROM medecins WHERE actif = TRUE ORDER BY nom ASC`
      const out = services.map((s) => ({
        ...s,
        medecins: medecins.filter((m) => m.service_id === s.id),
      }))
      return json(out)
    }

    if (seg[0] === 'services' && seg[1] && method === 'GET') {
      const rows = await sql`SELECT * FROM services WHERE slug = ${seg[1]} AND actif = TRUE LIMIT 1`
      if (!rows[0]) return json({ message: 'Service non trouvé.' }, 404)
      const medecins = await sql`SELECT * FROM medecins WHERE service_id = ${rows[0].id} AND actif = TRUE ORDER BY nom ASC`
      return json({ ...rows[0], medecins })
    }

    /* ===== MEDECINS PUBLIC ===== */
    if (path === '/medecins' && method === 'GET') {
      const medecins = await sql`SELECT * FROM medecins WHERE actif = TRUE ORDER BY nom ASC`
      return json(medecins)
    }

    if (seg[0] === 'medecins' && seg[1] && method === 'GET') {
      const rows = await sql`SELECT * FROM medecins WHERE slug = ${seg[1]} AND actif = TRUE LIMIT 1`
      if (!rows[0]) return json({ message: 'Médecin non trouvé.' }, 404)
      return json(rows[0])
    }

    /* ===== FORMATIONS PUBLIC ===== */
    if (path === '/formations' && method === 'GET') {
      const formations = await sql`SELECT * FROM formations WHERE active = TRUE ORDER BY created_at DESC`
      const sessions = await sql`
        SELECT s.* FROM sessions_formation s
        JOIN formations f ON f.id = s.formation_id
        WHERE f.active = TRUE AND s.statut = 'planifiee' AND s.date_debut >= CURRENT_DATE
        ORDER BY s.date_debut ASC`
      const byF = {}
      for (const s of sessions) (byF[s.formation_id] ||= []).push(mapSession(s))
      return json(formations.map((f) => mapFormation(f, byF[f.id] || [])))
    }

    if (seg[0] === 'formations' && seg[1] && seg.length === 2 && method === 'GET') {
      const rows = await sql`SELECT * FROM formations WHERE slug = ${seg[1]} AND active = TRUE LIMIT 1`
      if (!rows[0]) return json({ message: 'Formation non trouvée.' }, 404)
      const sessions = await sql`
        SELECT * FROM sessions_formation
        WHERE formation_id = ${rows[0].id} AND statut = 'planifiee'
        ORDER BY date_debut ASC`
      return json({ ...mapFormation(rows[0], sessions.map(mapSession)), sessions: sessions.map(mapSession) })
    }

    /* ===== CAMPAGNES PUBLIC ===== */
    if (path === '/campagnes' && method === 'GET') {
      const campagnes = await sql`SELECT * FROM campagnes WHERE active = TRUE ORDER BY date_debut DESC`
      return json(campagnes.map(mapCampagne))
    }

    if (seg[0] === 'campagnes' && seg[1] && seg.length === 2 && method === 'GET') {
      const rows = await sql`SELECT * FROM campagnes WHERE slug = ${seg[1]} AND active = TRUE LIMIT 1`
      if (!rows[0]) return json({ message: 'Campagne non trouvée.' }, 404)
      return json(mapCampagne(rows[0]))
    }

    /* ===== ACTUALITES PUBLIC ===== */
    if (path === '/actualites' && method === 'GET') {
      const all = await sql`SELECT * FROM actualites WHERE active = TRUE ORDER BY created_at DESC`
      return json(paginate(all, url.searchParams.get('page'), 9))
    }

    if (seg[0] === 'actualites' && seg[1] && method === 'GET') {
      const rows = await sql`SELECT * FROM actualites WHERE slug = ${seg[1]} AND active = TRUE LIMIT 1`
      if (!rows[0]) return json({ message: 'Actualité non trouvée.' }, 404)
      return json(rows[0])
    }

    /* ===== RENDEZ-VOUS PUBLIC ===== */
    if (path === '/rendez-vous/medecins' && method === 'GET') {
      const medecins = await sql`SELECT id, nom, prenom FROM medecins WHERE actif = TRUE ORDER BY nom ASC`
      return json(medecins)
    }

    if (path === '/rendez-vous' && method === 'POST') {
      const b = await readBody(request)
      const errors = validateRendezVous(b)
      if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
      if (b.medecin_id) {
        const m = await sql`SELECT id FROM medecins WHERE id = ${b.medecin_id}`
        if (!m[0]) return json({ message: 'Données invalides.', errors: { medecin_id: 'Le médecin sélectionné est invalide.' } }, 422)
      }
      await sql`
        INSERT INTO rendez_vous (nom, prenom, telephone, whatsapp, email, type_consultation, medecin_id, service_id, date_souhaitee, heure_souhaitee, motif, commentaire, statut)
        VALUES (${b.nom}, ${b.prenom}, ${b.telephone}, ${b.whatsapp || null}, ${b.email || null},
                ${b.type_consultation || null}, ${b.medecin_id || null}, ${b.service_id || null},
                ${b.date_souhaitee}, ${b.heure_souhaitee}:00, ${b.motif || null}, ${b.commentaire || null}, 'en_attente')`
      return json({ success: true }, 201)
    }

    /* ===== INSCRIPTION FORMATION ===== */
    if (seg[0] === 'formation-sessions' && seg[1] && seg[2] === 'inscription' && method === 'POST') {
      const sessionId = Number(seg[1])
      const sessRows = await sql`
        SELECT s.*, f.tarif_adulte, f.tarif_enfant FROM sessions_formation s
        JOIN formations f ON f.id = s.formation_id
        WHERE s.id = ${sessionId} LIMIT 1`
      const session = sessRows[0]
      if (!session) return json({ message: 'Session non trouvée.' }, 404)

      const b = await readBody(request)
      const errors = validateInscription(b)
      if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)

      if (Number(session.places_prises) >= Number(session.places_max)) {
        return json({ message: 'Cette session est complète. Veuillez choisir une autre session.', errors: { session: 'Cette session est complète. Veuillez choisir une autre session.' } }, 422)
      }

      const montant = b.categorie === 'moins_15_ans' && session.tarif_enfant != null
        ? Number(session.tarif_enfant)
        : Number(session.tarif_adulte)

      await sql`
        INSERT INTO inscriptions (session_formation_id, nom, prenom, telephone, email, whatsapp, organisation, categorie, montant_paye, statut_paiement, statut_inscription)
        VALUES (${sessionId}, ${b.nom}, ${b.prenom}, ${b.telephone}, ${b.email || null}, ${b.whatsapp || null},
                ${b.organisation || null}, ${b.categorie}, ${montant}, 'en_attente', 'en_attente')`
      await sql`UPDATE sessions_formation SET places_prises = places_prises + 1, updated_at = NOW() WHERE id = ${sessionId}`
      return json({ success: true }, 201)
    }

    /* ===== INSCRIPTION CAMPAGNE ===== */
    if (seg[0] === 'campagnes' && seg[1] && seg[2] === 'inscription' && method === 'POST') {
      const campagneId = Number(seg[1])
      const c = await sql`SELECT id FROM campagnes WHERE id = ${campagneId}`
      if (!c[0]) return json({ message: 'Campagne non trouvée.' }, 404)

      const b = await readBody(request)
      const errors = validateCampagneInscription(b)
      if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)

      await sql`
        INSERT INTO campagne_inscriptions (campagne_id, nom, prenom, telephone, email, whatsapp, statut)
        VALUES (${campagneId}, ${b.nom}, ${b.prenom}, ${b.telephone}, ${b.email || null}, ${b.whatsapp || null}, 'en_attente')`
      return json({ success: true }, 201)
    }

    /* ===== CONTACT PUBLIC ===== */
    if (path === '/contact' && method === 'POST') {
      const b = await readBody(request)
      const errors = validateContact(b)
      if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
      await sql`
        INSERT INTO contacts (nom, prenom, email, telephone, sujet, message, statut)
        VALUES (${b.nom}, ${b.prenom || null}, ${b.email}, ${b.telephone || null}, ${b.sujet}, ${b.message}, 'nouveau')`
      return json({ success: true, message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' }, 201)
    }

    if (path === '/contact/entreprise' && method === 'POST') {
      const b = await readBody(request)
      const errors = validateEntreprise(b)
      if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
      await sql`
        INSERT INTO entreprises (nom, contact_nom, contact_email, contact_telephone, secteur, nombre_employes, besoins, statut)
        VALUES (${b.nom}, ${b.contact_nom}, ${b.contact_email || null}, ${b.contact_telephone},
                ${b.secteur || null}, ${b.nombre_employes ? Number(b.nombre_employes) : null}, ${b.besoins || null}, 'nouvelle')`
      return json({ success: true, message: 'Votre demande a été enregistrée. Notre équipe vous contactera prochainement.' }, 201)
    }

    /* ================= ADMIN ================= */
    if (seg[0] === 'admin') {
      const admin = requireAdmin(request)
      if (!admin) return json({ message: 'Non authentifié.' }, 401)

      /* --- Dashboard --- */
      if (path === '/admin/dashboard' && method === 'GET') {
        const count = async (q) => Number((await sql(q))[0].n)
        const stats = {
          rendez_vous_total: await count`SELECT COUNT(*) AS n FROM rendez_vous`,
          rendez_vous_en_attente: await count`SELECT COUNT(*) AS n FROM rendez_vous WHERE statut = 'en_attente'`,
          rendez_vous_confirme: await count`SELECT COUNT(*) AS n FROM rendez_vous WHERE statut = 'confirme'`,
          inscriptions_total: await count`SELECT COUNT(*) AS n FROM inscriptions`,
          campagnes_actives: await count`SELECT COUNT(*) AS n FROM campagnes WHERE active = TRUE AND date_fin >= CURRENT_DATE`,
          contacts_nouveaux: await count`SELECT COUNT(*) AS n FROM contacts WHERE statut = 'nouveau'`,
          entreprises_nouvelles: await count`SELECT COUNT(*) AS n FROM entreprises WHERE statut = 'nouvelle'`,
          services_total: await count`SELECT COUNT(*) AS n FROM services`,
          medecins_total: await count`SELECT COUNT(*) AS n FROM medecins`,
          formations_total: await count`SELECT COUNT(*) AS n FROM formations`,
          actualites_total: await count`SELECT COUNT(*) AS n FROM actualites`,
        }
        const derniers_rdv = await sql`
          SELECT r.*, m.nom AS medecin_nom, m.prenom AS medecin_prenom, s.nom AS service_nom
          FROM rendez_vous r
          LEFT JOIN medecins m ON m.id = r.medecin_id
          LEFT JOIN services s ON s.id = r.service_id
          ORDER BY r.created_at DESC LIMIT 10`
        const derniers_contacts = await sql`SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5`
        return json({ stats, derniers_rdv, derniers_contacts })
      }

      /* --- Rendez-vous admin --- */
      if (path === '/admin/rendez-vous' && method === 'GET') {
        const all = await sql`
          SELECT r.*, m.nom AS medecin_nom, m.prenom AS medecin_prenom
          FROM rendez_vous r LEFT JOIN medecins m ON m.id = r.medecin_id
          ORDER BY r.created_at DESC`
        return json(paginate(all, url.searchParams.get('page'), 20))
      }

      if (seg[1] === 'rendez-vous' && seg[2] && method === 'PUT') {
        const b = await readBody(request)
        if (!['en_attente', 'confirme', 'annule', 'termine'].includes(b.statut)) {
          return json({ message: 'Statut invalide.', errors: { statut: 'Le statut sélectionné est invalide.' } }, 422)
        }
        await sql`UPDATE rendez_vous SET statut = ${b.statut}, updated_at = NOW() WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Statut du rendez-vous mis à jour.' })
      }

      if (seg[1] === 'rendez-vous' && seg[2] && method === 'DELETE') {
        await sql`DELETE FROM rendez_vous WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Rendez-vous supprimé.' })
      }

      /* --- Inscriptions formations --- */
      if (path === '/admin/inscriptions/formations' && method === 'GET') {
        const all = await sql`
          SELECT i.*, sf.date_debut, sf.date_fin, sf.lieu, f.titre AS formation_titre
          FROM inscriptions i
          JOIN sessions_formation sf ON sf.id = i.session_formation_id
          JOIN formations f ON f.id = sf.formation_id
          ORDER BY i.created_at DESC`
        const data = paginate(all, url.searchParams.get('page'), 20)
        data.data = data.data.map((i) => ({ ...i, montant_paye: Number(i.montant_paye) }))
        return json(data)
      }

      if (seg[1] === 'inscriptions' && seg[2] === 'formations' && seg[3] && method === 'PUT') {
        const b = await readBody(request)
        if (!['en_attente', 'confirmee', 'annulee'].includes(b.statut_inscription)) {
          return json({ message: 'Statut invalide.', errors: { statut_inscription: 'Le statut sélectionné est invalide.' } }, 422)
        }
        await sql`UPDATE inscriptions SET statut_inscription = ${b.statut_inscription}, updated_at = NOW() WHERE id = ${Number(seg[3])}`
        return json({ success: true, message: "Statut de l'inscription mis à jour." })
      }

      /* --- Inscriptions campagnes --- */
      if (path === '/admin/inscriptions/campagnes' && method === 'GET') {
        const all = await sql`
          SELECT ci.*, c.titre AS campagne_titre
          FROM campagne_inscriptions ci
          JOIN campagnes c ON c.id = ci.campagne_id
          ORDER BY ci.created_at DESC`
        return json(paginate(all, url.searchParams.get('page'), 20))
      }

      if (seg[1] === 'inscriptions' && seg[2] === 'campagnes' && seg[3] && method === 'PUT') {
        const b = await readBody(request)
        if (!['en_attente', 'confirme', 'annule'].includes(b.statut)) {
          return json({ message: 'Statut invalide.', errors: { statut: 'Le statut sélectionné est invalide.' } }, 422)
        }
        await sql`UPDATE campagne_inscriptions SET statut = ${b.statut}, updated_at = NOW() WHERE id = ${Number(seg[3])}`
        return json({ success: true, message: "Statut de l'inscription mis à jour." })
      }

      /* --- Contacts --- */
      if (path === '/admin/contacts' && method === 'GET') {
        const all = await sql`SELECT * FROM contacts ORDER BY created_at DESC`
        return json(paginate(all, url.searchParams.get('page'), 20))
      }

      if (seg[1] === 'contacts' && seg[2] && method === 'PUT') {
        const b = await readBody(request)
        if (!['nouveau', 'lu', 'repondu'].includes(b.statut)) {
          return json({ message: 'Statut invalide.', errors: { statut: 'Le statut sélectionné est invalide.' } }, 422)
        }
        await sql`UPDATE contacts SET statut = ${b.statut}, updated_at = NOW() WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Statut mis à jour.' })
      }

      if (seg[1] === 'contacts' && seg[2] && method === 'DELETE') {
        await sql`DELETE FROM contacts WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Message supprimé.' })
      }

      /* --- Entreprises --- */
      if (path === '/admin/entreprises' && method === 'GET') {
        const all = await sql`SELECT * FROM entreprises ORDER BY created_at DESC`
        return json(paginate(all, url.searchParams.get('page'), 20))
      }

      if (seg[1] === 'entreprises' && seg[2] && method === 'PUT') {
        const b = await readBody(request)
        if (!['nouvelle', 'en_cours', 'active', 'cloturee'].includes(b.statut)) {
          return json({ message: 'Statut invalide.', errors: { statut: 'Le statut sélectionné est invalide.' } }, 422)
        }
        await sql`UPDATE entreprises SET statut = ${b.statut}, updated_at = NOW() WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: "Statut de l'entreprise mis à jour." })
      }

      if (seg[1] === 'entreprises' && seg[2] && method === 'DELETE') {
        await sql`DELETE FROM entreprises WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Entreprise supprimée.' })
      }

      /* --- Settings --- */
      if (path === '/admin/settings' && method === 'GET') {
        const rows = await sql`SELECT cle, valeur FROM settings`
        const out = {}
        for (const r of rows) out[r.cle] = r.valeur
        return json(out)
      }

      if (path === '/admin/settings' && method === 'PUT') {
        const b = await readBody(request)
        const allowed = [
          'hero_titre', 'hero_soustitre', 'hero_image',
          'telephone_1', 'telephone_2', 'whatsapp_numero', 'email_contact',
          'adresse_ligne1', 'adresse_ligne2', 'adresse_pays',
          'horaires_semaine', 'horaires_samedi', 'horaires_dimanche',
          'pilier1_titre', 'pilier1_texte', 'pilier1_image',
          'pilier2_titre', 'pilier2_texte', 'pilier2_image',
          'pilier3_titre', 'pilier3_texte', 'pilier3_image',
          'st_titre', 'st_texte',
          'st_cat1_titre', 'st_cat1_soustitre', 'st_cat1_image',
          'st_cat2_titre', 'st_cat2_soustitre', 'st_cat2_image',
          'st_cat3_titre', 'st_cat3_soustitre', 'st_cat3_image',
          'st_cat4_titre', 'st_cat4_soustitre', 'st_cat4_image',
          'footer_description',
        ]
        for (const key of allowed) {
          if (b[key] !== undefined && b[key] !== null) {
            await sql`
              INSERT INTO settings (cle, valeur) VALUES (${key}, ${String(b[key])})
              ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur, updated_at = NOW()`
          }
        }
        return json({ success: true, message: 'Paramètres mis à jour avec succès.' })
      }

      /* --- Medecins CRUD --- */
      if (path === '/admin/medecins' && method === 'GET') {
        const all = await sql`SELECT * FROM medecins ORDER BY created_at DESC`
        return json(paginate(all, url.searchParams.get('page'), 20))
      }

      if (path === '/admin/medecins' && method === 'POST') {
        const b = await readBody(request)
        const errors = {}
        if (!b.nom) errors.nom = 'Le champ nom est obligatoire.'
        if (!b.prenom) errors.prenom = 'Le champ prénom est obligatoire.'
        if (!b.specialite) errors.specialite = 'Le champ spécialité est obligatoire.'
        if (b.photo && String(b.photo).length > 5500000) errors.photo = 'La photo ne doit pas dépasser 4 Mo.'
        if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
        const slug = slugify(`${b.prenom}-${b.nom}`)
        let slugFinal = slug, i = 1
        while ((await sql`SELECT id FROM medecins WHERE slug = ${slugFinal}`)[0]) slugFinal = `${slug}-${++i}`
        await sql`
          INSERT INTO medecins (nom, prenom, slug, specialite, biographie, photo, telephone, email, service_id, actif)
          VALUES (${b.nom}, ${b.prenom}, ${slugFinal}, ${b.specialite}, ${b.biographie || null}, ${b.photo || null},
                  ${b.telephone || null}, ${b.email || null}, ${b.service_id || null}, ${b.actif === false ? false : true})`
        return json({ success: true, message: 'Médecin ajouté avec succès.' }, 201)
      }

      if (seg[1] === 'medecins' && seg[2] && method === 'GET') {
        const rows = await sql`SELECT * FROM medecins WHERE id = ${Number(seg[2])}`
        if (!rows[0]) return json({ message: 'Médecin non trouvé.' }, 404)
        return json(rows[0])
      }

      if (seg[1] === 'medecins' && seg[2] && method === 'PUT') {
        const b = await readBody(request)
        const errors = {}
        if (!b.nom) errors.nom = 'Le champ nom est obligatoire.'
        if (!b.prenom) errors.prenom = 'Le champ prénom est obligatoire.'
        if (!b.specialite) errors.specialite = 'Le champ spécialité est obligatoire.'
        if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
        await sql`
          UPDATE medecins SET nom = ${b.nom}, prenom = ${b.prenom}, specialite = ${b.specialite},
            biographie = ${b.biographie || null},
            photo = COALESCE(${b.photo || null}, photo),
            telephone = ${b.telephone || null}, email = ${b.email || null},
            service_id = ${b.service_id || null},
            actif = ${b.actif === false ? false : true}, updated_at = NOW()
          WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Médecin mis à jour.' })
      }

      if (seg[1] === 'medecins' && seg[2] && method === 'DELETE') {
        await sql`DELETE FROM medecins WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Médecin supprimé.' })
      }

      /* --- Formations CRUD --- */
      if (path === '/admin/formations' && method === 'GET') {
        const formations = await sql`SELECT * FROM formations ORDER BY created_at DESC`
        const sessions = await sql`SELECT * FROM sessions_formation ORDER BY date_debut ASC`
        const byF = {}
        for (const s of sessions) (byF[s.formation_id] ||= []).push(mapSession(s))
        const data = paginate(formations, url.searchParams.get('page'), 20)
        data.data = data.data.map((f) => ({
          ...f,
          tarif_adulte: Number(f.tarif_adulte),
          tarif_enfant: f.tarif_enfant != null ? Number(f.tarif_enfant) : null,
          sessions: byF[f.id] || [],
        }))
        return json(data)
      }

      if (path === '/admin/formations' && method === 'POST') {
        const b = await readBody(request)
        const errors = {}
        if (!b.titre) errors.titre = 'Le champ titre est obligatoire.'
        if (!b.description) errors.description = 'Le champ description est obligatoire.'
        if (!b.duree) errors.duree = 'Le champ durée est obligatoire.'
        if (b.tarif_adulte == null || isNaN(Number(b.tarif_adulte)) || Number(b.tarif_adulte) < 0) errors.tarif_adulte = 'Le tarif adulte doit être un nombre positif.'
        if (b.tarif_enfant != null && b.tarif_enfant !== '' && (isNaN(Number(b.tarif_enfant)) || Number(b.tarif_enfant) < 0)) errors.tarif_enfant = 'Le tarif enfant doit être un nombre positif.'
        if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)

        const slug = slugify(b.titre)
        let slugFinal = slug, i = 1
        while ((await sql`SELECT id FROM formations WHERE slug = ${slugFinal}`)[0]) slugFinal = `${slug}-${++i}`

        const inserted = await sql`
          INSERT INTO formations (titre, slug, description, programme, duree, tarif_adulte, tarif_enfant, public_cible, certification, icone, image, active)
          VALUES (${b.titre}, ${slugFinal}, ${b.description}, ${b.programme || null}, ${b.duree},
                  ${Number(b.tarif_adulte)}, ${b.tarif_enfant != null && b.tarif_enfant !== '' ? Number(b.tarif_enfant) : null},
                  ${b.public_cible || null}, ${b.certification || null}, ${b.icone || null}, ${b.image || null},
                  ${b.active === false ? false : true})
          RETURNING id`
        const formationId = inserted[0].id

        if (b.session_date_debut && b.session_date_fin) {
          await sql`
            INSERT INTO sessions_formation (formation_id, date_debut, date_fin, heure_debut, heure_fin, lieu, places_max)
            VALUES (${formationId}, ${b.session_date_debut}, ${b.session_date_fin},
                    ${(b.session_heure_debut || '08:00') + ':00'}, ${(b.session_heure_fin || '17:00') + ':00'},
                    ${b.session_lieu || 'Ouaga 2000, Extension Sud'}, ${b.session_places_max ? Number(b.session_places_max) : 30})`
        }
        return json({ success: true, message: 'Formation créée avec succès.' }, 201)
      }

      if (seg[1] === 'formations' && seg[2] && method === 'GET') {
        const rows = await sql`SELECT * FROM formations WHERE id = ${Number(seg[2])}`
        if (!rows[0]) return json({ message: 'Formation non trouvée.' }, 404)
        const sessions = await sql`SELECT * FROM sessions_formation WHERE formation_id = ${Number(seg[2])} ORDER BY date_debut ASC`
        return json({ ...rows[0], tarif_adulte: Number(rows[0].tarif_adulte), tarif_enfant: rows[0].tarif_enfant != null ? Number(rows[0].tarif_enfant) : null, sessions: sessions.map(mapSession) })
      }

      if (seg[1] === 'formations' && seg[2] && method === 'PUT') {
        const b = await readBody(request)
        const errors = {}
        if (!b.titre) errors.titre = 'Le champ titre est obligatoire.'
        if (!b.description) errors.description = 'Le champ description est obligatoire.'
        if (!b.duree) errors.duree = 'Le champ durée est obligatoire.'
        if (b.tarif_adulte == null || isNaN(Number(b.tarif_adulte)) || Number(b.tarif_adulte) < 0) errors.tarif_adulte = 'Le tarif adulte doit être un nombre positif.'
        if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
        await sql`
          UPDATE formations SET titre = ${b.titre}, description = ${b.description}, programme = ${b.programme || null},
            duree = ${b.duree}, tarif_adulte = ${Number(b.tarif_adulte)},
            tarif_enfant = ${b.tarif_enfant != null && b.tarif_enfant !== '' ? Number(b.tarif_enfant) : null},
            public_cible = ${b.public_cible || null}, certification = ${b.certification || null},
            icone = ${b.icone || null}, image = COALESCE(${b.image || null}, image),
            active = ${b.active === false ? false : true}, updated_at = NOW()
          WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Formation mise à jour.' })
      }

      if (seg[1] === 'formations' && seg[2] && method === 'DELETE') {
        await sql`DELETE FROM formations WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Formation supprimée.' })
      }

      /* --- Campagnes CRUD --- */
      if (path === '/admin/campagnes' && method === 'GET') {
        const all = await sql`SELECT * FROM campagnes ORDER BY created_at DESC`
        const data = paginate(all, url.searchParams.get('page'), 20)
        data.data = data.data.map(mapCampagne)
        return json(data)
      }

      if (path === '/admin/campagnes' && method === 'POST') {
        const b = await readBody(request)
        const errors = {}
        if (!b.titre) errors.titre = 'Le champ titre est obligatoire.'
        if (!b.description) errors.description = 'Le champ description est obligatoire.'
        if (!b.date_debut) errors.date_debut = 'Le champ date début est obligatoire.'
        if (!b.date_fin) errors.date_fin = 'Le champ date fin est obligatoire.'
        if (b.date_debut && b.date_fin && b.date_fin < b.date_debut) errors.date_fin = 'La date fin doit être postérieure ou égale à la date début.'
        if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)

        const slug = slugify(b.titre)
        let slugFinal = slug, i = 1
        while ((await sql`SELECT id FROM campagnes WHERE slug = ${slugFinal}`)[0]) slugFinal = `${slug}-${++i}`

        await sql`
          INSERT INTO campagnes (titre, slug, description, details, type, date_debut, date_fin, heure_debut, heure_fin, offres, tarifs, image, active)
          VALUES (${b.titre}, ${slugFinal}, ${b.description}, ${b.details || null}, ${b.type || null},
                  ${b.date_debut}, ${b.date_fin},
                  ${(b.heure_debut || '09:00') + ':00'}, ${(b.heure_fin || '17:00') + ':00'},
                  ${b.offres ? JSON.stringify(b.offres) : null}, ${b.tarifs ? JSON.stringify(b.tarifs) : null},
                  ${b.image || null}, ${b.active === false ? false : true})`
        return json({ success: true, message: 'Campagne créée avec succès.' }, 201)
      }

      if (seg[1] === 'campagnes' && seg[2] && method === 'GET') {
        const rows = await sql`SELECT * FROM campagnes WHERE id = ${Number(seg[2])}`
        if (!rows[0]) return json({ message: 'Campagne non trouvée.' }, 404)
        return json(mapCampagne(rows[0]))
      }

      if (seg[1] === 'campagnes' && seg[2] && method === 'PUT') {
        const b = await readBody(request)
        const errors = {}
        if (!b.titre) errors.titre = 'Le champ titre est obligatoire.'
        if (!b.description) errors.description = 'Le champ description est obligatoire.'
        if (!b.date_debut) errors.date_debut = 'Le champ date début est obligatoire.'
        if (!b.date_fin) errors.date_fin = 'Le champ date fin est obligatoire.'
        if (b.date_debut && b.date_fin && b.date_fin < b.date_debut) errors.date_fin = 'La date fin doit être postérieure ou égale à la date début.'
        if (Object.keys(errors).length) return json({ message: 'Données invalides.', errors }, 422)
        await sql`
          UPDATE campagnes SET titre = ${b.titre}, description = ${b.description}, details = ${b.details || null},
            type = ${b.type || null}, date_debut = ${b.date_debut}, date_fin = ${b.date_fin},
            heure_debut = ${(b.heure_debut || '09:00') + ':00'}, heure_fin = ${(b.heure_fin || '17:00') + ':00'},
            offres = ${b.offres ? JSON.stringify(b.offres) : null}, tarifs = ${b.tarifs ? JSON.stringify(b.tarifs) : null},
            image = COALESCE(${b.image || null}, image),
            active = ${b.active === false ? false : true}, updated_at = NOW()
          WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Campagne mise à jour.' })
      }

      if (seg[1] === 'campagnes' && seg[2] && method === 'DELETE') {
        await sql`DELETE FROM campagnes WHERE id = ${Number(seg[2])}`
        return json({ success: true, message: 'Campagne supprimée.' })
      }

      return json({ message: 'Route admin non trouvée.' }, 404)
    }

    return json({ message: 'Route non trouvée.' }, 404)
  } catch (err) {
    console.error('API Error:', err)
    return json({ message: 'Erreur serveur.', error: String(err.message || err) }, 500)
  }
}

export const config = { path: ['/api/*', '/.netlify/functions/api/*'] }
