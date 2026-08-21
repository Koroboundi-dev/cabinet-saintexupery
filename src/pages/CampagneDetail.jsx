import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDayMonth, formatDateSlash, imageSrc } from '../utils/format.js'

const parseListe = (valeur) => {
  if (!valeur) return []
  if (Array.isArray(valeur)) return valeur
  try {
    const parsed = JSON.parse(valeur)
    return Array.isArray(parsed) ? parsed : [String(valeur)]
  } catch {
    return String(valeur).split('\n').filter(Boolean)
  }
}

export default function CampagneDetail() {
  const { slug } = useParams()
  const [campagne, setCampagne] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/campagnes/${slug}`)
      .then((data) => {
        setCampagne(data)
        document.title = `${data.titre} | Cabinet Saint-Exupéry International`
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500 text-xl">Campagne non trouvée.</p>
        <Link to="/campagnes" className="mt-4 inline-block text-blue-600 font-semibold">Retour aux campagnes</Link>
      </section>
    )
  }

  if (!campagne) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  const offres = parseListe(campagne.offres)
  const tarifs = parseListe(campagne.tarifs)

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/campagnes" className="inline-flex items-center gap-1 text-blue-200 text-base mb-4 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour aux campagnes
          </Link>
          <span className="inline-block bg-white/20 text-base font-bold px-4 py-1 rounded-full mb-3">{campagne.type || 'Campagne'}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{campagne.titre}</h1>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {campagne.image && (
            <img src={imageSrc(campagne.image)} alt={campagne.titre} className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg mb-8" />
          )}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="text-base font-bold text-blue-400 uppercase mb-2">Période</h3>
              <p className="text-lg font-semibold text-gray-900">{formatDayMonth(campagne.date_debut)} → {formatDateSlash(campagne.date_fin)}</p>
              {campagne.heure_debut && (
                <p className="text-base text-gray-500 mt-1">De {campagne.heure_debut} à {campagne.heure_fin}</p>
              )}
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{campagne.description}</p>
            {campagne.details && (
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line mt-4">{campagne.details}</p>
            )}
          </div>

          {offres.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Au programme</h2>
              <ul className="space-y-3">
                {offres.map((offre, i) => (
                  <li key={i} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    <span className="text-base text-gray-700">{offre}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tarifs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tarifs</h2>
              <ul className="space-y-2">
                {tarifs.map((tarif, i) => (
                  <li key={i} className="flex items-center gap-3 text-base text-gray-700 border-b border-gray-100 pb-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                    {tarif}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Participer à cette campagne</h2>
            <p className="text-blue-100 mb-6">Inscrivez-vous en ligne, c'est simple et rapide.</p>
            <Link to={`/campagne/${campagne.id}/inscription`} className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">S'inscrire maintenant</Link>
          </div>
        </div>
      </section>
    </>
  )
}
