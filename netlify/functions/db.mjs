import { neon } from '@neondatabase/serverless'

let sqlInstance = null
let schemaReady = null

export function getSql() {
  if (!sqlInstance) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL manquant')
    sqlInstance = neon(url)
  }
  return sqlInstance
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(255),
  role VARCHAR(255) NOT NULL DEFAULT 'patient',
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified_at TIMESTAMP,
  password VARCHAR(255) NOT NULL,
  remember_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icone VARCHAR(255),
  couleur VARCHAR(255) NOT NULL DEFAULT '#0D9488',
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medecins (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  specialite VARCHAR(255) NOT NULL,
  biographie TEXT,
  photo TEXT,
  telephone VARCHAR(255),
  email VARCHAR(255),
  service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rendez_vous (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(255),
  email VARCHAR(255),
  type_consultation VARCHAR(255),
  medecin_id BIGINT REFERENCES medecins(id) ON DELETE SET NULL,
  service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
  date_souhaitee DATE NOT NULL,
  heure_souhaitee TIME NOT NULL,
  motif TEXT,
  commentaire TEXT,
  statut VARCHAR(255) NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS formations (
  id BIGSERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  programme TEXT,
  duree VARCHAR(255) NOT NULL,
  tarif_adulte DECIMAL(10,2) NOT NULL,
  tarif_enfant DECIMAL(10,2),
  public_cible VARCHAR(255),
  certification VARCHAR(255),
  icone VARCHAR(255),
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions_formation (
  id BIGSERIAL PRIMARY KEY,
  formation_id BIGINT NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  heure_debut TIME NOT NULL DEFAULT '08:00',
  heure_fin TIME NOT NULL DEFAULT '17:00',
  lieu VARCHAR(255) NOT NULL DEFAULT 'Ouaga 2000, Extension Sud',
  places_max INTEGER NOT NULL DEFAULT 30,
  places_prises INTEGER NOT NULL DEFAULT 0,
  statut VARCHAR(255) NOT NULL DEFAULT 'planifiee',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inscriptions (
  id BIGSERIAL PRIMARY KEY,
  session_formation_id BIGINT NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  whatsapp VARCHAR(255),
  organisation VARCHAR(255),
  categorie VARCHAR(255) NOT NULL DEFAULT 'adulte',
  montant_paye DECIMAL(10,2) NOT NULL DEFAULT 0,
  statut_paiement VARCHAR(255) NOT NULL DEFAULT 'en_attente',
  statut_inscription VARCHAR(255) NOT NULL DEFAULT 'en_attente',
  certificat_delivre BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campagnes (
  id BIGSERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  details TEXT,
  type VARCHAR(255),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  heure_debut TIME NOT NULL DEFAULT '09:00',
  heure_fin TIME NOT NULL DEFAULT '17:00',
  offres JSONB,
  tarifs JSONB,
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campagne_inscriptions (
  id BIGSERIAL PRIMARY KEY,
  campagne_id BIGINT NOT NULL REFERENCES campagnes(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  whatsapp VARCHAR(255),
  statut VARCHAR(255) NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actualites (
  id BIGSERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  resume TEXT,
  contenu TEXT NOT NULL,
  image TEXT,
  categorie VARCHAR(255) NOT NULL DEFAULT 'actualite',
  a_la_une BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(255),
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  statut VARCHAR(255) NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entreprises (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  contact_nom VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_telephone VARCHAR(255) NOT NULL,
  secteur VARCHAR(255),
  nombre_employes INTEGER,
  besoins TEXT,
  statut VARCHAR(255) NOT NULL DEFAULT 'nouvelle',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  cle VARCHAR(255) NOT NULL UNIQUE,
  valeur TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getSql()(SCHEMA).catch((e) => {
      schemaReady = null
      throw e
    })
  }
  return schemaReady
}
