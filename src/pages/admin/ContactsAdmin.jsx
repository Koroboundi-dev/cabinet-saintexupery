import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { formatDateDateTimeFr } from '../../utils/format.js'

const STATUTS = {
  nouveau: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
  lu: { label: 'Lu', color: 'bg-gray-100 text-gray-500' },
  repondu: { label: 'Répondu', color: 'bg-green-100 text-green-700' },
}

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)

  const load = () => {
    api.get('/admin/contacts').then((d) => setContacts(d.data || d)).catch(() => setContacts([]))
  }

  useEffect(() => {
    document.title = 'Messages | Administration'
    load()
  }, [])

  const setStatut = async (contact, statut) => {
    await api.put(`/admin/contacts/${contact.id}`, { statut })
    load()
    if (selected?.id === contact.id) setSelected({ ...selected, statut })
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return
    await api.del(`/admin/contacts/${id}`)
    setSelected(null)
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Messages reçus</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Expéditeur</th>
                  <th className="px-5 py-3">Sujet</th>
                  <th className="px-5 py-3">Reçu le</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((c) => (
                  <tr key={c.id} className={`hover:bg-gray-50 ${c.statut === 'nouveau' ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-5 py-4">
                      <div className={`font-medium ${c.statut === 'nouveau' ? 'text-gray-900' : 'text-gray-700'}`}>{c.nom}</div>
                      <div className="text-xs text-gray-400">{c.email}{c.telephone ? ` • ${c.telephone}` : ''}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs">{c.sujet}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDateDateTimeFr(c.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${(STATUTS[c.statut] || STATUTS.lu).color}`}>{(STATUTS[c.statut] || STATUTS.lu).label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setSelected(c)} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600">Voir</button>
                        {c.statut !== 'lu' && c.statut !== 'repondu' && (
                          <button onClick={() => setStatut(c, 'lu')} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200">Marquer lu</button>
                        )}
                        {c.statut !== 'repondu' && (
                          <button onClick={() => setStatut(c, 'repondu')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600">Répondu</button>
                        )}
                        <button onClick={() => supprimer(c.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-gray-400">Aucun message pour le moment.</p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.sujet}</h3>
                <p className="text-sm text-gray-500">{selected.nom} &lt;{selected.email}&gt;{selected.telephone ? ` • ${selected.telephone}` : ''}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{selected.message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.sujet)}`} onClick={() => setStatut(selected, 'repondu')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Répondre par email</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
