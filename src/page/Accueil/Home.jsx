import React from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from '@/components/Interface/Menu';
import HorizontalScroll from '@/components/Interface/HorizontalScroll';
import CategoryCard from '@/components/Interface/CategoryCard';
import ProductCard from '@/components/Interface/ProductCard';
import LoadingSpinner from '@/components/Interface/LoadingSpinner';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';

const Home = () => {
  const {
    typeCategories,
    categoriesVetement,
    sousCategories,
    selectedCategorie,
    setSelectedCategorie,
    selectedVetementCategorie,
    setSelectedVetementCategorie,
    selectedVetementSousCategorie,
    setSelectedVetementSousCategorie,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  const { products, loading: loadingProducts, error: errorProducts } = useProducts({
    sous_categorie_id: selectedVetementSousCategorie?.id,
  });

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <MobileMenu
        categories={typeCategories}
        selected={selectedCategorie}
        onSelect={(cat) => {
          setSelectedCategorie(cat);
          setSelectedVetementCategorie(null);
          setSelectedVetementSousCategorie(null);
        }}
      />

      <div className="p-3 mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {selectedCategorie ? `Catégorie : ${selectedCategorie.nom}` : 'Sélectionnez une catégorie'}
          </h2>
          <Link to="/cart" className="bg-blue-500 text-white p-2 rounded">Panier</Link>
        </div>

        {loadingCategories && <LoadingSpinner />}
        {errorCategories && <p className="text-red-500">{errorCategories}</p>}

        {selectedCategorie?.nom === 'Vêtement' && (
          <>
            <HorizontalScroll
              title="Catégories Vêtements"
              items={categoriesVetement}
              renderItem={(cat) => (
                <CategoryCard
                  key={cat.id}
                  name={cat.nom}
                  onClick={() => {
                    setSelectedVetementCategorie(cat);
                    setSelectedVetementSousCategorie(null);
                  }}
                  isSelected={selectedVetementCategorie?.id === cat.id}
                />
              )}
            />
            {selectedVetementCategorie && (
              <HorizontalScroll
                title="Sous-catégories"
                items={sousCategories}
                renderItem={(sousCat) => (
                  <CategoryCard
                    key={sousCat.id}
                    name={sousCat.nom}
                    onClick={() => setSelectedVetementSousCategorie(sousCat)}
                    isSelected={selectedVetementSousCategorie?.id === sousCat.id}
                  />
                )}
              />
            )}
          </>
        )}

        {selectedVetementSousCategorie && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Produits</h3>
            {loadingProducts && <LoadingSpinner />}
            {errorProducts && <p className="text-red-500">{errorProducts}</p>}
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.nom}
                  price={product.prix}
                  image={product.image}
                  rating={4.5} // à ajuster selon disponibilité
                  compagnie_id={product.compagnie_id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
