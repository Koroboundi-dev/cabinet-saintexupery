import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client.js'
import Pagination from '../components/Pagination.jsx'
import { formatDateFr, limit } from '../utils/format.js'

export default function Actualites() {
  const [pageData, setPageData] = useState(null)
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || 1

  useEffect(() => {
    document.title = 'Actualités | Cabinet Saint-Exupéry International'
    api.get(`/actualites?page=${page}`).then(setPageData).catch(() => setPageData(null))
  }, [page])

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-200 text-lg font-semibold uppercase tracking-wider">Actualités</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Nos Actualités</h1>
          <p className="text-blue-100 text-lg max-w-xl">Restez informé des dernières nouvelles du cabinet.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pageData?.data?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {pageData.data.map((actualite) => (
                  <Link key={actualite.id} to={`/actualites/${actualite.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover flex flex-col">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shrink-0">
                      <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-gray-500 mb-2">{formatDateFr(actualite.created_at)}</div>
                      <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-700 transition">{actualite.titre}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{limit(actualite.resume ?? actualite.contenu, 140)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination paginator={pageData} basePath="/actualites" />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Aucune actualité pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
