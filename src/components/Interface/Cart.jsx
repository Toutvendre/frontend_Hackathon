import React, { useState, useRef } from 'react';
import { ShoppingCart, User, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Package, Truck, MapPin, FileText, Download, RotateCcw, Phone, MessageSquare, Home, Menu, X } from 'lucide-react';
import api from '@/utils/axiosConfig';
import { useCart } from '@/utils/CartContext';
import Receipt from './Receipt';
import html2pdf from 'html2pdf.js';
import LivraisonMap from './LivraisonMap';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [step, setStep] = useState('cart'); // cart, form, otp, success
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        client_nom: '',
        client_telephone: '',
        livraison: false,
        adresse_livraison: '',
        notes: '',
    });
    const [otp, setOtp] = useState('');
    const [otpDebug, setOtpDebug] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [commandeData, setCommandeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const receiptRef = useRef();

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Configuration des étapes
    const steps = [
        { id: 'cart', title: 'Mon Panier', icon: ShoppingCart, description: 'Vérifiez vos articles' },
        { id: 'form', title: 'Informations', icon: User, description: 'Vos coordonnées' },
        { id: 'otp', title: 'Paiement', icon: CreditCard, description: 'Validation OTP' },
        { id: 'success', title: 'Confirmé', icon: CheckCircle, description: 'Commande validée' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

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
            const item = cart[0];

            const response = await api.post('/commandes/vetement', {
                produit_id: item.id,
                compagnie_id: item.compagnie_id,
                quantite: item.quantity,
                ...formData,
            });

            setSuccess(response.data.message);
            setTransactionId(response.data.transaction.id);
            setOtpDebug(response.data.transaction.otp);  // <-- ici on récupère bien l'OTP
            setStep('otp');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Erreur lors de la commande.'
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
            setCommandeData(response.data.commande);
            setStep('success');
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Erreur lors de la vérification de l'OTP."
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
        setCommandeData(null);
        setError(null);
        setSuccess(null);
    };

    const handleDownload = () => {
        if (!receiptRef.current) {
            console.error("Le reçu n'est pas prêt.");
            return;
        }

        const opt = {
            margin: 0.5,
            filename: `recu_commande_${commandeData?.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().set(opt).from(receiptRef.current).save();
    };

    const navigateToHome = () => {
        window.location.href = '/accueil'; // Restored original navigation
    };

    // Mobile Header Component
    const MobileHeader = () => (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-lg font-bold">
                    <span className="text-black">Assistant</span>{' '}
                    <span className="text-orange-500">Digitale</span>
                </h1>
            </div>
            <button
                onClick={navigateToHome}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Retour à l'accueil"
            >
                <Home size={20} className="text-gray-600" />
            </button>
        </div>
    );

    // Mobile Menu Component
    const MobileMenu = () => (
        <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? '' : 'hidden'}`}>
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-50' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)} />
            <div className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">Menu</h2>
                </div>
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => {
                            navigateToHome();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        aria-label="Accueil"
                    >
                        <Home size={20} className="mr-3 text-gray-600" />
                        <span>Accueil</span>
                    </button>
                    <button
                        onClick={() => {
                            setStep('cart');
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        aria-label="Mon Panier"
                    >
                        <ShoppingCart size={20} className="mr-3 text-gray-600" />
                        <span>Mon Panier</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // Composant Stepper - Amélioré pour mobile
    const StepperComponent = () => (
        <div className="mb-6 lg:mb-8">
            {/* Version Desktop */}
            <div className="hidden md:flex items-center justify-between mb-4">
                {steps.map((stepItem, index) => {
                    const StepIcon = stepItem.icon;
                    const isActive = step === stepItem.id;
                    const isCompleted = index < currentStepIndex;
                    const isAccessible = index <= currentStepIndex;

                    return (
                        <div key={stepItem.id} className="flex flex-col items-center flex-1 relative">
                            <div className={`
                                relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                                ${isActive ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg' :
                                    isCompleted ? 'bg-green-500 text-white' :
                                        isAccessible ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'}
                            `}>
                                <StepIcon size={20} />
                                {isCompleted && <CheckCircle size={16} className="absolute -top-1 -right-1 bg-white rounded-full text-green-500" />}
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-medium ${isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                    {stepItem.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 hidden lg:block">{stepItem.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`
                                    absolute top-6 left-1/2 h-0.5 transition-all duration-300 z-0
                                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                                `} style={{
                                        transform: 'translateX(50%)',
                                        width: 'calc(100vw / 4 - 48px)',
                                        maxWidth: '200px'
                                    }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Version Mobile */}
            <div className="md:hidden">
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">{currentStepIndex + 1}</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{steps[currentStepIndex]?.title}</p>
                            <p className="text-xs text-gray-500">{steps[currentStepIndex]?.description}</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {currentStepIndex + 1} / {steps.length}
                    </div>
                </div>
                <div className="flex space-x-1 mb-4">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-2 rounded-full transition-colors duration-300 ${index <= currentStepIndex ? 'bg-orange-500' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    if (cart.length === 0 && step === 'cart') {
        return (
            <div className="min-h-screen bg-gray-50">
                <MobileHeader />
                <MobileMenu />

                <div className="container mx-auto px-4 py-6 lg:py-8">
                    {/* Header Desktop */}
                    <div className="hidden lg:flex items-center justify-between mb-8">
                        <div className="text-center flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                                <span className="text-black">Assistant</span>{' '}
                                <span className="text-orange-500">Digitale</span>
                            </h1>
                            <p className="text-gray-500">Votre panier est vide</p>
                        </div>
                        <button
                            onClick={navigateToHome}
                            className="hidden lg:flex items-center px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            aria-label="Retour à l'accueil"
                        >
                            <Home size={20} className="mr-2" />
                            Accueil
                        </button>
                    </div>

                    <div className="max-w-md mx-auto text-center">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingCart size={32} className="lg:w-10 lg:h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Votre panier est vide</h2>
                        <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                        <button
                            onClick={navigateToHome}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-700 transition-all duration-200 shadow-lg"
                            aria-label="Voir nos produits"
                        >
                            <Package className="mr-2" size={18} />
                            Voir nos produits
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <MobileHeader />
            <MobileMenu />

            <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
                {/* Header Desktop */}
                <div className="hidden lg:flex items-center justify-between mb-8">
                    <div className="text-center flex-1">
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="text-black">Assistant</span>{' '}
                            <span className="text-orange-500">Digitale</span>
                        </h1>
                        <p className="text-gray-500">Finalisez votre commande</p>
                    </div>
                    <button
                        onClick={navigateToHome}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        aria-label="Retour à l'accueil"
                    >
                        <Home size={20} className="mr-2" />
                        Accueil
                    </button>
                </div>

                {/* Stepper */}
                <StepperComponent />

                {/* Contenu des étapes */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Étape 1: Panier */}
                    {step === 'cart' && (
                        <div className="p-4 lg:p-6">
                            <div className="flex items-center mb-4 lg:mb-6">
                                <ShoppingCart className="text-orange-500 mr-3" size={20} />
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Récapitulatif de votre panier</h2>
                            </div>

                            <div className="space-y-3 lg:space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 sm:space-y-0"
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}${item.image}`}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                                <p className="text-orange-600 font-medium text-sm">
                                                    {item.price.toLocaleString()} FCFA x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end space-x-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="px-3 py-1 text-gray-600 hover:text-orange-600 transition-colors"
                                                    aria-label={`Diminuer la quantité de ${item.name}`}
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1 border-l border-r border-gray-200 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 text-gray-600 hover:text-orange-600 transition-colors"
                                                    aria-label={`Augmenter la quantité de ${item.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                                aria-label={`Supprimer ${item.name} du panier`}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-semibold text-gray-800">Total :</span>
                                    <span className="text-xl lg:text-2xl font-bold text-orange-600">{totalPrice.toLocaleString()} FCFA</span>
                                </div>
                                <button
                                    onClick={() => setStep('form')}
                                    className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 lg:py-4 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-700 transition-all duration-200 shadow-lg flex items-center justify-center"
                                    aria-label="Continuer vers les informations"
                                >
                                    Continuer
                                    <ArrowRight className="ml-2" size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 2: Formulaire */}
                    {step === 'form' && (
                        <div className="p-4 lg:p-6">
                            <div className="flex items-center mb-4 lg:mb-6">
                                <User className="text-orange-500 mr-3" size={20} />
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Vos informations</h2>
                            </div>

                            <form onSubmit={handleSubmitCommande} className="space-y-4 lg:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User size={16} className="inline mr-2" />
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            name="client_nom"
                                            placeholder="Votre nom complet"
                                            required
                                            value={formData.client_nom}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            aria-required="true"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone size={16} className="inline mr-2" />
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="client_telephone"
                                            placeholder="Votre numéro de téléphone"
                                            required
                                            value={formData.client_telephone}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            aria-required="true"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <label className="flex items-start cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="livraison"
                                            checked={formData.livraison}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
                                            aria-checked={formData.livraison}
                                        />
                                        <div className="ml-3">
                                            <div className="flex items-center">
                                                <Truck size={16} className="mr-2 text-orange-500" />
                                                <span className="font-medium text-gray-800">Demander une livraison</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">Nous livrerons directement à votre adresse</p>
                                        </div>
                                    </label>
                                </div>

                                {formData.livraison && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <MapPin size={16} className="inline mr-2" />
                                                Adresse de livraison *
                                            </label>
                                            <textarea
                                                name="adresse_livraison"
                                                placeholder="Votre adresse complète de livraison"
                                                required
                                                rows={3}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none bg-gray-100"
                                                value={formData.adresse_livraison}
                                                readOnly
                                                aria-required="true"
                                            />
                                        </div>

                                        <LivraisonMap
                                            livraison={formData.livraison}
                                            onLocationChange={(coords) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    adresse_livraison: coords?.formatted || ''
                                                }));
                                            }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MessageSquare size={16} className="inline mr-2" />
                                        Notes supplémentaires
                                    </label>
                                    <textarea
                                        name="notes"
                                        placeholder="Des instructions particulières ?"
                                        rows={3}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                                        value={formData.notes}
                                        onChange={handleChange}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="text-green-600 text-sm">{success}</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep('cart')}
                                        className="flex-1 order-2 sm:order-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                                        aria-label="Retour au panier"
                                    >
                                        <ArrowLeft className="mr-2" size={20} />
                                        Retour
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 sm:flex-2 order-1 sm:order-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-700 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
                                        aria-label="Confirmer la commande"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Envoi...
                                            </>
                                        ) : (
                                            <>
                                                Confirmer la commande
                                                <ArrowRight className="ml-2" size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Étape 3: OTP */}
                    {step === 'otp' && (
                        <div className="p-4 lg:p-6">
                            <div className="flex items-center mb-4 lg:mb-6">
                                <CreditCard className="text-orange-500 mr-3" size={20} />
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Validation du paiement</h2>
                            </div>

                            <div className="text-center mb-6 lg:mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <CreditCard size={32} className="text-orange-600" />
                                </div>
                                <p className="text-gray-600 mb-2">Un code OTP a été envoyé à votre téléphone</p>
                                <p className="text-sm text-gray-500">Veuillez saisir le code reçu pour finaliser votre commande</p>
                            </div>
                            {/* Affichage OTP debug ici */}
                            {otpDebug && (
                                <div
                                    className="my-4 p-4 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 font-mono text-center select-all cursor-pointer"
                                    title="Cliquez pour copier"
                                    onClick={() => navigator.clipboard.writeText(otpDebug)}
                                >
                                    OTP (debug) : <strong>{otpDebug}</strong>
                                </div>
                            )}

                            <form onSubmit={handleSubmitOtp} className="space-y-4 lg:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                        Code de vérification
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        required
                                        className="w-full p-4 border border-gray-200 rounded-xl text-center text-lg lg:text-2xl font-mono tracking-widest focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="0 0 0 0 0 0"
                                        maxLength={6}
                                        aria-required="true"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Entrez uniquement 6 chiffres</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-600 text-sm text-center">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="text-green-600 text-sm text-center">{success}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 lg:py-4 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-700 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
                                    aria-label="Valider le paiement"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Vérification...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2" size={20} />
                                            Valider le paiement
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Étape 4: Succès */}
                    {step === 'success' && commandeData && (
                        <div className="p-4 lg:p-6">
                            <div className="text-center mb-6 lg:mb-8">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle size={32} className="lg:w-10 lg:h-10 text-green-600" />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h2>
                                <p className="text-green-600 font-medium">{success}</p>
                                <p className="text-gray-500 mt-2">Votre commande a été traitée avec succès</p>
                            </div>

                            <div ref={receiptRef} className="mb-6 lg:mb-8">
                                <Receipt commande={commandeData} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                                <button
                                    onClick={handleDownload}
                                    className="flex-1 order-2 sm:order-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    aria-label="Télécharger le reçu"
                                >
                                    <Download className="mr-2" size={20} />
                                    Télécharger le reçu
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 order-1 sm:order-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-700 transition-all duration-200 shadow-lg flex items-center justify-center"
                                    aria-label="Nouvelle commande"
                                >
                                    <RotateCcw className="mr-2" size={20} />
                                    Nouvelle commande
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;