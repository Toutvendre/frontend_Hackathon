import { useState, useEffect } from 'react';
import api from '@/utils/axiosConfig';

export const useProducts = ({ sous_categorie_id, page = 1 }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sous_categorie_id) {
            setProducts([]);
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                // La route est /vetement-sous-categories/{id}/produits
                const res = await api.get(`/vetement-sous-categories/${sous_categorie_id}/produits`, {
                    params: { page } // à adapter si pagination backend
                });
                setProducts(res.data);
            } catch (error) {
                console.error('Erreur fetch produits:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [sous_categorie_id, page]);

    return { products, loading };
};
