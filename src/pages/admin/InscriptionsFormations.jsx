import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { formatDateFr, formatFcfa, statutLabel, statutColor } from '../../utils/format.js'

export default function InscriptionsFormations() {
  const [inscriptions, setInscriptions] = useState([])

  const load = () => {
    api.get('/admin/inscriptions/formations').then((d) => setInscriptions(d.data || d)).catch(() => setInscriptions([]))
  }

  useEffect(() => {
    document.title = 'Inscriptions formations | Administration'
    load()
  }, [])

  const setStatut = async (id, statut_inscription) => {
    await api.put(`/admin/inscriptions/formations/${id}`, { statut_inscription })
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Inscriptions aux formations</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {inscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Participant</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Formation</th>
                  <th className="px-5 py-3">Catégorie</th>
                  <th className="px-5 py-3">Montant</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inscriptions.map((ins) => (
                  <tr key={ins.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{ins.prenom} {ins.nom}</td>
                    <td className="px-5 py-4 text-gray-600">
                      <div>{ins.telephone}</div>
                      {ins.email && <div className="text-xs text-gray-400">{ins.email}</div>}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{ins.formation_titre || `Session #${ins.session_formation_id}`}</td>
                    <td className="px-5 py-4 text-gray-600">{statutLabel(ins.categorie)}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{formatFcfa(ins.montant_paye)} F</td>
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDateFr(ins.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statutColor(ins.statut_inscription)}`}>{statutLabel(ins.statut_inscription)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {ins.statut_inscription !== 'confirmee' && (
                          <button onClick={() => setStatut(ins.id, 'confirmee')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600">Confirmer</button>
                        )}
                        {ins.statut_inscription !== 'annulee' && (
                          <button onClick={() => setStatut(ins.id, 'annulee')} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600">Annuler</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-gray-400">Aucune inscription pour le moment.</p>
        )}
      </div>
    </div>
  )
}
