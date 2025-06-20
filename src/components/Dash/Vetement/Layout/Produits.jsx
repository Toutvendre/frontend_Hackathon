import React, { useState } from 'react';
import OverformProduit from '@/components/Dash/Vetement/Layout/OverformProduit';
import { Plus, Package, Shirt, TrendingUp } from 'lucide-react';

const Produits = () => {
    const [modalOuvert, setModalOuvert] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Header avec fond orange dégradé */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-8 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Shirt className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold">Liste des produits Vêtement</h1>
                        </div>
                        <p className="text-orange-100 text-lg">
                            Gérez ici les vêtements en stock ou à publier.
                        </p>
                    </div>
                    <button
                        onClick={() => setModalOuvert(true)}
                        className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un produit
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="px-6 py-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border-2 border-orange-100 rounded-xl p-6 hover:border-orange-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Produits</p>
                                <p className="text-2xl font-bold text-black mt-1">124</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-orange-100 rounded-xl p-6 hover:border-orange-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">En Stock</p>
                                <p className="text-2xl font-bold text-black mt-1">89</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-orange-100 rounded-xl p-6 hover:border-orange-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Rupture de Stock</p>
                                <p className="text-2xl font-bold text-black mt-1">35</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OverformProduit ouvert={modalOuvert} onFermer={() => setModalOuvert(false)} />
        </div>
    );
};

export default Produits;