// src/services/endpoints.js
import api from '@/utils/axiosConfig';

export const getCategoriesPrincipales = () => api.get('/vetement/categories-principales');
export const getCategories = () => api.get('/vetement/categories');
export const getSousCategories = (categorieId) => api.get(`/vetement/sous-categories/${categorieId}`);
export const getProduits = ({ categorie_id, sous_categorie_id, page = 1 }) => {
    const params = new URLSearchParams({ page }).toString();
    let url = '/vetement/produits?' + params;
    if (categorie_id) url += `&categorie_id=${categorie_id}`;
    if (sous_categorie_id) url += `&sous_categorie_id=${sous_categorie_id}`;
    return api.get(url);
};
export const getProduit = (id) => api.get(`/vetement/produits/${id}`);
export const createCommande = (data) => api.post('/commandes', data);