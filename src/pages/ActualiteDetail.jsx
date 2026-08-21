import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { formatDateFr } from '../utils/format.js'

export default function ActualiteDetail() {
  const { slug } = useParams()
  const [actualite, setActualite] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/actualites/${slug}`)
      .then((data) => {
        setActualite(data)
        document.title = `${data.titre} | Cabinet Saint-Exupéry International`
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500 text-xl">Actualité non trouvée.</p>
        <Link to="/actualites" className="mt-4 inline-block text-blue-600 font-semibold">Retour aux actualités</Link>
      </section>
    )
  }

  if (!actualite) {
    return <section className="py-20 bg-white text-center"><p className="text-gray-400">Chargement…</p></section>
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/actualites" className="inline-flex items-center gap-1 text-blue-200 text-base mb-4 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Retour aux actualités
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{actualite.titre}</h1>
          <p className="text-blue-200 text-base mt-3">{formatDateFr(actualite.created_at)}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {actualite.resume && (
            <p className="text-lg text-gray-500 italic leading-relaxed mb-6 border-l-4 border-blue-500 pl-4">{actualite.resume}</p>
          )}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{actualite.contenu}</p>
          </div>
        </div>
      </section>
    </>
  )
}
