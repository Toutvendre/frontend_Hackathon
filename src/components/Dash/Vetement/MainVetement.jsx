import { Routes, Route } from 'react-router-dom';
import DashAccueilVetement from '@/components/Dash/Vetement/Layout/Acceuil';
import Produits from '@/components/Dash/Vetement/Layout/Produits';
import Commandes from '@/components/Dash/Vetement/Layout/Commandes';
import ParametresVetement from '@/components/Dash/Vetement/Layout/Parametres';

const MainVetement = ({ sidebarEtendue }) => {
    return (
        <main className={`transition-[margin] duration-100 ease-in-out bg-white min-h-screen ${sidebarEtendue ? 'md:ml-64' : 'md:ml-16'} ml-0`}>
            <Routes>
                <Route path="/" element={<DashAccueilVetement />} />
                <Route path="produits" element={<Produits />} />
                <Route path="commandes" element={<Commandes />} />
                <Route path="parametres" element={<ParametresVetement />} />
            </Routes>
        </main>
    );
};

export default MainVetement;
