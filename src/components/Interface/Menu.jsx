// src/components/interface/Menu.jsx
import React from 'react';

const MobileMenu = ({ categories, selected, onSelect }) => {
    return (
        <div className="fixed top-0 left-0 right-0 bg-white shadow z-50 h-16 flex items-center overflow-x-auto px-3 space-x-3">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat)}
                    className={`text-sm whitespace-nowrap px-3 py-1 rounded-full border ${selected?.id === cat.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    {cat.nom}
                </button>
            ))}
        </div>
    );
};

export default MobileMenu;
