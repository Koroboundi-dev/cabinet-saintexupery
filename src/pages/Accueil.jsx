import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { formatDateFr, limit, imageSrc } from '../utils/format.js'

export default function Accueil() {
  const [data, setData] = useState(null)
  const settings = useSettings().settings

  useEffect(() => {
    document.title = 'Cabinet Médical Saint-Exupéry International | Médecine, Urgences, Prévention'
    api.get('/accueil').then(setData).catch(() => setData({ services: [], medecins: [], campagnes: [], actualites: [], formations: [] }))
  }, [])

  const heroImage = imageSrc(settings.hero_image) || '/images/medical10.png'

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center fade-in" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-1 gap-12 items-center">
            <div className="text-center max-w-3xl mx-auto">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                dangerouslySetInnerHTML={{ __html: (settings.hero_titre || 'Cabinet Médical<br>Saint-Exupéry<br>International').replace(/\n/g, '<br>') }}
              />
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">{settings.hero_soustitre}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
                <Link to="/rendez-vous" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-50 shadow-xl shadow-black/10 transition-all hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Prendre Rendez-vous
                </Link>
                <a href={`https://wa.me/${settings.whatsapp_numero}?text=Bonjour, je souhaite obtenir des informations`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-green-600 shadow-xl shadow-black/10 transition-all hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Contacter via WhatsApp
                </a>
              </div>

              <div className="flex flex-wrap gap-6 text-white/70 text-sm justify-center">
                <a href={`tel:${(settings.telephone_1 || '').replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {settings.telephone_1}
                </a>
                <a href={`tel:${(settings.telephone_2 || '').replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {settings.telephone_2}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 80C1248 70 1344 50 1392 40L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* TROIS PILIERS */}
      <section className="bg-gray-50 py-16 lg:py-20 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Notre Mission</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">Trois piliers fondamentaux au service de votre santé</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover text-center">
                <div className="w-full h-64 rounded-2xl overflow-hidden mx-auto mb-6 bg-blue-50">
                  <img src={imageSrc(settings[`pilier${i}_image`])} alt={`Pilier ${settings[`pilier${i}_titre`]}`} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{settings[`pilier${i}_titre`]}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{settings[`pilier${i}_texte`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {data?.services?.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">Nos Services</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Une prise en charge complète</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Du consultation générale au transport médical aérien, nous couvrons l'ensemble de vos besoins de santé.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {data.services.map((service) => (
                <Link key={service.id} to={`/services/${service.slug}`} className="group bg-gray-50 rounded-2xl p-7 border border-gray-100 card-hover">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${service.couleur}15` }}>
                    <svg className="w-6 h-6" style={{ color: service.couleur }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition mb-2">{service.nom}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{limit(service.description, 120)}</p>
                  <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                    En savoir plus
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/services" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition">
                Voir tous nos services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SANTÉ AU TRAVAIL */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/10 text-blue-300 text-base font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">Entreprises & Organisations</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">{settings.st_titre}</h2>
              <p className="text-gray-300 text-xl leading-relaxed mb-8">{settings.st_texte}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Visites médicales', 'Prévention des risques', 'Formations 1ers secours', 'Bilans de santé'].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-base text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
              <Link to="/sante-travail" className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all">
                Demander une offre
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="grid grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/10 rounded-2xl p-5 text-center">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mx-auto mb-4">
                        <img src={imageSrc(settings[`st_cat${i}_image`])} alt={settings[`st_cat${i}_titre`]} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-white text-2xl font-extrabold">{settings[`st_cat${i}_titre`]}</div>
                      <div className="text-gray-400 text-lg mt-1">{settings[`st_cat${i}_soustitre`]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      {data?.actualites?.length > 0 && (
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">Actualités</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Restez informé</h2>
              <p className="text-gray-600">Les dernières nouvelles du cabinet</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {data.actualites.map((actualite) => (
                <Link key={actualite.id} to={`/actualites/${actualite.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-2">{formatDateFr(actualite.created_at)}</div>
                    <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-700 transition">{actualite.titre}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{limit(actualite.resume ?? actualite.contenu, 120)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCALISATION */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Nous Trouver</h2>
            <p className="text-gray-600">{settings.adresse_ligne1}, {settings.adresse_ligne2}, {settings.adresse_pays}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-200 rounded-2xl h-80 lg:h-96 overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.0!2d-1.5!3d12.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIyJzEyLjAiTiAxwrAzMCcwMC4wIlc!5e0!3m2!1sfr!2sbf!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Carte"></iframe>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Adresse</h4>
                    <p className="text-sm text-gray-600">{settings.adresse_ligne1}<br />{settings.adresse_ligne2}<br />{settings.adresse_pays}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Horaires</h4>
                    <p className="text-sm text-gray-600">{settings.horaires_semaine}<br />{settings.horaires_samedi}<br />{settings.horaires_dimanche}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Contact</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <a href={`tel:${(settings.telephone_1 || '').replace(/\s/g, '')}`} className="block hover:text-blue-600 transition">{settings.telephone_1}</a>
                      <a href={`tel:${(settings.telephone_2 || '').replace(/\s/g, '')}`} className="block hover:text-blue-600 transition">{settings.telephone_2}</a>
                      <a href={`https://wa.me/${settings.whatsapp_numero}`} target="_blank" rel="noreferrer" className="block text-green-600 hover:text-green-700 transition">WhatsApp Médecin</a>
                    </div>
                  </div>
                </div>
              </div>

              <a href={`https://wa.me/${settings.whatsapp_numero}?text=Bonjour, j'ai besoin d'aide pour me rendre au cabinet`} target="_blank" rel="noreferrer" className="block text-center bg-green-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-600 transition">
                Besoin d'aide pour nous trouver ? WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
