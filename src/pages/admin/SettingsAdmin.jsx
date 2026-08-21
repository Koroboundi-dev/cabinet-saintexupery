import { useEffect, useState } from 'react'
import { api, fileToDataUrl } from '../../api/client.js'
import { useSettings } from '../../context/SettingsContext.jsx'

export default function SettingsAdmin() {
  const { settings, refresh } = useSettings()
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = 'Paramètres du Site | Administration'
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

  const champTexte = (key, label, type = 'text') => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input type={type} value={form[key] ?? ''} onChange={(e) => setField(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm" />
    </div>
  )

  const champTextarea = (key, label, rows = 2) => (
    <div className="sm:col-span-2">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <textarea rows={rows} value={form[key] ?? ''} onChange={(e) => setField(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm resize-none" />
    </div>
  )

  const champImage = (key, label) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {form[key] && (
          <img src={form[key].startsWith('data:') || form[key].startsWith('/') ? form[key] : `/${form[key]}`} alt="" className="w-16 h-16 rounded-lg object-cover border" />
        )}
        <input type="file" accept="image/*" onChange={(e) => pickImage(key, e.target.files[0])} className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold hover:file:bg-blue-100" />
      </div>
    </div>
  )

  const blocPilier = (n) => (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <h3 className="font-bold text-gray-800 mb-3">Pilier {n}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {champTexte(`pilier${n}_titre`, 'Titre')}
        {champImage(`pilier${n}_image`, 'Image')}
        {champTextarea(`pilier${n}_texte`, 'Description')}
      </div>
    </div>
  )

  const blocCategorie = (n) => (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <h3 className="font-bold text-gray-800 mb-3">Catégorie {n}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {champTexte(`st_cat${n}_titre`, 'Titre')}
        {champImage(`st_cat${n}_image`, 'Image')}
        {champTexte(`st_cat${n}_soustitre`, 'Sous-titre')}
      </div>
    </div>
  )

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
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Paramètres du Site</h1>

      {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm">{message}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-6">
        {/* Section 1 — Section Hero (Accueil) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Section Hero (Accueil)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {champTextarea('hero_titre', 'Titre Hero', 3)}
            {champTextarea('hero_soustitre', 'Sous-titre Hero', 3)}
            {champImage('hero_image', 'Image Hero')}
          </div>
        </div>

        {/* Section 2 — Contact & Informations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Contact & Informations</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {champTexte('telephone_1', 'Téléphone 1')}
            {champTexte('telephone_2', 'Téléphone 2')}
            {champTexte('whatsapp_numero', 'Numéro WhatsApp')}
            {champTexte('email_contact', 'Email', 'email')}
          </div>
        </div>

        {/* Section 3 — Adresse & Horaires */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Adresse & Horaires</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {champTexte('adresse_ligne1', 'Adresse Ligne 1')}
            {champTexte('adresse_ligne2', 'Adresse Ligne 2')}
            {champTexte('adresse_pays', 'Pays')}
            {champTexte('horaires_semaine', 'Horaires Semaine')}
            {champTexte('horaires_samedi', 'Horaires Samedi')}
            {champTexte('horaires_dimanche', 'Horaires Dimanche')}
          </div>
        </div>

        {/* Section 4 — Notre Mission (3 Piliers) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Notre Mission (3 Piliers)</h2>
          {[1, 2, 3].map((n) => (
            <div key={n}>{blocPilier(n)}</div>
          ))}
        </div>

        {/* Section 5 — Santé au Travail */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Santé au Travail</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {champTexte('st_titre', 'Titre Section')}
            {champTextarea('st_texte', 'Description')}
          </div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>{blocCategorie(n)}</div>
          ))}
        </div>

        {/* Section 6 — Footer */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Footer</h2>
          <div className="grid gap-4">
            {champTextarea('footer_description', 'Description Footer', 3)}
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}
