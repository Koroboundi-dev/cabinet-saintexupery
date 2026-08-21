import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'

import Accueil from './pages/Accueil.jsx'
import APropos from './pages/APropos.jsx'
import Services from './pages/Services.jsx'
import ServiceDetail from './pages/ServiceDetail.jsx'
import Medecins from './pages/Medecins.jsx'
import MedecinDetail from './pages/MedecinDetail.jsx'
import Formations from './pages/Formations.jsx'
import FormationDetail from './pages/FormationDetail.jsx'
import FormationInscription from './pages/FormationInscription.jsx'
import FormationInscriptionConfirmation from './pages/FormationInscriptionConfirmation.jsx'
import Campagnes from './pages/Campagnes.jsx'
import CampagneDetail from './pages/CampagneDetail.jsx'
import CampagneInscription from './pages/CampagneInscription.jsx'
import CampagneInscriptionConfirmation from './pages/CampagneInscriptionConfirmation.jsx'
import Actualites from './pages/Actualites.jsx'
import ActualiteDetail from './pages/ActualiteDetail.jsx'
import Contact from './pages/Contact.jsx'
import SanteTravail from './pages/SanteTravail.jsx'
import RendezVous from './pages/RendezVous.jsx'
import RendezVousConfirmation from './pages/RendezVousConfirmation.jsx'
import Login from './pages/Login.jsx'

import Dashboard from './pages/admin/Dashboard.jsx'
import RendezVousAdmin from './pages/admin/RendezVousAdmin.jsx'
import InscriptionsFormations from './pages/admin/InscriptionsFormations.jsx'
import InscriptionsCampagnes from './pages/admin/InscriptionsCampagnes.jsx'
import ContactsAdmin from './pages/admin/ContactsAdmin.jsx'
import EntreprisesAdmin from './pages/admin/EntreprisesAdmin.jsx'
import SettingsAdmin from './pages/admin/SettingsAdmin.jsx'
import MedecinsAdmin from './pages/admin/MedecinsAdmin.jsx'
import FormationsAdmin from './pages/admin/FormationsAdmin.jsx'
import CampagnesAdmin from './pages/admin/CampagnesAdmin.jsx'

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/connexion" replace />
  if (user.role !== 'admin') return <Navigate to="/connexion" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/apropos" element={<APropos />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/medecins" element={<Medecins />} />
        <Route path="/medecins/:slug" element={<MedecinDetail />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/formations/:slug" element={<FormationDetail />} />
        <Route path="/formations/session/:sessionId/inscription" element={<FormationInscription />} />
        <Route path="/formation-inscription-confirmation" element={<FormationInscriptionConfirmation />} />
        <Route path="/campagnes" element={<Campagnes />} />
        <Route path="/campagnes/:slug" element={<CampagneDetail />} />
        <Route path="/campagne/:id/inscription" element={<CampagneInscription />} />
        <Route path="/campagne-inscription-confirmation" element={<CampagneInscriptionConfirmation />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:slug" element={<ActualiteDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sante-travail" element={<SanteTravail />} />
        <Route path="/rendez-vous" element={<RendezVous />} />
        <Route path="/rendez-vous-confirmation" element={<RendezVousConfirmation />} />
      </Route>

      <Route path="/connexion" element={<Login />} />

      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="rendez-vous" element={<RendezVousAdmin />} />
        <Route path="inscriptions/formations" element={<InscriptionsFormations />} />
        <Route path="inscriptions/campagnes" element={<InscriptionsCampagnes />} />
        <Route path="contacts" element={<ContactsAdmin />} />
        <Route path="entreprises" element={<EntreprisesAdmin />} />
        <Route path="parametres" element={<SettingsAdmin />} />
        <Route path="medecins" element={<MedecinsAdmin />} />
        <Route path="formations" element={<FormationsAdmin />} />
        <Route path="campagnes" element={<CampagnesAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
