import { useEffect } from 'react'

export default function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!src) return null
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-in fade-in duration-200" onClick={onClose}>
      <button onClick={onClose} aria-label="Fermer" className="absolute top-4 right-5 text-white/80 hover:text-white text-5xl leading-none font-light select-none">&times;</button>
      <img src={src} alt={alt || ''} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <p className="absolute bottom-4 text-white/50 text-sm">Cliquez n'importe où pour fermer</p>
    </div>
  )
}
