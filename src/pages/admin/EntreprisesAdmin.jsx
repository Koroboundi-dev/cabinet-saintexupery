import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { formatDateFr, statutLabel } from '../../utils/format.js'

const STATUTS = {
  nouvelle: 'bg-blue-100 text-blue-700',
  en_cours: 'bg-amber-100 text-amber-700',
  active: 'bg-green-100 text-green-700',
  cloturee: 'bg-gray-100 text-gray-500',
}

export default function EntreprisesAdmin() {
  const [entreprises, setEntreprises] = useState([])
  const [selected, setSelected] = useState(null)

  const load = () => {
    api.get('/admin/entreprises').then((d) => setEntreprises(d.data || d)).catch(() => setEntreprises([]))
  }

  useEffect(() => {
    document.title = 'Entreprises | Administration'
    load()
  }, [])

  const setStatut = async (ent, statut) => {
    await api.put(`/admin/entreprises/${ent.id}`, { statut })
    load()
    if (selected?.id === ent.id) setSelected({ ...selected, statut })
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    await api.del(`/admin/entreprises/${id}`)
    setSelected(null)
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Demandes entreprises</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {entreprises.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Entreprise</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Employés</th>
                  <th className="px-5 py-3">Reçue le</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entreprises.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{e.nom}</td>
                    <td className="px-5 py-4 text-gray-600">
                      <div>{e.contact_nom}</div>
                      <div className="text-xs text-gray-400">{e.contact_telephone}{e.contact_email ? ` • ${e.contact_email}` : ''}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{e.nombre_employes || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDateFr(e.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUTS[e.statut] || 'bg-gray-100 text-gray-500'}`}>{statutLabel(e.statut)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setSelected(e)} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600">Voir</button>
                        {e.statut !== 'active' && (
                          <button onClick={() => setStatut(e, 'active')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600">Activer</button>
                        )}
                        {e.statut !== 'cloturee' && (
                          <button onClick={() => setStatut(e, 'cloturee')} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600">Clôturer</button>
                        )}
                        <button onClick={() => supprimer(e.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-gray-400">Aucune demande pour le moment.</p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.nom}</h3>
                <p className="text-sm text-gray-500">{selected.contact_nom} • {selected.contact_telephone}{selected.contact_email ? ` • ${selected.contact_email}` : ''}</p>
                {selected.secteur && <p className="text-sm text-gray-500">Secteur : {selected.secteur}</p>}
                {selected.nombre_employes && <p className="text-sm text-gray-500">{selected.nombre_employes} employés</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{selected.besoins || 'Aucun détail fourni.'}</p>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
