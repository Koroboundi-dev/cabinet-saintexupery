import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDayMonth, formatDateSlash, limit, imageSrc } from '../utils/format.js'
import Lightbox from '../components/Lightbox.jsx'

export default function Campagnes() {
  const [campagnes, setCampagnes] = useState([])
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    document.title = 'Campagnes de Prévention | Cabinet Saint-Exupéry International'
    api.get('/campagnes').then(setCampagnes).catch(() => setCampagnes([]))
  }, [])

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-200 text-lg font-semibold uppercase tracking-wider">Prévention</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Nos Campagnes de Santé</h1>
          <p className="text-blue-100 text-lg max-w-xl">Dépistages et actions de prévention pour prendre soin de votre santé.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {campagnes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {campagnes.map((campagne) => (
                <div key={campagne.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col">
                  {campagne.image && (
                    <div
                      className="overflow-hidden group/img cursor-zoom-in"
                      onClick={() => setZoom(imageSrc(campagne.image))}
                    >
                      <img src={imageSrc(campagne.image)} alt={campagne.titre} className="w-full h-52 object-cover transition-transform duration-500 ease-out group-hover/img:scale-110" />
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <span className="inline-block bg-white/20 text-base font-bold px-4 py-1 rounded-full mb-3">{campagne.type || 'Campagne'}</span>
                    <h2 className="text-2xl font-bold">{campagne.titre}</h2>
                    <p className="text-blue-100 text-base mt-2">{formatDayMonth(campagne.date_debut)} → {formatDateSlash(campagne.date_fin)}</p>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-base text-gray-600 leading-relaxed mb-5">{limit(campagne.description, 200)}</p>
                    <div className="mt-auto space-y-3">
                      {campagne.heure_debut && (
                        <p className="flex items-center gap-2 text-base text-gray-500">
                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          De {campagne.heure_debut} à {campagne.heure_fin}
                        </p>
                      )}
                      <Link to={`/campagnes/${campagne.slug}`} className="block w-full text-center bg-red-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-red-700 transition">Voir la campagne</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Aucune campagne active pour le moment. Revenez bientôt.</p>
            </div>
          )}
        </div>
      </section>
      {zoom && <Lightbox src={zoom} alt="Campagne" onClose={() => setZoom(null)} />}
    </>
  )
}
