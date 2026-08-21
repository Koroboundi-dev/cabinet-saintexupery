import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'node:fs'

function loadEnv() {
  try {
    const content = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}

loadEnv()

const DEFAULTS = {
  hero_titre: 'Cabinet Médical<br>Saint-Exupéry<br>International',
  hero_soustitre: 'Médecine Générale & Spécialités, Urgences, Assistance Médicale, Transports Aériens, Médecine Aérospatiale, Santé au Travail, Formations.',
  hero_image: 'images/medical1.png',
  telephone_1: '+226 45 10 36 36',
  telephone_2: '+226 50 25 10 10',
  whatsapp_numero: '22645233636',
  email_contact: 'medical@cabinet-saintexupery.com',
  adresse_ligne1: 'Quartier Ouaga 2000',
  adresse_ligne2: 'Extension Sud',
  adresse_pays: 'Burkina Faso',
  horaires_semaine: 'Lun - Ven : 7h30 - 19h00',
  horaires_samedi: 'Sam : 7h30 - 13h00',
  horaires_dimanche: 'Dim : Fermé',
  pilier1_titre: 'Soigner',
  pilier1_texte: 'Des soins médicaux de qualité par une équipe de professionnels qualifiés, avec des spécialités couvrant tous les besoins de santé.',
  pilier1_image: 'images/img1.png',
  pilier2_titre: 'Prévenir',
  pilier2_texte: 'Campagnes de dépistage, vaccination et prévention pour anticiper les maladies et protéger votre santé au quotidien.',
  pilier2_image: 'images/img2.jpg',
  pilier3_titre: 'Former',
  pilier3_texte: 'Formations certifiantes aux gestes de premiers secours et à la santé au travail pour les particuliers et les professionnels.',
  pilier3_image: 'images/img3.png',
  st_titre: 'Santé au Travail',
  st_texte: 'Nous accompagnons les entreprises, ONG, administrations et organisations internationales dans la préservation de la santé de leurs collaborateurs.',
  st_cat1_titre: 'Entreprises',
  st_cat1_soustitre: 'Partenaires',
  st_cat1_image: 'images/img4.png',
  st_cat2_titre: 'ONG & International',
  st_cat2_soustitre: 'Collaborations',
  st_cat2_image: 'images/img5.jpg',
  st_cat3_titre: 'Écoles',
  st_cat3_soustitre: 'Formations',
  st_cat3_image: 'images/img6.jpeg',
  st_cat4_titre: 'Administrations',
  st_cat4_soustitre: 'Suivi médical',
  st_cat4_image: 'images/img7.jpg',
  footer_description: 'Cabinet Médical International offrant des soins de qualité avec des services de médecine générale, spécialités, urgences et assistance médicale.',
}

const SERVICES = [
  ['Médecine Générale', 'medecine-generale', 'Consultations complètes pour toute la famille : diagnostic, traitement et suivi des pathologies courantes, certificats médicaux et conseils de prévention.', '🩺', '#2563EB', 1],
  ['Cardiologie', 'cardiologie', 'Exploration et suivi des maladies du cœur et des vaisseaux : électrocardiogramme, échographie cardiaque, bilan tensionnel et prévention des risques cardiovasculaires.', '❤️', '#DC2626', 2],
  ['Pédiatrie', 'pediatrie', 'Suivi médical des nouveau-nés, enfants et adolescents : croissance, vaccination, prise en charge des infections et conseils aux parents.', '👶', '#F59E0B', 3],
  ['Gynécologie-Obstétrique', 'gynecologie-obstetrique', 'Suivi de grossesse, consultations gynécologiques, échographies obstétricales, planification familiale et dépistage des cancers féminins.', '🌸', '#DB2777', 4],
  ['Urgences Médicales', 'urgences-medicales', 'Prise en charge immédiate des urgences médicales et traumatologiques, avec plateau technique adapté et équipe disponible.', '🚑', '#EA580C', 5],
  ['Assistance Médicale & Transport Aérien', 'assistance-medicale', 'Organisation et supervision des évacuations sanitaires nationales et internationales, transport médical aérien et médecine aérospatiale.', '✈️', '#0D9488', 6],
  ['Imagerie & Laboratoire', 'imagerie-laboratoire', 'Échographie, radiologie et analyses de laboratoire (bilans sanguins complets, sérologies) pour un diagnostic rapide et fiable.', '🔬', '#7C3AED', 7],
  ['Santé au Travail', 'sante-au-travail', 'Visites médicales d’embauche et périodiques, prévention des risques professionnels et bilans de santé collectifs pour entreprises et organisations.', '🏭', '#475569', 8],
]

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('❌ DATABASE_URL manquant. Créez un fichier .env avec DATABASE_URL=postgresql://...')
    process.exit(1)
  }
  const sql = neon(url)

  console.log('→ Création du schéma…')
  const { ensureSchema } = await import('../netlify/functions/db.mjs')
  await ensureSchema()

  console.log('→ Utilisateur admin…')
  const email = process.env.ADMIN_EMAIL || 'admin@cabinet-saintexupery.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin2026!'
  const hash = await bcrypt.hash(password, 10)
  await sql`
    INSERT INTO users (name, email, telephone, role, actif, password)
    VALUES ('Administrateur', ${email}, '+226 45 10 36 36', 'admin', TRUE, ${hash})
    ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin', actif = TRUE`
  console.log(`   admin : ${email} / ${password}`)

  console.log('→ Paramètres du site…')
  for (const [cle, valeur] of Object.entries(DEFAULTS)) {
    await sql`
      INSERT INTO settings (cle, valeur) VALUES (${cle}, ${valeur})
      ON CONFLICT (cle) DO NOTHING`
  }

  console.log('→ Services…')
  for (const [nom, slug, description, icone, couleur, ordre] of SERVICES) {
    await sql`
      INSERT INTO services (nom, slug, description, icone, couleur, ordre)
      VALUES (${nom}, ${slug}, ${description}, ${icone}, ${couleur}, ${ordre})
      ON CONFLICT (slug) DO NOTHING`
  }

  console.log('✅ Seed terminé avec succès.')
}

main().catch((err) => {
  console.error('❌ Erreur seed :', err.message)
  process.exit(1)
})
