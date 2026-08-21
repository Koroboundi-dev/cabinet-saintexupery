import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'

export default function MedecinDetail() {
  const { slug } = useParams()
  const [medecin, setMedecin] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/medecins/${slug}`)
      .then((data) => {
        setMedecin(data)
        document.title = `Dr. ${data.prenom} ${data.nom} | Cabinet Saint-Exupéry International`
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500 text-xl">Médecin non trouvé.</p>
        <Link to="/medecins" className="mt-4 inline-block text-blue-600 font-semibold">Retour aux médecins</Link>
      </section>
    )
  }

  if (!medecin) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/medecins" className="inline-flex items-center gap-1 text-blue-200 text-sm mb-4 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour aux médecins
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
              {medecin.photo ? (
                <img src={medecin.photo} alt={`Dr. ${medecin.prenom} ${medecin.nom}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold">{medecin.prenom?.[0]}{medecin.nom?.[0]}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Dr. {medecin.prenom} {medecin.nom}</h1>
              <p className="text-blue-200 text-lg">{medecin.specialite}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {medecin.biographie && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">{medecin.biographie}</p>
            </div>
          )}

          {(medecin.telephone || medecin.email) && (
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Contact</h3>
              {medecin.telephone && (
                <a href={`tel:${medecin.telephone}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {medecin.telephone}
                </a>
              )}
              {medecin.email && (
                <a href={`mailto:${medecin.email}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {medecin.email}
                </a>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/rendez-vous" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">Prendre Rendez-vous avec ce médecin</Link>
          </div>
        </div>
      </section>
    </>
  )
}
