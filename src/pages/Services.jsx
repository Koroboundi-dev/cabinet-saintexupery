import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Services() {
  const [services, setServices] = useState([])

  useEffect(() => {
    document.title = 'Nos Services | Cabinet Saint-Exupéry International'
    api.get('/services').then(setServices).catch(() => setServices([]))
  }, [])

  return (
    <>
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-red-200 text-sm font-semibold uppercase tracking-wider">Nos Services</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Des soins complets pour tous vos besoins</h1>
          <p className="text-red-100/80 max-w-xl">Du consultation générale au transport médical aérien, nous offrons une prise en charge complète.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service) => (
              <div key={service.id} id={`service-${service.slug}`} className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${service.couleur}15` }}>
                    <span className="text-3xl">{service.icone || '🩺'}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{service.nom}</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                    {service.medecins?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {service.medecins.map((medecin) => (
                          <Link key={medecin.id} to={`/medecins/${medecin.slug}`} className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700 border hover:border-blue-300 transition">
                            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">{medecin.prenom?.[0]}{medecin.nom?.[0]}</span>
                            Dr. {medecin.prenom} {medecin.nom}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Besoin d'une consultation ?</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">Prenez rendez-vous dès maintenant ou contactez-nous directement.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/rendez-vous" className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">Prendre Rendez-vous</Link>
            <a href="https://wa.me/22645233636" target="_blank" rel="noreferrer" className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
