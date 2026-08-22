import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'

const links = [
  { to: '/', label: 'Accueil', match: (p) => p === '/' },
  { to: '/services', label: 'Services', match: (p) => p.startsWith('/services') },
  { to: '/medecins', label: 'Médecins', match: (p) => p.startsWith('/medecins') },
  { to: '/formations', label: 'Formations', match: (p) => p.startsWith('/formations') },
  { to: '/campagnes', label: 'Campagnes', match: (p) => p.startsWith('/campagnes') },
  { to: '/sante-travail', label: 'Entreprises', match: (p) => p === '/sante-travail' },
  { to: '/contact', label: 'Contact', match: (p) => p === '/contact' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAdmin } = useAuth()
  const settings = useSettings().settings
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const tel1 = (settings.telephone_1 || '+226 45 10 36 36').replace(/\s/g, '')

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 xl:h-24 gap-2 lg:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-w-0">
              <div className="rounded-xl overflow-hidden shadow-md group-hover:shadow-blue-200 transition-shadow shrink-0 w-14 h-14 xl:w-16 xl:h-16">
                <img src="/images/medical.jpeg" alt="Cabinet Saint-Exupéry" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block leading-tight">
                <div className="text-base xl:text-lg font-bold text-blue-700">SAINT-EXUPÉRY</div>
                <div className="text-[11px] xl:text-xs text-gray-500 font-medium tracking-wide">INTERNATIONAL</div>
              </div>
            </Link>

            {/* Liens desktop */}
            <nav className="hidden lg:flex items-center min-w-0">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={`px-2 xl:px-2.5 py-2 text-[13px] xl:text-sm font-bold rounded-lg hover:bg-blue-50 hover:text-blue-700 transition whitespace-nowrap ${
                    l.match(location.pathname) ? 'text-blue-700 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions desktop */}
            <div className="hidden lg:flex items-center shrink-0">
              <Link to="/rendez-vous" className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3.5 xl:px-5 py-2.5 rounded-xl text-xs xl:text-sm font-bold hover:bg-red-700 shadow-md shadow-red-200 hover:shadow-red-300 transition-all whitespace-nowrap">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Prendre RDV
              </Link>
              {user && isAdmin() ? (
                <Link to="/admin" className="ml-2 inline-flex items-center gap-1.5 bg-gray-800 text-white px-3.5 xl:px-4 py-2.5 rounded-xl text-xs xl:text-sm font-bold hover:bg-gray-900 transition-all whitespace-nowrap">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Admin
                </Link>
              ) : (
                <Link to="/connexion" className="ml-2 inline-flex items-center gap-1.5 bg-gray-800 text-white px-3.5 xl:px-4 py-2.5 rounded-xl text-xs xl:text-sm font-bold hover:bg-gray-900 transition-all whitespace-nowrap">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                  Connexion
                </Link>
              )}
            </div>

            {/* Bouton mobile */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition shrink-0" aria-label="Menu">
              {!mobileOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={`block px-4 py-3 rounded-xl text-base font-bold hover:bg-blue-50 hover:text-blue-700 transition ${
                    l.match(location.pathname) ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="pt-3 border-t space-y-2">
                <Link to="/rendez-vous" className="block w-full text-center bg-red-600 text-white px-5 py-3.5 rounded-xl text-base font-bold hover:bg-red-700 transition">Prendre Rendez-vous</Link>
                {user && isAdmin() && (
                  <Link to="/admin" className="block w-full text-center bg-gray-800 text-white px-5 py-3.5 rounded-xl text-base font-bold hover:bg-gray-900 transition">Dashboard Admin</Link>
                )}
                {!user && (
                  <Link to="/connexion" className="block w-full text-center bg-gray-800 text-white px-5 py-3.5 rounded-xl text-base font-bold hover:bg-gray-900 transition">Connexion</Link>
                )}
                <a href={`tel:${tel1}`} className="block w-full text-center bg-gray-100 text-gray-700 px-5 py-3.5 rounded-xl text-base font-medium hover:bg-gray-200 transition">Appeler le Cabinet</a>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="h-20 xl:h-24"></div>
    </>
  )
}
