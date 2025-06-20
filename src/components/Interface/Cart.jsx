import React, { useState } from 'react';
import api from '@/utils/axiosConfig';
import { useCart } from '@/utils/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [step, setStep] = useState('cart'); // cart, form, otp, success
    const [formData, setFormData] = useState({
        client_nom: '',
        client_telephone: '',
        livraison: false,
        adresse_livraison: '',
        notes: '',
    });
    const [otp, setOtp] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [commandeId, setCommandeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmitCommande = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (cart.length === 0) throw new Error('Votre panier est vide.');

            const item = cart[0]; // gestion d'un seul produit pour simplifier

            const response = await api.post('/commandes/vetement', {
                produit_id: item.id,
                compagnie_id: item.compagnie_id,
                quantite: item.quantity,
                ...formData,
            });

            setSuccess(response.data.message);
            setTransactionId(response.data.transaction.id);
            setCommandeId(response.data.commande.id);
            setStep('otp');
        } catch (err) {
            setError(
                err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || 'Erreur lors de la commande.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post(`/commandes/vetement/transaction/${transactionId}/verifier-otp`, { otp });
            setSuccess(response.data.message);
            clearCart();
            setStep('success');
        } catch (err) {
            setError(
                err.response?.data?.error
                || err.response?.data?.message
                || err.message
                || 'Erreur lors de la vérification de l\'OTP.'
            );
        } finally {
            setLoading(false);
        }
    };
    const handleReset = () => {
        setStep('cart');
        setFormData({
            client_nom: '',
            client_telephone: '',
            livraison: false,
            adresse_livraison: '',
            notes: '',
        });
        setOtp('');
        setTransactionId(null);
        setCommandeId(null);
        setError(null);
        setSuccess(null);
    };

    if (cart.length === 0 && step === 'cart') {
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Panier</h2>
                <p>Votre panier est vide.</p>
                <Link to="/" className="text-blue-500 underline">Retourner aux produits</Link>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Panier</h2>

            {step === 'cart' && (
                <div>
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b py-2">
                            <div className="flex items-center">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p>{item.price} € x {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                    className="w-16 p-1 border rounded"
                                />
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Total : {totalPrice.toFixed(2)} €</p>
                        <button
                            onClick={() => setStep('form')}
                            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Passer la commande
                        </button>
                    </div>
                </div>
            )}

            {step === 'form' && (
                <form onSubmit={handleSubmitCommande} className="mt-2 space-y-2">
                    <div>
                        <label className="block mb-1">Nom :</label>
                        <input
                            type="text"
                            name="client_nom"
                            value={formData.client_nom}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Téléphone (Orange Money) :</label>
                        <input
                            type="tel"
                            name="client_telephone"
                            value={formData.client_telephone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="livraison"
                                checked={formData.livraison}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Livraison
                        </label>
                    </div>
                    {formData.livraison && (
                        <div>
                            <label className="block mb-1">Adresse de livraison :</label>
                            <textarea
                                name="adresse_livraison"
                                value={formData.adresse_livraison}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block mb-1">Notes (optionnel) :</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <p className="text-sm text-gray-600">Paiement via Orange Money</p>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Envoi...' : 'Confirmer la commande'}
                    </button>
                </form>
            )}

            {step === 'otp' && (
                <form onSubmit={handleSubmitOtp} className="mt-2 space-y-2">
                    <div>
                        <label className="block mb-1">Entrez l'OTP reçu sur votre numéro Orange Money :</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Vérification...' : 'Valider le paiement'}
                    </button>
                </form>
            )}

            {step === 'success' && (
                <div className="mt-2">
                    <p className="text-green-500">{success}</p>
                    <a
                        href={`/api/commandes/vetement/${commandeId}/recepisse`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        Télécharger le reçu
                    </a>
                    <button
                        onClick={handleReset}
                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2"
                    >
                        Nouvelle commande
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;