import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { imageSrc } from '../utils/format.js'

export default function SanteTravail() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ nom: '', contact_nom: '', contact_telephone: '', contact_email: '', secteur: '', nombre_employes: '', besoins: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Santé au Travail | Cabinet Saint-Exupéry International'
  }, [])

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setSubmitting(true)
    try {
      await api.post('/contact/entreprise', form)
      setSuccess('Votre demande a été enregistrée. Notre équipe vous contactera prochainement.')
      setForm({ nom: '', contact_nom: '', contact_telephone: '', contact_email: '', secteur: '', nombre_employes: '', besoins: '' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      if (err.errors) setErrors(err.errors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-300 text-lg font-semibold uppercase tracking-wider">Entreprises & Organisations</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">{settings.st_titre}</h1>
          <p className="text-gray-300 text-xl max-w-2xl leading-relaxed">{settings.st_texte}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img src={imageSrc(settings[`st_cat${i}_image`])} alt={settings[`st_cat${i}_titre`]} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{settings[`st_cat${i}_titre`]}</h3>
                <p className="text-base text-gray-500 mt-1">{settings[`st_cat${i}_soustitre`]}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Nos prestations pour les entreprises</h2>
              <div className="space-y-4">
                {[
                  ['Visites médicales périodiques', 'Embauche, périodiques et de reprise du travail conformément à la réglementation en vigueur.'],
                  ['Prévention des risques professionnels', 'Évaluation des risques, conseils en hygiène et sécurité sur votre lieu de travail.'],
                  ["Formations aux premiers secours", 'Formation certifiante de vos équipes aux gestes qui sauvent (SST).'],
                  ['Bilans de santé collectifs', 'Campagnes de dépistage et bilans de santé pour l\'ensemble de votre personnel.'],
                  ['Vaccinations professionnelles', 'Programmes de vaccination adaptés à votre secteur d\'activité.'],
                  ['Transport médical', 'Organisation et prise en charge des évacuations sanitaires de vos employés.'],
                ].map(([titre, texte]) => (
                  <div key={titre} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{titre}</h3>
                      <p className="text-base text-gray-600 leading-relaxed mt-1">{texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="offre" className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Demander une offre</h2>
              <p className="text-base text-gray-600 mb-6">Décrivez votre besoin, nous vous répondrons sous 48h.</p>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-base">{success}</div>
              )}

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-1.5">Nom de l'entreprise *</label>
                  <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.nom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="Ex : Société ABC SARL" />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom[0]}</p>}
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-1.5">Personne de contact *</label>
                  <input type="text" value={form.contact_nom} onChange={(e) => setField('contact_nom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.contact_nom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="Votre nom et prénom" />
                  {errors.contact_nom && <p className="text-red-500 text-sm mt-1">{errors.contact_nom[0]}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Téléphone *</label>
                    <input type="tel" value={form.contact_telephone} onChange={(e) => setField('contact_telephone', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.contact_telephone ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="+226 XX XX XX XX" />
                    {errors.contact_telephone && <p className="text-red-500 text-sm mt-1">{errors.contact_telephone[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={form.contact_email} onChange={(e) => setField('contact_email', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.contact_email ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="email@entreprise.com" />
                    {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email[0]}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Secteur d'activité</label>
                    <input type="text" value={form.secteur} onChange={(e) => setField('secteur', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Ex : BTP, Mines, ONG…" />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Nombre d'employés</label>
                    <input type="number" min="1" value={form.nombre_employes} onChange={(e) => setField('nombre_employes', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Ex : 50" />
                  </div>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-1.5">Votre besoin *</label>
                  <textarea rows="4" value={form.besoins} onChange={(e) => setField('besoins', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.besoins ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none`} placeholder="Décrivez votre besoin…"></textarea>
                  {errors.besoins && <p className="text-red-500 text-sm mt-1">{errors.besoins[0]}</p>}
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
                  {submitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
