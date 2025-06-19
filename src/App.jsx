import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthProvider';
import { ToastProvider } from '@/components/Toast/ToastContext';
import Intro from './page/intro';
import PageCategorie from './page/categorie/PageCategorie';
import Inscription from './page/Inscription';
import Conneter from './page/Connecter';
import DashboardVetement from './page/Dashbord/vetement/DashboardVetement';
import DashboardRestaurant from './page/Dashbord/restaurant/DashboardRestaurant';

function App() {
  return (
    <AuthProvider>
      <ToastProvider> {/* ✅ Encapsulation ici */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/login" element={<Conneter />} />
            <Route path="/categorie" element={<PageCategorie />} />

            <Route path="/dashboard/vetement/*" element={<DashboardVetement />} />
            <Route path="/dashboard/restaurant/*" element={<DashboardRestaurant />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
