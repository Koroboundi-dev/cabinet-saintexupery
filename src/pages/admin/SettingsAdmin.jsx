import { useEffect, useState } from 'react'
import { api, fileToDataUrl } from '../../api/client.js'
import { useSettings } from '../../context/SettingsContext.jsx'

const SECTIONS = [
  {
    titre: 'Section Héros (accueil)',
    fields: [
      ['hero_titre', 'Titre principal', 'textarea'],
      ['hero_soustitre', 'Sous-titre', 'textarea'],
    ],
    images: [['hero_image', 'Image de fond du héros']],
  },
  {
    titre: 'Coordonnées',
    fields: [
      ['telephone_1', 'Téléphone principal'],
      ['telephone_2', 'Téléphone secondaire'],
      ['whatsapp_numero', 'Numéro WhatsApp (sans + ni espaces)'],
      ['email_contact', 'Email de contact'],
    ],
    images: [],
  },
  {
    titre: 'Adresse & Horaires',
    fields: [
      ['adresse_ligne1', 'Adresse — ligne 1'],
      ['adresse_ligne2', 'Adresse — ligne 2'],
      ['adresse_pays', 'Pays'],
      ['horaires_semaine', 'Horaires semaine'],
      ['horaires_samedi', 'Horaires samedi'],
      ['horaires_dimanche', 'Horaires dimanche'],
    ],
    images: [],
  },
  {
    titre: 'Les trois piliers',
    fields: [
      ['pilier1_titre', 'Pilier 1 — Titre'],
      ['pilier1_texte', 'Pilier 1 — Texte', 'textarea'],
      ['pilier2_titre', 'Pilier 2 — Titre'],
      ['pilier2_texte', 'Pilier 2 — Texte', 'textarea'],
      ['pilier3_titre', 'Pilier 3 — Titre'],
      ['pilier3_texte', 'Pilier 3 — Texte', 'textarea'],
    ],
    images: [
      ['pilier1_image', 'Image pilier 1'],
      ['pilier2_image', 'Image pilier 2'],
      ['pilier3_image', 'Image pilier 3'],
    ],
  },
  {
    titre: 'Santé au travail',
    fields: [
      ['st_titre', 'Titre de la section'],
      ['st_texte', 'Texte descriptif', 'textarea'],
      ['st_cat1_titre', 'Catégorie 1 — Titre'],
      ['st_cat1_soustitre', 'Catégorie 1 — Sous-titre'],
      ['st_cat2_titre', 'Catégorie 2 — Titre'],
      ['st_cat2_soustitre', 'Catégorie 2 — Sous-titre'],
      ['st_cat3_titre', 'Catégorie 3 — Titre'],
      ['st_cat3_soustitre', 'Catégorie 3 — Sous-titre'],
      ['st_cat4_titre', 'Catégorie 4 — Titre'],
      ['st_cat4_soustitre', 'Catégorie 4 — Sous-titre'],
    ],
    images: [
      ['st_cat1_image', 'Image catégorie 1'],
      ['st_cat2_image', 'Image catégorie 2'],
      ['st_cat3_image', 'Image catégorie 3'],
      ['st_cat4_image', 'Image catégorie 4'],
    ],
  },
  {
    titre: 'Pied de page',
    fields: [['footer_description', 'Description']],
    images: [],
  },
]

export default function SettingsAdmin() {
  const { settings, refresh } = useSettings()
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = 'Paramètres | Administration'
  }, [])

  useEffect(() => {
    if (settings) setForm((f) => ({ ...settings, ...f }))
  }, [settings])

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const pickImage = async (key, file) => {
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      setField(key, dataUrl)
    } catch (err) {
      setError(err.message)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)
    try {
      await api.put('/admin/settings', form)
      setMessage('Paramètres mis à jour avec succès.')
      await refresh()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Paramètres du site</h1>

      {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm">{message}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.titre} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">{section.titre}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {section.fields.map(([key, label, type]) => (
                <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  {type === 'textarea' ? (
                    <textarea rows="2" value={form[key] ?? ''} onChange={(e) => setField(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm resize-none" />
                  ) : (
                    <input type="text" value={form[key] ?? ''} onChange={(e) => setField(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm" />
                  )}
                </div>
              ))}
            </div>
            {section.images.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                {section.images.map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                    <div className="flex items-center gap-3">
                      {form[key] && (
                        <img src={form[key].startsWith('data:') || form[key].startsWith('/') ? form[key] : `/${form[key]}`} alt="" className="w-14 h-14 rounded-lg object-cover border" />
                      )}
                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => pickImage(key, e.target.files[0])} className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold hover:file:bg-blue-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}
