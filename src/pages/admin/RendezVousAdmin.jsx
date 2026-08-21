import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { formatDateFr, statutLabel, statutColor } from '../../utils/format.js'

export default function RendezVousAdmin() {
  const [rdvs, setRdvs] = useState([])
  const [filter, setFilter] = useState('')

  const load = () => {
    api.get('/admin/rendez-vous').then((d) => setRdvs(d.data || d)).catch(() => setRdvs([]))
  }

  useEffect(() => {
    document.title = 'Rendez-vous | Administration'
    load()
  }, [])

  const setStatut = async (id, statut) => {
    await api.put(`/admin/rendez-vous/${id}`, { statut })
    load()
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce rendez-vous ?')) return
    await api.del(`/admin/rendez-vous/${id}`)
    load()
  }

  const filtered = filter ? rdvs.filter((r) => r.statut === filter) : rdvs

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Rendez-vous</h1>
        <div className="flex gap-2">
          {[['', 'Tous'], ['en_attente', 'En attente'], ['confirme', 'Confirmés'], ['annule', 'Annulés']].map(([value, label]) => (
            <button key={label} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === value ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Date souhaitée</th>
                  <th className="px-5 py-3">Médecin</th>
                  <th className="px-5 py-3">Motif</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((rdv) => (
                  <tr key={rdv.id} className="hover:bg-gray-50 align-top">
                    <td className="px-5 py-4 font-medium text-gray-900">{rdv.prenom} {rdv.nom}</td>
                    <td className="px-5 py-4 text-gray-600">
                      <div>{rdv.telephone}</div>
                      {rdv.email && <div className="text-xs text-gray-400">{rdv.email}</div>}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatDateFr(rdv.date_souhaitee)}<br /><span className="text-xs text-gray-400">{rdv.heure_souhaitee?.slice(0, 5)}</span></td>
                    <td className="px-5 py-4 text-gray-600">{rdv.medecin_nom || '—'}</td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs"><span className="line-clamp-2">{rdv.motif}</span></td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statutColor(rdv.statut)}`}>{statutLabel(rdv.statut)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {rdv.statut !== 'confirme' && (
                          <button onClick={() => setStatut(rdv.id, 'confirme')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600">Confirmer</button>
                        )}
                        {rdv.statut !== 'annule' && (
                          <button onClick={() => setStatut(rdv.id, 'annule')} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600">Annuler</button>
                        )}
                        <button onClick={() => supprimer(rdv.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-gray-400">Aucun rendez-vous{filter ? ' avec ce filtre' : ''}.</p>
        )}
      </div>
    </div>
  )
}
