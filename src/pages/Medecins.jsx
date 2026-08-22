import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { limit } from '../utils/format.js'

export default function Medecins() {
  const [medecins, setMedecins] = useState([])

  useEffect(() => {
    document.title = 'Nos Médecins | Cabinet Saint-Exupéry International'
    api.get('/medecins').then(setMedecins).catch(() => setMedecins([]))
  }, [])

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-200 text-base font-semibold uppercase tracking-wider">Notre Équipe</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Nos Médecins</h1>
          <p className="text-blue-100/80 text-xl max-w-xl">Une équipe de professionnels qualifiés à votre service.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {medecins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medecins.map((medecin) => (
                <div key={medecin.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
                  <Link to={`/medecins/${medecin.slug}`} className="block">
                    <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {medecin.photo ? (
                        <img src={medecin.photo} alt={`Dr. ${medecin.prenom} ${medecin.nom}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-blue-700">{medecin.prenom?.[0]}{medecin.nom?.[0]}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">Dr. {medecin.prenom} {medecin.nom}</h3>
                      <p className="text-blue-600 text-base font-medium mb-3">{medecin.specialite}</p>
                      {medecin.biographie && (
                        <p className="text-gray-500 text-base leading-relaxed mb-4">{limit(medecin.biographie, 150)}</p>
                      )}
                    </div>
                  </Link>
                  <div className="flex gap-2 justify-center">
                    {medecin.telephone && (
                      <a href={`tel:${medecin.telephone}`} className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border hover:bg-blue-50 transition" aria-label="Appeler">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </a>
                    )}
                    <Link to="/rendez-vous" className="px-5 h-12 bg-red-600 text-white rounded-lg text-base font-semibold hover:bg-red-700 transition flex items-center">Prendre RDV</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">L'équipe médicale sera bientôt disponible sur cette page.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
