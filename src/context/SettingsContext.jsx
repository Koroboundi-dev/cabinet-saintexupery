import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'

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

const SettingsContext = createContext(DEFAULTS)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)

  useEffect(() => {
    let mounted = true
    api
      .get('/settings')
      .then((data) => {
        if (mounted && data && Object.keys(data).length) {
          setSettings({ ...DEFAULTS, ...data })
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const refresh = () =>
    api.get('/settings').then((data) => setSettings({ ...DEFAULTS, ...data }))

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
