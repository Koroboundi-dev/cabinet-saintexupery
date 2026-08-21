import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext.jsx'

export default function FormationInscriptionConfirmation() {
  const { settings } = useSettings()

  useEffect(() => {
    document.title = 'Inscription enregistrée | Cabinet Saint-Exupéry International'
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Inscription enregistrée</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Votre inscription a bien été enregistrée. Notre équipe vous contactera pour confirmer votre participation et vous communiquer les modalités de paiement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/formations" className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition">Voir les formations</Link>
          <a href={`https://wa.me/${settings.whatsapp_numero}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition">Nous contacter</a>
        </div>
      </div>
    </section>
  )
}
