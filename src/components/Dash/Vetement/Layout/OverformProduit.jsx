import React, { useState, useCallback, useContext, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle, Shirt, ImagePlus, Tag, DollarSign, Package } from 'lucide-react';
import { AuthContext } from '@/utils/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/utils/axiosConfig';

const OverformProduit = ({ ouvert, onFermer }) => {
    const { isAuthenticated, compagnie } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        stock: '',
        vetement_categorie_id: '',
        vetement_sous_categorie_id: '',
        compagnie_id: '',
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);

    useEffect(() => {
        console.log('État de l\'authentification:', {
            isAuthenticated: isAuthenticated(),
            compagnie,
            compagnie_id: formData.compagnie_id,
        });
    }, [isAuthenticated, compagnie, formData.compagnie_id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories/vetement');
                console.log('Catégories récupérées:', res.data);
                setCategories(res.data);
            } catch (err) {
                console.error('Erreur chargement catégories:', err);
                toast.error('Erreur chargement des catégories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (formData.vetement_categorie_id) {
            const fetchSousCategories = async () => {
                try {
                    const res = await api.get(`/categories/vetement/${formData.vetement_categorie_id}/sous-categories`);
                    console.log('Sous-catégories récupérées:', res.data);
                    setSousCategories(res.data);
                } catch (err) {
                    console.error('Erreur chargement sous-catégories:', err);
                    toast.error('Erreur dans le chargement des sous-catégories');
                }
            };
            fetchSousCategories();
        }
    }, [formData.vetement_categorie_id]);

    useEffect(() => {
        if (compagnie?.id) {
            setFormData((prev) => ({ ...prev, compagnie_id: compagnie.id }));
        }
    }, [compagnie]);

    const onDrop = useCallback((files) => {
        const file = files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) return toast.error('Image > 5MB');
        if (!file.type.startsWith('image/')) return toast.error('Fichier non image');

        setPreviewImage({ file, preview: URL.createObjectURL(file) });
        setFormData((prev) => ({ ...prev, image: file }));
        toast.success('Image ajoutée');
    }, []);

    const handleFileChange = (e) => onDrop(Array.from(e.target.files));

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'prix') {
            formattedValue = value ? parseFloat(value) : '';
        } else if (name === 'stock') {
            formattedValue = value ? parseInt(value, 10) : '';
        } else if (name === 'vetement_categorie_id') {
            formattedValue = value ? parseInt(value, 10) : '';
            setFormData((prev) => ({
                ...prev,
                [name]: formattedValue,
                vetement_sous_categorie_id: '',
            }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const removeImage = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage.preview);
            setPreviewImage(null);
            setFormData((prev) => ({ ...prev, image: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Formulaire soumis avec:', formData);

        try {
            if (!isAuthenticated()) {
                toast.error('Vous devez être connecté');
                setLoading(false);
                return;
            }

            const newErrors = {};
            if (!formData.nom.trim()) newErrors.nom = 'Nom requis';
            if (!formData.prix) newErrors.prix = 'Prix requis';
            if (!formData.vetement_categorie_id) newErrors.vetement_categorie_id = 'Catégorie requise';
            if (!formData.stock) newErrors.stock = 'Stock requis';
            if (!formData.vetement_sous_categorie_id) newErrors.vetement_sous_categorie_id = 'Sous-catégorie requise';
            if (!formData.compagnie_id) newErrors.compagnie_id = 'Compagnie requise';

            if (Object.keys(newErrors).length > 0) {
                console.log('Erreurs de validation:', newErrors);
                toast.error('Champs requis manquants');
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            const data = new FormData();
            for (const [key, val] of Object.entries(formData)) {
                if (val !== null && val !== '') data.append(key, val);
            }
            console.log('FormData envoyé:', Array.from(data.entries()));

            const response = await api.post('/vetement-produits', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Réponse du serveur:', response.data);

            toast.success('Produit créé');
            setFormData({
                nom: '',
                description: '',
                prix: '',
                stock: '',
                vetement_categorie_id: '',
                vetement_sous_categorie_id: '',
                compagnie_id: compagnie?.id || '',
                image: null,
            });
            removeImage();
            onFermer();
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            console.error('Détails de l\'erreur:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                toast.error('Erreur de validation');
            } else {
                toast.error(`Erreur serveur: ${err.response?.data?.error || err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => () => previewImage && URL.revokeObjectURL(previewImage.preview), [previewImage]);

    if (!ouvert) return null;

    if (!isAuthenticated() || !compagnie?.id) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-4 border border-gray-100">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Vous devez être connecté pour ajouter un produit.
                        </p>
                        <button
                            onClick={onFermer}
                            className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={(e) => e.target === e.currentTarget && onFermer()} />
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-sm transform transition-transform duration-300 ${ouvert ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                <Shirt className="w-4 h-4 text-orange-600" />
                            </div>
                            <h2 className="text-lg font-medium text-gray-900">Nouveau produit</h2>
                        </div>
                        <button
                            onClick={onFermer}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100%-73px)]">
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-6">
                            {/* Nom du produit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du produit *
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                    placeholder="Nom du produit"
                                    required
                                />
                                {errors.nom && (
                                    <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none"
                                    rows={3}
                                    placeholder="Description du produit"
                                />
                            </div>

                            {/* Prix et Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                                    <input
                                        type="number"
                                        name="prix"
                                        value={formData.prix}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.prix && (
                                        <p className="mt-1 text-xs text-red-600">{errors.prix}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.stock && (
                                        <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
                                    )}
                                </div>
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                                <select
                                    name="vetement_categorie_id"
                                    value={formData.vetement_categorie_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white"
                                    required
                                >
                                    <option value="">Sélectionner</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.vetement_categorie_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.vetement_categorie_id}</p>
                                )}
                            </div>

                            {/* Sous-catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégorie *</label>
                                <select
                                    name="vetement_sous_categorie_id"
                                    value={formData.vetement_sous_categorie_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white disabled:bg-gray-50"
                                    disabled={!formData.vetement_categorie_id}
                                    required
                                >
                                    <option value="">Sélectionner</option>
                                    {sousCategories.map((sousCat) => (
                                        <option key={sousCat.id} value={sousCat.id}>
                                            {sousCat.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.vetement_sous_categorie_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.vetement_sous_categorie_id}</p>
                                )}
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>

                                {!previewImage ? (
                                    <div className="border border-gray-200 border-dashed rounded-md p-6 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center mx-auto mb-3">
                                                <Upload className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">Cliquer pour ajouter</p>
                                            <p className="text-xs text-gray-400">PNG, JPG jusqu'à 5MB</p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={previewImage.preview}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            onClick={removeImage}
                                            type="button"
                                            className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {errors.image && (
                                    <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-6 py-4">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onFermer}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Création...
                                    </>
                                ) : (
                                    'Ajouter'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default OverformProduit;