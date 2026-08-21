import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatFcfa, formatDayMonth, formatDateSlash } from '../utils/format.js'

export default function FormationInscription() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [formation, setFormation] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '', categorie: 'adulte' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Inscription à la formation | Cabinet Saint-Exupéry International'
    api.get('/formations')
      .then((formations) => {
        for (const f of formations) {
          const s = f.sessions?.find((x) => String(x.id) === String(sessionId))
          if (s) {
            setFormation(f)
            setSession(s)
            return
          }
        }
        navigate('/formations')
      })
      .catch(() => navigate('/formations'))
  }, [sessionId, navigate])

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      await api.post(`/formation-sessions/${sessionId}/inscription`, form)
      navigate('/formation-inscription-confirmation')
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message || 'Une erreur est survenue.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  const tarif = form.categorie === 'moins_15_ans' ? formation.tarif_enfant : formation.tarif_adulte

  return (
    <>
      <section className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/formations/${formation.slug}`} className="inline-flex items-center gap-1 text-red-100 text-base mb-4 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour à la formation
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Inscription</h1>
          <p className="text-red-100 text-lg mt-2">{formation.titre}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-bold text-red-800 mb-2">Session sélectionnée</h2>
            <p className="text-base text-red-700">{formatDayMonth(session.date_debut)} &rarr; {formatDateSlash(session.date_fin)} &bull; {session.heure_debut} - {session.heure_fin} &bull; {session.lieu}</p>
          </div>

          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-base">{message}</div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Nom *</label>
                <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.nom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition`} placeholder="Votre nom" />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom[0]}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Prénom(s) *</label>
                <input type="text" value={form.prenom} onChange={(e) => setField('prenom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.prenom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition`} placeholder="Votre prénom" />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom[0]}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Téléphone *</label>
                <input type="tel" value={form.telephone} onChange={(e) => setField('telephone', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.telephone ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition`} placeholder="+226 XX XX XX XX" />
                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone[0]}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition`} placeholder="email@exemple.com" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1.5">Catégorie *</label>
              <div className="grid grid-cols-2 gap-3">
                {[['adulte', `Adulte — ${formatFcfa(formation.tarif_adulte)} FCFA`], ['moins_15_ans', `Moins de 15 ans — ${formatFcfa(formation.tarif_enfant)} FCFA`]].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setField('categorie', value)} className={`px-4 py-3 rounded-xl border text-base font-semibold transition ${form.categorie === value ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-red-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {errors.categorie && <p className="text-red-500 text-sm mt-1">{errors.categorie[0]}</p>}
            </div>

            <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
              <span className="text-base text-gray-600">Montant à payer</span>
              <span className="text-2xl font-extrabold text-red-600">{formatFcfa(tarif)} FCFA</span>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-red-500 text-white py-4 rounded-xl text-lg font-bold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {submitting ? 'Envoi en cours…' : "Valider mon inscription"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
