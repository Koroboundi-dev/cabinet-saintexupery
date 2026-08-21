import { useEffect, useState } from 'react'
import { api, fileToDataUrl } from '../../api/client.js'

const VIDE = { nom: '', prenom: '', specialite: '', biographie: '', telephone: '', email: '', service_id: '', actif: true, photo: '' }

export default function MedecinsAdmin() {
  const [medecins, setMedecins] = useState([])
  const [services, setServices] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(VIDE)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get('/admin/medecins').then((d) => setMedecins(d.data || d)).catch(() => setMedecins([]))
    api.get('/services').then(setServices).catch(() => setServices([]))
  }

  useEffect(() => {
    document.title = 'Notre Équipe | Administration'
    load()
  }, [])

  const ouvrirCreation = () => {
    setForm(VIDE)
    setErrors({})
    setModal('create')
  }

  const ouvrirEdition = async (id) => {
    try {
      const m = await api.get(`/admin/medecins/${id}`)
      setForm({ ...VIDE, ...m, service_id: m.service_id ?? '', photo: m.photo || '' })
      setErrors({})
      setModal('edit')
    } catch (err) {
      setMessage(err.message)
    }
  }

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const pickPhoto = async (file) => {
    if (!file) return
    try {
      setField('photo', await fileToDataUrl(file))
    } catch (err) {
      setErrors((e) => ({ ...e, photo: [err.message] }))
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSaving(true)
    try {
      if (modal === 'create') await api.post('/admin/medecins', form)
      else await api.put(`/admin/medecins/${form.id}`, form)
      setModal(null)
      setMessage(modal === 'create' ? 'Médecin ajouté avec succès.' : 'Médecin mis à jour.')
      load()
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message || 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce médecin ?')) return
    await api.del(`/admin/medecins/${id}`)
    setMessage('Médecin supprimé.')
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Notre Équipe</h1>
        <button onClick={ouvrirCreation} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition">+ Ajouter un médecin</button>
      </div>

      {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3.5 mb-5 text-sm">{message}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {medecins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Médecin</th>
                  <th className="px-5 py-3">Spécialité</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medecins.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                          {m.photo ? <img src={m.photo} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-blue-700">{m.prenom?.[0]}{m.nom?.[0]}</span>}
                        </div>
                        <span className="font-medium text-gray-900">Dr. {m.prenom} {m.nom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{m.specialite}</td>
                    <td className="px-5 py-4 text-gray-600">{services.find((s) => s.id === m.service_id)?.nom || '—'}</td>
                    <td className="px-5 py-4 text-gray-600 text-xs">{m.telephone || '—'}<br />{m.email || ''}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${m.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.actif ? 'Actif' : 'Inactif'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => ouvrirEdition(m.id)} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600">Modifier</button>
                        <button onClick={() => supprimer(m.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-gray-400">Aucun médecin. Cliquez sur « Ajouter un médecin ».</p>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setModal(null)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{modal === 'create' ? 'Nouveau médecin' : 'Modifier le médecin'}</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.nom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom *</label>
                <input type="text" value={form.prenom} onChange={(e) => setField('prenom', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.prenom ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
                {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom[0]}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Spécialité *</label>
              <input type="text" value={form.specialite} onChange={(e) => setField('specialite', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.specialite ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} placeholder="Ex : Cardiologie" />
              {errors.specialite && <p className="text-red-500 text-xs mt-1">{errors.specialite[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Biographie</label>
              <textarea rows="3" value={form.biographie ?? ''} onChange={(e) => setField('biographie', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                <input type="tel" value={form.telephone ?? ''} onChange={(e) => setField('telephone', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email ?? ''} onChange={(e) => setField('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service</label>
              <select value={form.service_id ?? ''} onChange={(e) => setField('service_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm bg-white">
                <option value="">— Aucun —</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
              <div className="flex items-center gap-3">
                {form.photo && <img src={form.photo.startsWith('data:') ? form.photo : `/${form.photo}`} alt="" className="w-14 h-14 rounded-lg object-cover border" />}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => pickPhoto(e.target.files[0])} className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold" />
              </div>
              {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo[0]}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.actif !== false} onChange={(e) => setField('actif', e.target.checked)} className="rounded border-gray-300" />
              Médecin actif (visible sur le site)
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200">Annuler</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
