import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client.js'
import { formatDateFr, statutLabel, statutColor } from '../../utils/format.js'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    document.title = 'Tableau de bord | Administration'
    api.get('/admin/dashboard').then(setData).catch(() => {})
  }, [])

  if (!data) {
    return <div className="p-8 text-gray-400">Chargement…</div>
  }

  const s = data.stats || {}
  const rdvRecents = data.derniers_rdv || []

  const cards = [
    ['Rendez-vous', s.rendez_vous_total ?? 0, 'bg-blue-500', '/admin/rendez-vous', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
    ['RDV en attente', s.rendez_vous_en_attente ?? 0, 'bg-amber-500', '/admin/rendez-vous', 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
    ['Inscriptions formations', s.inscriptions_total ?? 0, 'bg-red-500', '/admin/inscriptions/formations', 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'],
    ['Campagnes actives', s.campagnes_actives ?? 0, 'bg-indigo-500', '/admin/campagnes', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
    ['Messages non lus', s.contacts_nouveaux ?? 0, 'bg-green-500', '/admin/contacts', 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
    ['Demandes entreprises', s.entreprises_nouvelles ?? 0, 'bg-slate-600', '/admin/entreprises', 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'],
    ['Médecins', s.medecins_total ?? 0, 'bg-teal-500', '/admin/medecins', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'],
    ['Formations', s.formations_total ?? 0, 'bg-rose-500', '/admin/formations', 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'],
    ['Actualités', s.actualites_total ?? 0, 'bg-violet-500', '/', 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'],
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {cards.map(([label, value, color, link, icon]) => (
          <Link key={label} to={link} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/></svg>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Derniers rendez-vous</h2>
            <Link to="/admin/rendez-vous" className="text-blue-600 text-sm font-semibold hover:text-blue-700">Tout voir →</Link>
          </div>
          {rdvRecents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Date souhaitée</th>
                    <th className="px-5 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rdvRecents.map((rdv) => (
                    <tr key={rdv.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{rdv.prenom} {rdv.nom}</td>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatDateFr(rdv.date_souhaitee)} à {(rdv.heure_souhaitee || '').slice(0, 5)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statutColor(rdv.statut)}`}>{statutLabel(rdv.statut)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-gray-400">Aucun rendez-vous pour le moment.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Derniers messages</h2>
          </div>
          {(data.derniers_contacts || []).length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {data.derniers_contacts.map((c) => (
                <li key={c.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{c.nom}</span>
                    {c.statut === 'nouveau' && <span className="shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase">Nouveau</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{c.sujet}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-gray-400">Aucun message.</p>
          )}
        </div>
      </div>
    </div>
  )
}
