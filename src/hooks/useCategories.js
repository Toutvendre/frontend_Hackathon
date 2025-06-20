import { useState, useEffect } from 'react';
import api from '@/utils/axiosConfig';

export const useCategories = () => {
    const [typeCategories, setTypeCategories] = useState([]);
    const [categoriesVetement, setCategoriesVetement] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);

    const [selectedCategorie, setSelectedCategorie] = useState(null);
    const [selectedVetementCategorie, setSelectedVetementCategorie] = useState(null);
    const [selectedVetementSousCategorie, setSelectedVetementSousCategorie] = useState(null);

    const [loading, setLoading] = useState(true);

    // Charge les catégories principales (type)
    useEffect(() => {
        api.get('/categories/type')
            .then(res => setTypeCategories(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Charge les catégories vêtements si "Vêtement" est sélectionné
    useEffect(() => {
        if (selectedCategorie?.nom !== 'Vêtement') {
            setCategoriesVetement([]);
            setSelectedVetementCategorie(null);
            setSousCategories([]);
            setSelectedVetementSousCategorie(null);
            return;
        }

        api.get('/categories/vetement')
            .then(res => setCategoriesVetement(res.data))
            .catch(() => setCategoriesVetement([]));
    }, [selectedCategorie]);

    // Charge les sous-catégories de vêtements
    useEffect(() => {
        if (!selectedVetementCategorie) {
            setSousCategories([]);
            return;
        }

        api.get(`/categories/vetement/${selectedVetementCategorie.id}/sous-categories`)
            .then(res => setSousCategories(res.data))
            .catch(() => setSousCategories([]));
    }, [selectedVetementCategorie]);

    return {
        typeCategories,
        categoriesVetement,
        sousCategories,
        selectedCategorie,
        setSelectedCategorie,
        selectedVetementCategorie,
        setSelectedVetementCategorie,
        selectedVetementSousCategorie,
        setSelectedVetementSousCategorie,
        loading,
    };
};
