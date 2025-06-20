import React, { useState } from 'react';
import { useCart } from '../../utils/CartContext';

const ProductCard = ({ id, name, price, image, rating, compagnie_id }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({ id, name, price, image, compagnie_id }, quantity);
        setQuantity(1);
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden relative">
            <div className="p-5">
                <div className="mb-4">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${image}`}
                        alt={name}
                        className="w-full h-48 sm:h-56 object-cover rounded-lg shadow-sm"
                    />
                </div>

                <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-black leading-tight">{name}</h3>
                </div>

                <div className="mb-3">
                    <p className="text-orange-500 font-bold text-xl sm:text-2xl">
                        {price.toLocaleString()} CFA
                    </p>
                </div>

                <div className="mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex text-orange-400">
                            {'★'.repeat(Math.floor(rating))}
                            {'☆'.repeat(5 - Math.floor(rating))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">({rating})</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantité
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-20 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center font-medium"
                        />
                    </div>

                    <div>
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white p-3 rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
