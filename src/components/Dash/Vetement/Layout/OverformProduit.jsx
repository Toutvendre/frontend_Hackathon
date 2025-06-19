import React, { useState, useCallback, useContext, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle, Shirt } from 'lucide-react';
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
                const res = await api.get('/vetement/categories');
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
                    const res = await api.get(`/vetement/sous-categories/${formData.vetement_categorie_id}`);
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
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded">
                    <h2 className="text-lg font-semibold">Erreur</h2>
                    <p className="mt-2">Vous devez être connecté pour ajouter un produit.</p>
                    <button
                        onClick={onFermer}
                        className="mt-4 px-4 py-2 rounded bg-black text-white"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={(e) => e.target === e.currentTarget && onFermer()} />
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${ouvert ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-2 rounded-lg">
                            <Shirt className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Ajouter un produit</h2>
                    </div>
                    <button onClick={onFermer} className="text-gray-600 hover:text-black">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto h-[calc(100%-80px)]">
                    <div>
                        <label className="block text-sm font-medium">Nom *</label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            required
                        />
                        {errors.nom && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.nom}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Prix (en FCFA) *</label>
                        <input
                            type="number"
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            required
                        />
                        {errors.prix && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.prix}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            required
                        />
                        {errors.stock && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.stock}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Catégorie *</label>
                        <select
                            name="vetement_categorie_id"
                            value={formData.vetement_categorie_id}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nom}
                                </option>
                            ))}
                        </select>
                        {errors.vetement_categorie_id && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.vetement_categorie_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Sous-catégorie *</label>
                        <select
                            name="vetement_sous_categorie_id"
                            value={formData.vetement_sous_categorie_id}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            required
                        >
                            <option value="">Sélectionner une sous-catégorie</option>
                            {sousCategories.map((sousCat) => (
                                <option key={sousCat.id} value={sousCat.id}>
                                    {sousCat.nom}
                                </option>
                            ))}
                        </select>
                        {errors.vetement_sous_categorie_id && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.vetement_sous_categorie_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {previewImage && (
                            <div className="relative mt-2">
                                <img src={previewImage.preview} alt="Preview" className="w-full h-40 object-cover rounded" />
                                <button
                                    onClick={removeImage}
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {errors.image && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.image}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <button type="button" onClick={onFermer} className="px-4 py-2 rounded border">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin w-4 h-4" />}
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default OverformProduit;