import React, { useState, useCallback, useContext, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle, ChefHat } from 'lucide-react';
import { AuthContext } from '@/utils/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/utils/axiosConfig';

const OverformPlats = ({ ouvert, onFermer }) => {
    const { isAuthenticated, compagnie } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        stock: '',
        categorie_plat_id: '',
        compagnie_id: '',
        image: null,
        disponibilite: true,
        temps_preparation: '',
        ingredients: '',
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        console.log('État de l\'authentification:', {
            isAuthenticated: isAuthenticated(),
            compagnie,
            compagnie_id: formData.compagnie_id,
        });
    }, [isAuthenticated, compagnie, formData.compagnie_id]);

    // Correction: Utiliser la bonne route API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/plats/categories');
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
        const { name, value, type, checked } = e.target;
        let formattedValue = value;

        if (name === 'prix') {
            formattedValue = value ? parseFloat(value) : '';
        } else if (name === 'stock') {
            formattedValue = value ? parseInt(value, 10) : '';
        } else if (name === 'categorie_plat_id') {
            formattedValue = value ? parseInt(value, 10) : '';
        } else if (type === 'checkbox') {
            formattedValue = checked;
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
            if (!formData.prix || isNaN(formData.prix)) newErrors.prix = 'Prix requis ou invalide';
            if (!formData.categorie_plat_id) newErrors.categorie_plat_id = 'Catégorie requise';
            if (!formData.compagnie_id) {
                if (compagnie?.id) {
                    formData.compagnie_id = compagnie.id; // fallback ici
                } else {
                    newErrors.compagnie_id = 'Compagnie requise';
                }
            }

            if (Object.keys(newErrors).length > 0) {
                console.log('Erreurs de validation (frontend):', newErrors);
                setErrors(newErrors);
                toast.error('Veuillez corriger les champs requis');
                setLoading(false);
                return;
            }

            const data = new FormData();
            for (const [key, val] of Object.entries(formData)) {
                // Pour les boolean (checkbox)
                if (typeof val === 'boolean') {
                    data.append(key, val ? '1' : '0');
                }
                // Pour les autres (évite null ou string vide)
                else if (val !== null && val !== '') {
                    data.append(key, val);
                }
            }

            console.log('FormData envoyé:', Array.from(data.entries()));

            const response = await api.post('/plats', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Réponse du serveur:', response.data);
            toast.success('Plat créé avec succès');

            // Réinitialiser le formulaire
            setFormData({
                nom: '',
                description: '',
                prix: '',
                stock: '',
                categorie_plat_id: '',
                compagnie_id: compagnie?.id || '',
                image: null,
                disponibilite: true,
                temps_preparation: '',
                ingredients: '',
            });

            removeImage();
            onFermer();
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            const errorResponse = err.response?.data;

            if (errorResponse?.errors) {
                console.table(errorResponse.errors); // 👈 pour debug clair
                setErrors(errorResponse.errors);
                toast.error('Erreur de validation côté serveur');
            } else {
                toast.error(`Erreur serveur: ${errorResponse?.message || err.message}`);
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
                    <p className="mt-2">Vous devez être connecté pour ajouter un plat.</p>
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
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={(e) => e.target === e.currentTarget && onFermer()}
            />
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${ouvert ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-2 rounded-lg">
                            <ChefHat className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Ajouter un plat</h2>
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
                            min="0"
                            step="0.01"
                        />
                        {errors.prix && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.prix}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            min="0"
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
                            name="categorie_plat_id"
                            value={formData.categorie_plat_id}
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
                        {errors.categorie_plat_id && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.categorie_plat_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium">
                            <input
                                type="checkbox"
                                name="disponibilite"
                                checked={formData.disponibilite}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Disponible
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Temps de préparation</label>
                        <input
                            type="text"
                            name="temps_preparation"
                            value={formData.temps_preparation}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            placeholder="Ex: 15 minutes"
                        />
                        {errors.temps_preparation && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.temps_preparation}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ingrédients</label>
                        <textarea
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            rows={4}
                            placeholder="Liste des ingrédients..."
                        />
                        {errors.ingredients && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.ingredients}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {previewImage && (
                            <div className="relative mt-2">
                                <img
                                    src={previewImage.preview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded"
                                />
                                <button
                                    onClick={removeImage}
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                        <button
                            type="button"
                            onClick={onFermer}
                            className="px-4 py-2 rounded border hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
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

export default OverformPlats;