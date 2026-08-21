export function formatDateFr(value) {
  if (!value) return ''
  const d = new Date(value)
  const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  return `${String(d.getDate()).padStart(2, '0')} ${MOIS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateDateTimeFr(value) {
  if (!value) return ''
  const d = new Date(value)
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${formatDateFr(value)} à ${hh}:${mi}`
}

export function formatDateSlash(value) {
  if (!value) return ''
  const d = new Date(String(value).slice(0, 10) + 'T00:00:00')
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export function formatDayMonth(value) {
  if (!value) return ''
  const d = new Date(String(value).slice(0, 10) + 'T00:00:00')
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function formatFcfa(value) {
  if (value == null) return ''
  return Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 0 }).replace(/\u202f/g, ' ')
}

export function limit(text, n = 120) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n) + '…' : text
}

export function statutLabel(statut) {
  if (!statut) return ''
  return statut.charAt(0).toUpperCase() + statut.slice(1).replace(/_/g, ' ')
}

export function statutColor(statut) {
  switch (statut) {
    case 'en_attente': return 'bg-amber-100 text-amber-700'
    case 'confirmee': case 'confirmé': return 'bg-green-100 text-green-700'
    case 'annulee': case 'annulé': return 'bg-red-100 text-red-700'
    case 'terminee': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function imageSrc(path) {
  if (!path) return null
  if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('/')) return path
  return `/${path}`
}
