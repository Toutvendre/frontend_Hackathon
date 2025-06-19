import React, { useState, useCallback, useContext, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle, Shirt } from 'lucide-react';
import { AuthContext } from '@/utils/AuthContext';
import { useToast } from '@/components/Toast/ToastUtils';
import { ToastContext } from '@/components/Toast/ToastContext';
import api from '@/utils/axiosConfig';

const OverformProduit = ({ ouvert, onFermer }) => {
    const { estAuthentifie } = useContext(AuthContext);
    const toast = useToast(ToastContext);

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback((files) => {
        const file = files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 5MB");
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image');
            return;
        }

        setPreviewImage({
            file,
            preview: URL.createObjectURL(file),
        });

        setFormData(prev => ({ ...prev, image: file }));
        toast.success('Image ajoutée avec succès');
    }, [toast]);

    const handleFileChange = (e) => {
        onDrop(Array.from(e.target.files));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const removeImage = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage.preview);
            setPreviewImage(null);
            setFormData(prev => ({ ...prev, image: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!estAuthentifie()) {
                toast.error('Vous devez être connecté pour ajouter un produit');
                return;
            }

            // Validation
            if (!formData.nom.trim()) {
                setErrors({ nom: "Le nom du produit est requis" });
                toast.error('Nom requis');
                return;
            }

            const data = new FormData();
            data.append('nom', formData.nom);
            data.append('description', formData.description);
            data.append('prix', formData.prix);
            if (formData.image) data.append('image', formData.image);

            await api.post('/produits/creer', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Produit ajouté avec succès');
            setFormData({ nom: '', description: '', prix: '', image: null });
            removeImage();
            onFermer();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                toast.error('Erreur de validation');
            } else {
                toast.error('Erreur serveur');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage.preview);
            }
        };
    }, [previewImage]);

    if (!ouvert) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={e => e.target === e.currentTarget && onFermer()} />
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${ouvert ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto h-full">
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
                        {errors.nom && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.nom}</p>}
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
                        <label className="block text-sm font-medium">Prix (en FCFA)</label>
                        <input
                            type="number"
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {previewImage && (
                            <div className="relative mt-2">
                                <img src={previewImage.preview} alt="Preview" className="w-full h-40 object-cover rounded" />
                                <button onClick={removeImage} type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <button type="button" onClick={onFermer} className="px-4 py-2 rounded border">Annuler</button>
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
