import { Link } from 'react-router-dom'

export default function Pagination({ data, basePath }) {
  if (!data || !data.last_page || data.last_page <= 1) return null
  const pages = []
  for (let i = 1; i <= data.last_page; i++) pages.push(i)

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {data.current_page > 1 && (
        <Link to={`${basePath}?page=${data.current_page - 1}`} className="px-4 py-2 rounded-lg bg-white border text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
          &laquo; Précédent
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          to={`${basePath}?page=${p}`}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
            p === data.current_page
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-white border text-gray-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          {p}
        </Link>
      ))}
      {data.current_page < data.last_page && (
        <Link to={`${basePath}?page=${data.current_page + 1}`} className="px-4 py-2 rounded-lg bg-white border text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
          Suivant &raquo;
        </Link>
      )}
    </nav>
  )
}
