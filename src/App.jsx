import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthProvider';
import { ToastProvider } from '@/components/Toast/ToastContext';
import { CartProvider } from '@/utils/CartContext';

import Intro from './page/intro';
import Home from './page/Accueil/Home';
import Cart from './components/Interface/Cart';
import Inscription from './page/Inscription';
import Conneter from './page/Connecter';
import DashboardVetement from './page/Dashbord/vetement/DashboardVetement';
import DashboardRestaurant from './page/Dashbord/restaurant/DashboardRestaurant';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider> {/* ✅ Fournit le contexte du panier à tous les composants */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Intro />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/login" element={<Conneter />} />
              <Route path="/accueil" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard/vetement/*" element={<DashboardVetement />} />
              <Route path="/dashboard/restaurant/*" element={<DashboardRestaurant />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
