import React from 'react';

const MobileMenu = ({ categories, selected, onSelect }) => {
    return (
        <div className="bg-white shadow-md z-50 h-16 flex items-center overflow-x-auto px-4 space-x-3 border-b border-gray-100">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat)}
                    className={`text-sm font-medium whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 shadow-sm
            ${selected?.id === cat.id
                            ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {cat.nom}
                </button>
            ))}
        </div>
    );
};

export default MobileMenu;