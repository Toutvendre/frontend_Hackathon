import React, { useState } from 'react';
import { useCart } from '../../utils/CartContext'; // ← chemin relatif correct


const ProductCard = ({ id, name, price, image, rating, compagnie_id }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({ id, name, price, image, compagnie_id }, quantity);
        setQuantity(1); // Réinitialiser après ajout
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <img src={image} alt={name} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600">{price} €</p>
            <p className="text-yellow-500">{'★'.repeat(Math.floor(rating))}</p>
            <div className="mt-2 flex items-center space-x-2">
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-16 p-2 border rounded"
                />
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
};

export default ProductCard;