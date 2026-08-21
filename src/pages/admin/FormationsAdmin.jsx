import { useEffect, useState } from 'react'
import { api, fileToDataUrl } from '../../api/client.js'
import { formatDayMonth, formatDateSlash, formatFcfa, statutLabel } from '../../utils/format.js'

const VIDE = {
  titre: '', description: '', programme: '', duree: '', tarif_adulte: '', tarif_enfant: '',
  public_cible: '', certification: '', image: '', active: true,
  session_date_debut: '', session_date_fin: '', session_heure_debut: '08:00', session_heure_fin: '17:00',
  session_lieu: 'Ouaga 2000, Extension Sud', session_places_max: 30,
}

export default function FormationsAdmin() {
  const [formations, setFormations] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(VIDE)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get('/admin/formations').then((d) => setFormations(d.data || d)).catch(() => setFormations([]))
  }

  useEffect(() => {
    document.title = 'Formations | Administration'
    load()
  }, [])

  const ouvrirCreation = () => {
    setForm(VIDE)
    setErrors({})
    setModal('create')
  }

  const ouvrirEdition = (f) => {
    setForm({
      ...VIDE,
      ...f,
      tarif_adulte: f.tarif_adulte ?? '',
      tarif_enfant: f.tarif_enfant ?? '',
      image: f.image || '',
      session_date_debut: '', session_date_fin: '',
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
      if (modal === 'create') await api.post('/admin/formations', form)
      else await api.put(`/admin/formations/${form.id}`, form)
      setModal(null)
      setMessage(modal === 'create' ? 'Formation créée avec succès.' : 'Formation mise à jour.')
      load()
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message || 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette formation et toutes ses sessions ?')) return
    await api.del(`/admin/formations/${id}`)
    setMessage('Formation supprimée.')
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Formations</h1>
        <button onClick={ouvrirCreation} className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 transition">+ Nouvelle formation</button>
      </div>

      {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3.5 mb-5 text-sm">{message}</div>}

      <div className="space-y-4">
        {formations.length > 0 ? formations.map((f) => (
          <div key={f.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                {f.image && <img src={f.image.startsWith('data:') || f.image.startsWith('/') ? f.image : `/${f.image}`} alt="" className="w-16 h-16 rounded-lg object-cover border shrink-0" />}
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900">{f.titre}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {f.duree} • Adulte : {formatFcfa(f.tarif_adulte)} F{f.tarif_enfant != null ? ` • Enfant : ${formatFcfa(f.tarif_enfant)} F` : ''}
                    {f.certification ? ` • ${f.certification}` : ''}
                  </p>
                  <p className={`text-xs mt-1 font-semibold ${f.active ? 'text-green-600' : 'text-gray-400'}`}>{f.active ? 'Visible sur le site' : 'Masquée'}</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => ouvrirEdition(f)} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600">Modifier</button>
                <button onClick={() => supprimer(f.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Suppr.</button>
              </div>
            </div>

            {f.sessions?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {f.sessions.map((s) => (
                  <div key={s.id} className="bg-gray-50 rounded-lg p-3 text-xs">
                    <div className="font-semibold text-gray-800">{formatDayMonth(s.date_debut)} → {formatDateSlash(s.date_fin)}</div>
                    <div className="text-gray-500 mt-1">{s.heure_debut} - {s.heure_fin} • {s.lieu}</div>
                    <div className={`mt-1 font-semibold ${s.est_complete ? 'text-red-600' : 'text-green-600'}`}>
                      {s.places_restantes > 0 ? `${s.places_restantes}/${s.places_max} places restantes` : 'Complet'} • {statutLabel(s.statut)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )) : (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center text-gray-400">Aucune formation.</div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setModal(null)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{modal === 'create' ? 'Nouvelle formation' : 'Modifier la formation'}</h2>

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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Programme</label>
              <textarea rows="4" value={form.programme ?? ''} onChange={(e) => setField('programme', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none" placeholder="Un point par ligne…" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Durée *</label>
                <input type="text" value={form.duree} onChange={(e) => setField('duree', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.duree ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} placeholder="Ex : 2 jours" />
                {errors.duree && <p className="text-red-500 text-xs mt-1">{errors.duree[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tarif adulte (FCFA) *</label>
                <input type="number" min="0" value={form.tarif_adulte} onChange={(e) => setField('tarif_adulte', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.tarif_adulte ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
                {errors.tarif_adulte && <p className="text-red-500 text-xs mt-1">{errors.tarif_adulte[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tarif &lt; 15 ans (FCFA)</label>
                <input type="number" min="0" value={form.tarif_enfant ?? ''} onChange={(e) => setField('tarif_enfant', e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.tarif_enfant ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none transition text-sm`} />
                {errors.tarif_enfant && <p className="text-red-500 text-xs mt-1">{errors.tarif_enfant[0]}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Public cible</label>
                <input type="text" value={form.public_cible ?? ''} onChange={(e) => setField('public_cible', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" placeholder="Ex : Grand public, entreprises" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Certification</label>
                <input type="text" value={form.certification ?? ''} onChange={(e) => setField('certification', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" placeholder="Ex : Certifiante" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
              <div className="flex items-center gap-3">
                {form.image && <img src={form.image.startsWith('data:') || form.image.startsWith('/') ? form.image : `/${form.image}`} alt="" className="w-14 h-14 rounded-lg object-cover border" />}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => pickImage(e.target.files[0])} className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold" />
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
            </div>

            {modal === 'create' && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Première session (optionnel)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date début</label>
                    <input type="date" value={form.session_date_debut} onChange={(e) => setField('session_date_debut', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin</label>
                    <input type="date" value={form.session_date_fin} onChange={(e) => setField('session_date_fin', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Heure début</label>
                    <input type="time" value={form.session_heure_debut} onChange={(e) => setField('session_heure_debut', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Heure fin</label>
                    <input type="time" value={form.session_heure_fin} onChange={(e) => setField('session_heure_fin', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lieu</label>
                    <input type="text" value={form.session_lieu} onChange={(e) => setField('session_lieu', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Places max</label>
                    <input type="number" min="1" value={form.session_places_max} onChange={(e) => setField('session_places_max', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.active !== false} onChange={(e) => setField('active', e.target.checked)} className="rounded border-gray-300" />
              Formation active (visible sur le site)
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200">Annuler</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
