import React, { useState } from 'react';
import { CATEGORIES_DATA } from '@/components/Categorie_type/donnee/categories';
import Header from '@/components/Categorie_type/Header';
import CategoryFilter from '@/components/Categorie_type/donnee/CategoryFilter';
import SubcategoryGrid from '@/components/Categorie_type/donnee/SubcategoryGrid';

const PageCategorie = () => {
    const [activeCategory, setActiveCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryChange = (name) => {
        setActiveCategory(activeCategory === name ? '' : name);
    };

    const handleSubcategoryClick = (subcategory) => {
        console.log('Sous-catégorie sélectionnée:', subcategory);
    };

    const getDisplayedSubcategories = () => {
        if (!activeCategory) return CATEGORIES_DATA['Transport'].subcategories;
        return CATEGORIES_DATA[activeCategory]?.subcategories || [];
    };

    const filteredSubcategories = getDisplayedSubcategories().filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
            <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

            <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <CategoryFilter
                categories={CATEGORIES_DATA}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />
            <div className="p-4">
                <SubcategoryGrid
                    subcategories={filteredSubcategories}
                    onSubcategoryClick={handleSubcategoryClick}
                />
            </div>
        </div>
    );
};

export default PageCategorie;
