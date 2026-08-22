import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import { useSettings } from '../context/SettingsContext.jsx'

export default function RendezVous() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [medecins, setMedecins] = useState([])
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '', date_souhaitee: '', heure_souhaitee: '', medecin_id: '', motif: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Prendre Rendez-vous | Cabinet Saint-Exupéry International'
    api.get('/rendez-vous/medecins').then(setMedecins).catch(() => setMedecins([]))
  }, [])

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      await api.post('/rendez-vous', form)
      navigate('/rendez-vous-confirmation')
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message || 'Une erreur est survenue.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-200 text-lg font-semibold uppercase tracking-wider">Rendez-vous</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Prendre un Rendez-vous</h1>
          <p className="text-blue-100 text-lg">Remplissez le formulaire ci-dessous et nous vous confirmerons votre rendez-vous.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-base">{message}</div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Nom *</label>
                <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.nom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="Votre nom" />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom[0]}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Prénom(s) *</label>
                <input type="text" value={form.prenom} onChange={(e) => setField('prenom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.prenom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="Votre prénom" />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom[0]}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Téléphone *</label>
                <input type="tel" value={form.telephone} onChange={(e) => setField('telephone', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.telephone ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="+226 XX XX XX XX" />
                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone[0]}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="email@exemple.com" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Date souhaitée *</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date_souhaitee} onChange={(e) => setField('date_souhaitee', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.date_souhaitee ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} />
                {errors.date_souhaitee && <p className="text-red-500 text-sm mt-1">{errors.date_souhaitee[0]}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Heure souhaitée *</label>
                <input type="time" value={form.heure_souhaitee} onChange={(e) => setField('heure_souhaitee', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.heure_souhaitee ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} />
                {errors.heure_souhaitee && <p className="text-red-500 text-sm mt-1">{errors.heure_souhaitee[0]}</p>}
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1.5">Médecin souhaité</label>
              <select value={form.medecin_id} onChange={(e) => setField('medecin_id', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white">
                <option value="">Aucune préférence</option>
                {medecins.map((m) => (
                  <option key={m.id} value={m.id}>Dr. {m.prenom} {m.nom}{m.specialite ? ` — ${m.specialite}` : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1.5">Motif de consultation *</label>
              <textarea rows="4" value={form.motif} onChange={(e) => setField('motif', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.motif ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none`} placeholder="Décrivez brièvement le motif de votre consultation…"></textarea>
              {errors.motif && <p className="text-red-500 text-sm mt-1">{errors.motif[0]}</p>}
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {submitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>

            <p className="text-center text-base text-gray-400">
              Vous pouvez aussi appeler le {settings.telephone_1}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
