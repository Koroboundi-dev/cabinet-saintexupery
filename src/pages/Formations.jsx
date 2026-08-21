import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatFcfa, formatDayMonth, formatDateSlash, imageSrc } from '../utils/format.js'

export default function Formations() {
  const [formations, setFormations] = useState([])

  useEffect(() => {
    document.title = 'Formations | Cabinet Saint-Exupéry International'
    api.get('/formations').then(setFormations).catch(() => setFormations([]))
  }, [])

  return (
    <>
      <section className="bg-gradient-to-br from-red-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-red-100 text-lg font-semibold uppercase tracking-wider">Formations</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Formez-vous aux gestes de vie</h1>
          <p className="text-red-100 text-lg max-w-xl">Formations certifiantes aux premiers secours et autres spécialités médicales.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {formations.length > 0 ? (
            <div className="space-y-8">
              {formations.map((formation) => (
                <div key={formation.id} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  <div className="flex flex-col lg:flex-row">
                    {formation.image ? (
                      <div className="lg:w-[28rem] shrink-0 h-80 lg:h-auto overflow-hidden">
                        <img src={imageSrc(formation.image)} alt={formation.titre} className="w-full h-full object-cover" />
                      </div>
                    ) : null}
                    <div className={formation.image ? 'p-7 flex-1' : 'bg-gradient-to-r from-red-500 to-red-600 p-7 text-white lg:w-[28rem] shrink-0'}>
                      <div className="flex items-center gap-3 mb-3">
                        {formation.certification && (
                          <span className={`${formation.image ? 'bg-red-100 text-red-700' : 'bg-white/20 text-white'} text-base font-bold px-4 py-1 rounded-full`}>{formation.certification}</span>
                        )}
                      </div>
                      <h3 className={`text-2xl font-bold ${formation.image ? 'text-gray-900' : ''}`}>{formation.titre}</h3>
                      <div className={`text-lg ${formation.image ? 'text-gray-500' : 'text-white/80'} mt-2 space-y-1`}>
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          Durée : {formation.duree}
                        </p>
                        {formation.public_cible && (
                          <p className="flex items-center gap-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {formation.public_cible}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-7 flex-1">
                      <p className="text-lg text-gray-600 leading-relaxed mb-5">{formation.description}</p>

                      <div className="bg-white rounded-xl p-5 mb-5 border">
                        <div className="flex justify-between text-lg mb-2">
                          <span className="text-gray-500">Adulte</span>
                          <span className="font-bold text-gray-900">{formatFcfa(formation.tarif_adulte)} FCFA</span>
                        </div>
                        {formation.tarif_enfant != null && (
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-500">Moins de 15 ans</span>
                            <span className="font-bold text-gray-900">{formatFcfa(formation.tarif_enfant)} FCFA</span>
                          </div>
                        )}
                      </div>

                      {formation.prochaine_session && (
                        <div className="bg-red-50 rounded-xl p-5 mb-5">
                          <p className="text-base font-semibold text-red-800">Prochaine session</p>
                          <p className="text-lg text-red-700 mt-1">{formatDayMonth(formation.prochaine_session.date_debut)} → {formatDateSlash(formation.prochaine_session.date_fin)}</p>
                          <p className="text-base text-red-600 mt-1">{formation.places_disponibles} place(s) disponible(s) &bull; {formation.prochaine_session.lieu}</p>
                        </div>
                      )}

                      <Link to={`/formations/${formation.slug}`} className="block w-full text-center bg-red-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-600 transition">Voir la formation</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Aucune formation disponible pour le moment. Revenez bientôt.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
