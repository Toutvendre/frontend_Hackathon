import React, { useState } from 'react';
import OverformProduit from '@/components/Dash/Vetement/Layout/OverformProduit';
import { Plus } from 'lucide-react';

const Produits = () => {
    const [modalOuvert, setModalOuvert] = useState(false);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Liste des produits Vêtement</h2>
                    <p>Gérez ici les vêtements en stock ou à publier.</p>
                </div>
                <button
                    onClick={() => setModalOuvert(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un produit
                </button>
            </div>

            <OverformProduit ouvert={modalOuvert} onFermer={() => setModalOuvert(false)} />
        </div>
    );
};

export default Produits;
