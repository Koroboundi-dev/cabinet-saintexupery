import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDayMonth, formatDateSlash } from '../utils/format.js'

export default function CampagneInscription() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campagne, setCampagne] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Inscription à la campagne | Cabinet Saint-Exupéry International'
    api.get('/campagnes')
      .then((campagnes) => {
        const c = campagnes.find((x) => String(x.id) === String(id))
        if (c) setCampagne(c)
        else navigate('/campagnes')
      })
      .catch(() => navigate('/campagnes'))
  }, [id, navigate])

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      await api.post(`/campagnes/${id}/inscription`, form)
      navigate('/campagne-inscription-confirmation')
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message || 'Une erreur est survenue.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (!campagne) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/campagnes/${campagne.slug}`} className="inline-flex items-center gap-1 text-blue-200 text-base mb-4 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour à la campagne
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Inscription</h1>
          <p className="text-blue-100 text-lg mt-2">{campagne.titre}</p>
          <p className="text-blue-200 text-base mt-1">{formatDayMonth(campagne.date_debut)} → {formatDateSlash(campagne.date_fin)}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {submitting ? 'Envoi en cours…' : "Valider mon inscription"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
