import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Tag, Search, UserCircle, ChevronLeft } from 'lucide-react';
import MobileMenu from '@/components/Interface/Menu';
import CategoryCard from '@/components/Interface/CategoryCard';
import ProductCard from '@/components/Interface/ProductCard';
import LoadingSpinner from '@/components/Interface/LoadingSpinner';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/utils/CartContext';

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

  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md">
        <div className="pt-16 pb-6 px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                <span className="text-white">Assistant</span>{' '}
                <span className="text-orange-100">Digitale</span>
              </h1>
              <p className="text-orange-100 text-sm sm:text-base mt-1">
                Explorez notre collection de produits tendance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-md rounded-xl text-white shadow-md transition-all duration-200 group"
                title="Mon panier"
              >
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-sm font-medium">Panier</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-md rounded-xl shadow-md transition-all duration-200 group"
                title="Mon compte"
              >
                <UserCircle size={22} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-sm font-medium">Compte</span>
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="w-full">
            <div className="relative max-w-4xl mx-auto">
              <div className="flex bg-white rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-white border-opacity-30">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit, une marque, une catégorie..."
                    className="w-full px-6 py-3 text-gray-700 text-base focus:outline-none bg-transparent placeholder-gray-400"
                  />
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2">
                  <Search size={18} />
                  <span className="hidden sm:inline">Rechercher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu principal - affiché uniquement si aucune catégorie sélectionnée */}
      {!selectedCategorie && (
        <MobileMenu
          categories={typeCategories}
          selected={selectedCategorie}
          onSelect={(cat) => {
            setSelectedCategorie(cat);
            setSelectedVetementCategorie(null);
            setSelectedVetementSousCategorie(null);
          }}
        />
      )}

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Section de sélection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Tag className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                {selectedCategorie ? selectedCategorie.nom : 'Sélectionnez une catégorie'}
              </h2>
              <p className="text-gray-500 text-sm">
                {selectedCategorie ? 'Catégorie sélectionnée' : 'Choisissez une catégorie pour commencer'}
              </p>
            </div>
          </div>

          {/* Retour */}
          {(selectedVetementCategorie || selectedCategorie) && (
            <button
              onClick={() => {
                if (selectedVetementSousCategorie) {
                  setSelectedVetementSousCategorie(null);
                } else if (selectedVetementCategorie) {
                  setSelectedVetementCategorie(null);
                } else {
                  setSelectedCategorie(null);
                }
              }}
              className="flex items-center text-sm text-orange-600 hover:underline mb-4"
            >
              <ChevronLeft size={18} className="mr-1" />
              Retour
            </button>
          )}

          {/* Loading / error */}
          {loadingCategories && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}
          {errorCategories && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Erreur lors du chargement des catégories</p>
              <p className="text-sm">{errorCategories}</p>
            </div>
          )}

          {/* Étapes : catégorie vêtements -> sous-catégorie */}
          {/* Étapes : catégorie vêtements -> sous-catégorie */}
          {selectedCategorie?.nom === 'Vêtement' && (
            <>
              {/* Scroll horizontal des catégories vêtements */}
              {!selectedVetementCategorie && (
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-2">
                    {categoriesVetement.map((cat) => (
                      <div key={cat.id} className="min-w-[10rem]">
                        <CategoryCard
                          name={cat.nom}
                          onClick={() => setSelectedVetementCategorie(cat)}
                          isSelected={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scroll horizontal des sous-catégories */}
              {selectedVetementCategorie && (
                <div className="overflow-x-auto mt-4">
                  <div className="flex space-x-4 pb-2">
                    {sousCategories.map((sousCat) => (
                      <div key={sousCat.id} className="min-w-[10rem]">
                        <CategoryCard
                          name={sousCat.nom}
                          onClick={() => setSelectedVetementSousCategorie(sousCat)}
                          isSelected={selectedVetementSousCategorie?.id === sousCat.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Section Produits */}
        {selectedVetementSousCategorie && (
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black">Produits</h3>
                  <p className="text-gray-500 text-sm">
                    {selectedVetementSousCategorie.nom}
                  </p>
                </div>
              </div>
            </div>

            {loadingProducts && (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {errorProducts && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                <p className="font-medium">Erreur lors du chargement des produits</p>
                <p className="text-sm">{errorProducts}</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="transform transition-transform hover:scale-105">
                    <ProductCard
                      id={product.id}
                      name={product.nom}
                      price={product.prix}
                      image={product.image}
                      rating={4.5}
                      compagnie_id={product.compagnie_id}
                    />
                  </div>
                ))}
              </div>
            )}

            {!loadingProducts && !errorProducts && products.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun produit disponible</h4>
                <p className="text-gray-500">
                  Il n'y a pas encore de produits dans cette catégorie.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
