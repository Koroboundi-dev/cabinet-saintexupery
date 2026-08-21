import { useEffect } from 'react'

export default function APropos() {
  useEffect(() => {
    document.title = 'À Propos | Cabinet Saint-Exupéry International'
  }, [])

  return (
    <>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">À Propos du Cabinet</h1>
          <p className="text-blue-100 text-sm max-w-xl">Découvrez notre mission et nos engagements envers la santé au Burkina Faso.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cabinet Médical Saint-Exupéry International</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Le Cabinet Médical Saint-Exupéry International est un établissement de santé de référence situé dans le quartier Ouaga 2000, Extension Sud, à Ouagadougou, Burkina Faso. Nous offrons des services médicaux complets allant de la médecine générale aux spécialités médicales, en passant par les urgences, l'assistance médicale et le transport médical aérien.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Notre cabinet se distingue par son approche globale de la santé, combinant soins médicaux, prévention par le dépistage et la vaccination, ainsi que la formation aux premiers secours.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">Nos Domaines d'Expertise</h2>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              {[
                'Médecine Générale et Spécialités',
                'Urgences médicales',
                "Assistance médicale et transport médical aérien",
                'Médecine aérospatiale',
                'Santé au travail pour entreprises et organisations',
                'Formations certifiées aux premiers secours',
                'Campagnes de dépistage et de prévention',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">Notre Engagement</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nous croyons que chaque personne mérite un accès à des soins de qualité. C'est pourquoi nous nous engageons à offrir des services médicaux accessibles, professionnels et adaptés aux réalités de notre environnement au Burkina Faso et en Afrique de l'Ouest.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
