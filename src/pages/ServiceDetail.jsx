import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/services/${slug}`)
      .then((data) => {
        setService(data)
        document.title = `${data.nom} | Cabinet Saint-Exupéry International`
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500 text-xl">Service non trouvé.</p>
        <Link to="/services" className="mt-4 inline-block text-blue-600 font-semibold">Retour aux services</Link>
      </section>
    )
  }

  if (!service) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-1 text-blue-200 text-sm mb-4 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour aux services
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{service.icone || '🩺'}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">{service.nom}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>
          </div>

          {service.medecins?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos spécialistes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.medecins.map((medecin) => (
                  <Link key={medecin.id} to={`/medecins/${medecin.slug}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-blue-700">{medecin.prenom?.[0]}{medecin.nom?.[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Dr. {medecin.prenom} {medecin.nom}</h3>
                      <p className="text-sm text-gray-500">{medecin.specialite}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-3">Besoin de ce service ?</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/rendez-vous" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">Prendre Rendez-vous</Link>
              <a href="https://wa.me/22645233636" target="_blank" rel="noreferrer" className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition">Contacter sur WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
