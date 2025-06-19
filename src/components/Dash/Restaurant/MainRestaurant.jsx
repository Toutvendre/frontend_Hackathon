import { Routes, Route } from 'react-router-dom';
import AcceuilResto from '@/components/Dash/Restaurant/Layout/AcceuilResto';
import Menus from '@/components/Dash/Restaurant/Layout/Menus';
import Commandes from '@/components/Dash/Restaurant/Layout/Commandes';
import ParametresRestaurant from '@/components/Dash/Restaurant/Layout/ParametresRestaurant';

const MainRestaurant = ({ sidebarEtendue }) => {
    return (
        <main className={`transition-[margin] duration-100 ease-in-out bg-white min-h-screen ${sidebarEtendue ? 'md:ml-64' : 'md:ml-16'} ml-0`}>
            <Routes>
                <Route path="/" element={<AcceuilResto />} />
                <Route path="menus" element={<Menus />} />
                <Route path="commandes" element={<Commandes />} />
                <Route path="parametres" element={<ParametresRestaurant />} />
            </Routes>
        </main>
    );
};

export default MainRestaurant;
