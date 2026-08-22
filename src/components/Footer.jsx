import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext.jsx'

export default function Footer() {
  const { settings } = useSettings()
  const tel1 = (settings.telephone_1 || '+226 45 10 36 36').replace(/\s/g, '')
  const tel2 = (settings.telephone_2 || '+226 50 25 10 10').replace(/\s/g, '')

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-xl font-medium">{settings.horaires_semaine} | {settings.horaires_samedi}</span>
            </div>
            <div className="flex items-center gap-5">
              <a href={`tel:${tel1}`} className="text-white text-xl font-medium hover:underline">Appeler maintenant</a>
              <span className="text-blue-300">|</span>
              <Link to="/rendez-vous" className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-xl font-semibold hover:bg-red-700 transition">Prendre RDV</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden shrink-0">
                <img src="/images/medical.jpeg" alt="Cabinet Saint-Exupéry" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-white font-bold text-xl">SAINT-EXUPÉRY</div>
                <div className="text-gray-400 text-lg">INTERNATIONAL</div>
              </div>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed mb-5">{settings.footer_description}</p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition" aria-label="Facebook">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={`https://wa.me/${settings.whatsapp_numero}`} target="_blank" rel="noreferrer" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition" aria-label="WhatsApp">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-xl mb-6 uppercase tracking-wider">Nos Services</h3>
            <ul className="space-y-3.5">
              <li><Link to="/services" className="text-lg hover:text-blue-400 transition">Médecine Générale</Link></li>
              <li><Link to="/services" className="text-lg hover:text-blue-400 transition">Spécialités Médicales</Link></li>
              <li><Link to="/services" className="text-lg hover:text-blue-400 transition">Urgences Médicales</Link></li>
              <li><Link to="/services" className="text-lg hover:text-blue-400 transition">Transport Médical Aérien</Link></li>
              <li><Link to="/services" className="text-lg hover:text-blue-400 transition">Médecine Aérospatiale</Link></li>
              <li><Link to="/sante-travail" className="text-lg hover:text-blue-400 transition">Santé au Travail</Link></li>
              <li><Link to="/formations" className="text-lg hover:text-blue-400 transition">Formations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-xl mb-6 uppercase tracking-wider">Liens Rapides</h3>
            <ul className="space-y-3.5">
              <li><Link to="/apropos" className="text-lg hover:text-blue-400 transition">À Propos</Link></li>
              <li><Link to="/medecins" className="text-lg hover:text-blue-400 transition">Nos Médecins</Link></li>
              <li><Link to="/campagnes" className="text-lg hover:text-blue-400 transition">Campagnes & Dépistage</Link></li>
              <li><Link to="/actualites" className="text-lg hover:text-blue-400 transition">Actualités</Link></li>
              <li><Link to="/rendez-vous" className="text-lg hover:text-blue-400 transition">Prendre Rendez-vous</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-xl mb-6 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <svg className="w-9 h-9 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <div>
                  <p className="text-lg">{settings.adresse_ligne1}</p>
                  <p className="text-lg">{settings.adresse_ligne2}</p>
                  <p className="text-lg text-gray-500">{settings.adresse_pays}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-9 h-9 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <div>
                  <a href={`tel:${tel1}`} className="text-lg hover:text-blue-400 transition block">{settings.telephone_1}</a>
                  <a href={`tel:${tel2}`} className="text-lg hover:text-blue-400 transition block">{settings.telephone_2}</a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-9 h-9 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <a href={`https://wa.me/${settings.whatsapp_numero}?text=Bonjour, je souhaite obtenir des informations`} target="_blank" rel="noreferrer" className="text-lg hover:text-green-400 transition">WhatsApp Médecin</a>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-9 h-9 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href={`mailto:${settings.email_contact}`} className="text-lg hover:text-blue-400 transition">{settings.email_contact}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-lg text-gray-500">&copy; {new Date().getFullYear()} Cabinet Médical Saint-Exupéry International. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-lg text-gray-500">
              <span>{settings.adresse_ligne1}, {settings.adresse_pays}</span>
              <span className="text-gray-700">|</span>
              <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
