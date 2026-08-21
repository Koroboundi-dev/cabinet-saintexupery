import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatFcfa, formatDayMonth, formatDateSlash } from '../utils/format.js'

export default function FormationDetail() {
  const { slug } = useParams()
  const [formation, setFormation] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/formations/${slug}`)
      .then((data) => {
        setFormation(data)
        document.title = `${data.titre} | Cabinet Saint-Exupéry International`
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500 text-xl">Formation non trouvée.</p>
        <Link to="/formations" className="mt-4 inline-block text-red-600 font-semibold">Retour aux formations</Link>
      </section>
    )
  }

  if (!formation) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  return (
    <>
      <section className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/formations" className="inline-flex items-center gap-1 text-red-100 text-base mb-4 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour aux formations
          </Link>
          <div className="flex items-center gap-3">
            {formation.certification && (
              <span className="bg-white/20 text-sm font-bold px-4 py-1.5 rounded-full">{formation.certification}</span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-3">{formation.titre}</h1>
          <p className="text-red-100 text-xl">Durée : {formation.duree}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">{formation.description}</p>
          </div>

          {formation.programme && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Programme</h2>
              <div className="bg-gray-50 rounded-xl p-5 border">
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{formation.programme}</p>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-5 border">
              <h3 className="text-base font-bold text-gray-400 uppercase mb-3">Tarifs</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Adulte</span>
                  <span className="font-bold">{formatFcfa(formation.tarif_adulte)} FCFA</span>
                </div>
                {formation.tarif_enfant != null && (
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Moins de 15 ans</span>
                    <span className="font-bold">{formatFcfa(formation.tarif_enfant)} FCFA</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border">
              <h3 className="text-base font-bold text-gray-400 uppercase mb-3">Informations</h3>
              <div className="space-y-2 text-base text-gray-600">
                {formation.public_cible && <p><span className="font-semibold">Public :</span> {formation.public_cible}</p>}
                {formation.certification && <p><span className="font-semibold">Certification :</span> {formation.certification}</p>}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sessions disponibles</h2>
            {formation.sessions?.length > 0 ? (
              <div className="space-y-3">
                {formation.sessions.map((session) => (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 rounded-xl p-5 border hover:shadow-md transition">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatDayMonth(session.date_debut)} &rarr; {formatDateSlash(session.date_fin)}</p>
                      <p className="text-base text-gray-500 mt-1">{session.heure_debut} - {session.heure_fin} &bull; {session.lieu}</p>
                      <p className={`text-base mt-1 ${session.places_restantes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {session.places_restantes > 0
                          ? `${session.places_restantes} place(s) disponible(s)`
                          : 'Complet'}
                      </p>
                    </div>
                    {!session.est_complete ? (
                      <Link to={`/formations/session/${session.id}/inscription`} className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-base font-semibold hover:bg-red-600 transition shrink-0 text-center">S'inscrire</Link>
                    ) : (
                      <span className="text-base text-gray-400 font-medium shrink-0">Complet</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base text-gray-400">Aucune session planifiée pour le moment.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
