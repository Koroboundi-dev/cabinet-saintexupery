import { useEffect, useState } from 'react'
import { api, fileToDataUrl } from '../../api/client.js'
import { formatDayMonth, formatDateSlash } from '../../utils/format.js'

const VIDE = {
  titre: '', description: '', details: '', type: '',
  date_debut: '', date_fin: '', heure_debut: '09:00', heure_fin: '17:00',
  offres: '', tarifs: '', image: '', active: true,
}

const lignesVersTableau = (texte) =>
  String(texte || '').split('\n').map((l) => l.trim()).filter(Boolean)

const tableauVersLignes = (valeur) => {
  if (!valeur) return ''
  if (Array.isArray(valeur)) return valeur.join('\n')
  try {
    const parsed = JSON.parse(valeur)
    return Array.isArray(parsed) ? parsed.join('\n') : String(valeur)
  } catch {
    return String(valeur)
  }
}

export default function CampagnesAdmin() {
  const [campagnes, setCampagnes] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(VIDE)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get('/admin/campagnes').then((d) => setCampagnes(d.data || d)).catch(() => setCampagnes([]))
  }

  useEffect(() => {
    document.title = 'Campagnes | Administration'
    load()
  }, [])

  const ouvrirCreation = () => {
    setForm(VIDE)
    setErrors({})
    setModal('create')
  }

  const ouvrirEdition = (c) => {
    setForm({
      ...VIDE,
      ...c,
      offres: tableauVersLignes(c.offres),
      tarifs: tableauVersLignes(c.tarifs),
      image: c.image || '',
      heure_debut: (c.heure_debut || '09:00').slice(0, 5),
      heure_fin: (c.heure_fin || '17:00').slice(0, 5),
    })
    setErrors({})
    setModal('edit')
  }

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const pickImage = async (file) => {
    if (!file) return
    try {
      setField('image', await fileToDataUrl(file))
    } catch (err) {
      setErrors((e) => ({ ...e, image: [err.message] }))
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        offres: lignesVersTableau(form.offres),
        tarifs: lignesVersTableau(form.tarifs),
      }
      if (modal === 'create') await api.post('/admin/campagnes', payload)
      else await api.put(`/admin/campagnes/${form.id}`, payload)
      setModal(null)
      setMessage(modal === 'create' ? 'Campagne créée avec succès.' : 'Campagne mise à jour.')
      load()
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message || 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette campagne et ses inscriptions ?')) return
    await api.del(`/admin/campagnes/${id}`)
    setMessage('Campagne supprimée.')
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Campagnes</h1>
        <button onClick={ouvrirCreation} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition">+ Nouvelle campagne</button>
      </div>

      {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3.5 mb-5 text-sm">{message}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {campagnes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Campagne</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Période</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campagnes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {c.image && <img src={c.image.startsWith('data:') || c.image.startsWith('/') ? c.image : `/${c.image}`} alt="" className="w-10 h-10 rounded-lg object-cover border shrink-0" />}
                        <span className="font-medium text-gray-900">{c.titre}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{c.type || '—'}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap text-xs">{formatDayMonth(c.date_debut)} → {formatDateSlash(c.date_fin)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => ouvrirEdition(c)} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600">Modifier</button>
                        <button onClick={() => supprimer(c.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-gray-400">Aucune campagne.</p>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setModal(null)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{modal === 'create' ? 'Nouvelle campagne' : 'Modifier la campagne'}</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Titre *</label>
              <input type="text" value={form.titre} onChange={(e) => setField('titre', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.titre ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
              {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea rows="3" value={form.description} onChange={(e) => setField('description', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none`} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Détails</label>
              <textarea rows="3" value={form.details ?? ''} onChange={(e) => setField('details', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type de campagne</label>
                <input type="text" value={form.type ?? ''} onChange={(e) => setField('type', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" placeholder="Ex : Dépistage, Vaccination" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
                <div className="flex items-center gap-3">
                  {form.image && <img src={form.image.startsWith('data:') || form.image.startsWith('/') ? form.image : `/${form.image}`} alt="" className="w-10 h-10 rounded-lg object-cover border" />}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => pickImage(e.target.files[0])} className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold" />
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date début *</label>
                <input type="date" value={form.date_debut} onChange={(e) => setField('date_debut', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.date_debut ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
                {errors.date_debut && <p className="text-red-500 text-xs mt-1">{errors.date_debut[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin *</label>
                <input type="date" value={form.date_fin} onChange={(e) => setField('date_fin', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.date_fin ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
                {errors.date_fin && <p className="text-red-500 text-xs mt-1">{errors.date_fin[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Heure début</label>
                <input type="time" value={form.heure_debut} onChange={(e) => setField('heure_debut', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Heure fin</label>
                <input type="time" value={form.heure_fin} onChange={(e) => setField('heure_fin', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Offres (une par ligne)</label>
                <textarea rows="4" value={form.offres} onChange={(e) => setField('offres', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none" placeholder={'Consultation gratuite\nDépistage du diabète'} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tarifs (un par ligne)</label>
                <textarea rows="4" value={form.tarifs} onChange={(e) => setField('tarifs', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none" placeholder={'Consultation : Gratuit\nBilan complet : 15 000 FCFA'} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.active !== false} onChange={(e) => setField('active', e.target.checked)} className="rounded border-gray-300" />
              Campagne active (visible sur le site)
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
