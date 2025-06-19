import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Shirt,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    Bell,
    User,
    Menu,
    X
} from 'lucide-react';

const SidebarVetementMobile = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menusHaut = [
        { label: 'Accueil', shortLabel: 'Home', icon: LayoutDashboard, path: '/dashboard/vetement', color: 'from-blue-500 to-blue-600' },
        { label: 'Produits', shortLabel: 'Products', icon: Package, path: '/dashboard/vetement/produits', color: 'from-purple-500 to-purple-600' },
        { label: 'Commandes', shortLabel: 'Orders', icon: ShoppingCart, path: '/dashboard/vetement/commandes', color: 'from-green-500 to-green-600' },
    ];

    const menusBas = [
        { label: 'Paramètres', shortLabel: 'Config', icon: Settings, path: '/dashboard/vetement/parametres', color: 'from-gray-500 to-gray-600' },
        { label: 'Notifications', shortLabel: 'Notifs', icon: Bell, path: '/dashboard/vetement/notifications', color: 'from-red-500 to-red-600', badge: 3 },
    ];

    const handleRouteClick = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
        console.log(`Navigation vers: ${path}`);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="relative">
            {/* Overlay optimisé */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Menu coulissant - Design mobile-first */}
            <div className={`fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out z-50 ${mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
                }`}>

                {/* Handle amélioré */}
                <div className="flex justify-center pt-4 pb-3">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                <div className="px-5 pb-8 max-h-[85vh] overflow-y-auto">
                    {/* Header boutique */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-2xl shadow-sm">
                                <Shirt className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">Ma Boutique</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Gestion des vêtements</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition-all duration-200 active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Menu principal - Cards optimisées */}
                    <div className="py-6">
                        <h4 className="px-1 mb-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Menu Principal
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {menusHaut.map((menu, i) => {
                                const IconComponent = menu.icon;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleRouteClick(menu.path)}
                                        className={`p-5 rounded-2xl transition-all duration-300 transform active:scale-95 ${isActive(menu.path)
                                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${isActive(menu.path)
                                            ? 'bg-white/20 backdrop-blur-sm'
                                            : `bg-gradient-to-r ${menu.color} shadow-sm`
                                            }`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold block leading-tight">{menu.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Menu secondaire - Liste optimisée */}
                    <div className="py-4">
                        <h4 className="px-1 mb-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Options
                        </h4>
                        <div className="space-y-3">
                            {menusBas.map((menu, i) => {
                                const IconComponent = menu.icon;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleRouteClick(menu.path)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 transform active:scale-98 ${isActive(menu.path)
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                                            : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive(menu.path)
                                                ? 'bg-white/20 backdrop-blur-sm'
                                                : `bg-gradient-to-r ${menu.color} shadow-sm`
                                                }`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            {menu.badge && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm">
                                                    {menu.badge}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-semibold flex-1 text-left">{menu.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Profil utilisateur - Design amélioré */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="bg-gradient-to-r from-purple-500 to-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                MB
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-lg">Ma Boutique</p>
                                <p className="text-sm text-gray-500 truncate mt-0.5">boutique@example.com</p>
                            </div>
                            <button className="p-3 rounded-xl hover:bg-gray-200 text-gray-500 transition-all duration-200 active:scale-95">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre de navigation - Mobile-first responsive */}
            <div className="fixed bottom-0 inset-x-0 h-20 bg-white border-t border-gray-100 z-40 safe-area-pb">
                <div className="flex items-center justify-between h-full px-3">

                    {/* Navigation items avec couleur de bouton seulement */}
                    <button
                        onClick={() => handleRouteClick('/dashboard/vetement')}
                        className="flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1 max-w-[70px] text-gray-400 hover:text-gray-600"
                    >
                        <LayoutDashboard className={`w-6 h-6 mb-1 flex-shrink-0 ${isActive('/dashboard/vetement') ? 'text-orange-500' : ''}`} />
                        <span className={`text-xs font-medium truncate w-full text-center leading-tight ${isActive('/dashboard/vetement') ? 'text-orange-500' : ''}`}>Accueil</span>
                    </button>

                    <button
                        onClick={() => handleRouteClick('/dashboard/vetement/produits')}
                        className="flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1 max-w-[70px] text-gray-400 hover:text-gray-600"
                    >
                        <Package className={`w-6 h-6 mb-1 flex-shrink-0 ${isActive('/dashboard/vetement/produits') ? 'text-orange-500' : ''}`} />
                        <span className={`text-xs font-medium truncate w-full text-center leading-tight ${isActive('/dashboard/vetement/produits') ? 'text-orange-500' : ''}`}>Produits</span>
                    </button>

                    {/* Bouton central - Design amélioré */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-4 -mt-3 shadow-2xl active:scale-95 transition-all duration-200 mx-2 flex-shrink-0"
                    >
                        <Menu className={`w-7 h-7 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} />
                    </button>

                    <button
                        onClick={() => handleRouteClick('/dashboard/vetement/commandes')}
                        className="flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 relative min-w-0 flex-1 max-w-[70px] text-gray-400 hover:text-gray-600"
                    >
                        <ShoppingCart className={`w-6 h-6 mb-1 flex-shrink-0 ${isActive('/dashboard/vetement/commandes') ? 'text-orange-500' : ''}`} />
                        <span className={`text-xs font-medium truncate w-full text-center leading-tight ${isActive('/dashboard/vetement/commandes') ? 'text-orange-500' : ''}`}>Orders</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                    </button>

                    <button
                        onClick={() => handleRouteClick('/dashboard/vetement/parametres')}
                        className="flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1 max-w-[70px] text-gray-400 hover:text-gray-600"
                    >
                        <Settings className={`w-6 h-6 mb-1 flex-shrink-0 ${isActive('/dashboard/vetement/parametres') ? 'text-orange-500' : ''}`} />
                        <span className={`text-xs font-medium truncate w-full text-center leading-tight ${isActive('/dashboard/vetement/parametres') ? 'text-orange-500' : ''}`}>Config</span>
                    </button>
                </div>
            </div>

            {/* Safe area pour les appareils avec encoche */}
            <div className="h-20"></div>
        </div>
    );
};

export default SidebarVetementMobile;