import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { useSettings } from '../context/SettingsContext.jsx'

export default function Contact() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Contact | Cabinet Saint-Exupéry International'
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
      await api.post('/contact', form)
      setSuccess('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.')
      setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      if (err.errors) setErrors(err.errors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-red-200 text-lg font-semibold uppercase tracking-wider">Contact</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Nous Contacter</h1>
          <p className="text-red-100 text-lg max-w-xl">Une question ? Une préoccupation ? Notre équipe est à votre écoute.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Coordonnées</h3>
                <div className="space-y-4 text-base">
                  <a href={`tel:${(settings.telephone_1 || '').replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </span>
                    {settings.telephone_1}
                  </a>
                  <a href={`tel:${(settings.telephone_2 || '').replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </span>
                    {settings.telephone_2}
                  </a>
                  <a href={`mailto:${settings.email_contact}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </span>
                    {settings.email_contact}
                  </a>
                  <div className="flex items-start gap-3 text-gray-700">
                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </span>
                    <span>{settings.adresse_ligne1}<br />{settings.adresse_ligne2}<br />{settings.adresse_pays}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-base text-gray-700">
                  <p>{settings.horaires_semaine}</p>
                  <p>{settings.horaires_samedi}</p>
                  <p>{settings.horaires_dimanche}</p>
                </div>
              </div>

              <a href={`https://wa.me/${settings.whatsapp_numero}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-green-500 text-white rounded-2xl p-6 hover:bg-green-600 transition">
                <span className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                <div>
                  <h3 className="font-bold">WhatsApp Médecin</h3>
                  <p className="text-sm text-green-100">Discutez directement avec un médecin</p>
                </div>
              </a>
            </div>

            <div className="lg:col-span-3">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-base">{success}</div>
              )}
              <form onSubmit={submit} className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                    <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.nom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="Votre nom" />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="email@exemple.com" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Téléphone</label>
                    <input type="tel" value={form.telephone} onChange={(e) => setField('telephone', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.telephone ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="+226 XX XX XX XX" />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1.5">Sujet *</label>
                    <input type="text" value={form.sujet} onChange={(e) => setField('sujet', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.sujet ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`} placeholder="Objet de votre message" />
                    {errors.sujet && <p className="text-red-500 text-sm mt-1">{errors.sujet[0]}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea rows="5" value={form.message} onChange={(e) => setField('message', e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none`} placeholder="Votre message…"></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>}
                </div>
                <button type="submit" disabled={submitting} className="w-full sm:w-auto bg-red-600 text-white px-8 py-3.5 rounded-xl text-lg font-bold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
                  {submitting ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
