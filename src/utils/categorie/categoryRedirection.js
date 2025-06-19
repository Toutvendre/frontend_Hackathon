// utils/categoryRedirection.js
import { useState, useCallback } from 'react';
import api from '@/utils/axiosConfig';

/**
 * Cache pour stocker les catégories récupérées de l'API
 */
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

/**
 * Mapping par défaut des catégories vers leurs dashboards respectifs
 * Utilisé comme fallback si l'API n'est pas disponible
 */
const DEFAULT_CATEGORY_DASHBOARD_MAP = {
    1: '/dashboard/restaurant',      // Restaurant
    2: '/dashboard/vetement',        // Vêtement
    3: '/dashboard/sante',           // Santé
    4: '/dashboard/electronique',    // Électronique
    5: '/dashboard/transport',       // Transport
    6: '/dashboard/immobilier',      // Immobilier
    7: '/dashboard/education',       // Éducation
    8: '/dashboard/beaute',          // Beauté
    9: '/dashboard/loisirs',         // Loisirs
    10: '/dashboard/services',       // Services divers
};

/**
 * Génère l'URL du dashboard basée sur le nom de la catégorie
 * @param {string} categoryName - Nom de la catégorie
 * @returns {string} - URL du dashboard
 */
const generateDashboardUrl = (categoryName) => {
    if (!categoryName) return '/dashboard';

    // Normaliser le nom pour créer l'URL
    const normalizedName = categoryName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-z0-9]/g, '') // Garder seulement les lettres et chiffres
        .trim();

    return `/dashboard/${normalizedName}`;
};

/**
 * Vérifie si le cache est encore valide
 * @returns {boolean} - True si le cache est valide
 */
const isCacheValid = () => {
    if (!categoriesCache || !cacheTimestamp) return false;
    return (Date.now() - cacheTimestamp) < CACHE_DURATION;
};

/**
 * Récupère les catégories depuis l'API
 * @returns {Promise<Array>} - Liste des catégories
 */
export const fetchCategories = async () => {
    try {
        // Vérifier le cache d'abord
        if (isCacheValid()) {
            console.log('Utilisation du cache des catégories');
            return categoriesCache;
        }

        console.log('Récupération des catégories depuis l\'API...');
        const response = await api.get('/type-categories');

        // Valider la réponse
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Format de réponse API invalide');
        }

        // Mettre à jour le cache
        categoriesCache = response.data;
        cacheTimestamp = Date.now();

        console.log(`${categoriesCache.length} catégories récupérées et mises en cache`);
        return categoriesCache;

    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);

        // Retourner le cache s'il existe, même s'il est expiré
        if (categoriesCache) {
            console.warn('Utilisation du cache expiré des catégories');
            return categoriesCache;
        }

        // En dernier recours, utiliser le mapping par défaut
        console.warn('Utilisation du mapping par défaut');
        return null;
    }
};

/**
 * Trouve une catégorie par son ID dans la base de données
 * @param {number} categoryId - ID de la catégorie
 * @returns {Promise<Object|null>} - Objet catégorie ou null
 */
export const findCategoryById = async (categoryId) => {
    try {
        const categories = await fetchCategories();
        if (!categories) return null;

        return categories.find(cat => cat.id === parseInt(categoryId)) || null;
    } catch (error) {
        console.error('Erreur lors de la recherche de catégorie:', error);
        return null;
    }
};

/**
 * Trouve une catégorie par son nom dans la base de données
 * @param {string} categoryName - Nom de la catégorie
 * @returns {Promise<Object|null>} - Objet catégorie ou null
 */
export const findCategoryByName = async (categoryName) => {
    try {
        const categories = await fetchCategories();
        if (!categories) return null;

        return categories.find(cat =>
            cat.nom.toLowerCase() === categoryName.toLowerCase()
        ) || null;
    } catch (error) {
        console.error('Erreur lors de la recherche de catégorie par nom:', error);
        return null;
    }
};

/**
 * Détermine l'URL de redirection basée sur la compagnie (version dynamique)
 * @param {Object} compagnie - Objet compagnie avec les données
 * @returns {Promise<string>} - URL de redirection
 */
export const getDashboardRedirectUrl = async (compagnie) => {
    try {
        // Vérifier si la compagnie existe
        if (!compagnie) {
            console.error('Compagnie non fournie');
            return '/dashboard'; // Redirection par défaut
        }

        console.log('Analyse de la compagnie pour redirection:', compagnie);

        let category = null;
        let categoryId = null;

        // 1. Essayer d'obtenir la catégorie depuis l'objet categorie
        if (compagnie.categorie?.id) {
            categoryId = compagnie.categorie.id;
            // Vérifier si la catégorie existe toujours dans la base
            category = await findCategoryById(categoryId);

            if (category) {
                console.log('Catégorie trouvée via objet categorie:', category);
            } else {
                console.warn('Catégorie dans objet categorie n\'existe plus dans la base');
            }
        }

        // 2. Fallback: utiliser type_categorie_id directement
        if (!category && compagnie.type_categorie_id) {
            categoryId = compagnie.type_categorie_id;
            category = await findCategoryById(categoryId);

            if (category) {
                console.log('Catégorie trouvée via type_categorie_id:', category);
            } else {
                console.warn('Catégorie avec type_categorie_id n\'existe plus dans la base');
            }
        }

        // 3. Fallback: mapper le nom de catégorie vers l'objet complet
        if (!category && compagnie.categorie?.nom) {
            category = await findCategoryByName(compagnie.categorie.nom);

            if (category) {
                console.log('Catégorie trouvée via nom:', category);
            } else {
                console.warn('Catégorie avec nom n\'existe plus dans la base');
            }
        }

        // 4. Si on a trouvé une catégorie, générer l'URL
        if (category) {
            const dashboardUrl = generateDashboardUrl(category.nom);
            console.log(`Redirection vers: ${dashboardUrl}`);
            return dashboardUrl;
        }

        // 5. Dernier recours: utiliser le mapping par défaut si disponible
        if (categoryId && DEFAULT_CATEGORY_DASHBOARD_MAP[categoryId]) {
            const defaultUrl = DEFAULT_CATEGORY_DASHBOARD_MAP[categoryId];
            console.warn(`Utilisation du mapping par défaut: ${defaultUrl}`);
            return defaultUrl;
        }

        // 6. Redirection vers dashboard générique
        console.warn('Aucune catégorie valide trouvée, redirection vers dashboard par défaut');
        return '/dashboard';

    } catch (error) {
        console.error('Erreur lors de la détermination de l\'URL de redirection:', error);
        return '/dashboard'; // Redirection sécurisée en cas d'erreur
    }
};

/**
 * Vérifie si une catégorie existe dans la base de données
 * @param {number|string} categoryId - ID de la catégorie
 * @returns {Promise<boolean>} - True si la catégorie existe
 */
export const isValidCategory = async (categoryId) => {
    try {
        const category = await findCategoryById(categoryId);
        return category !== null;
    } catch (error) {
        console.error('Erreur lors de la validation de catégorie:', error);
        return false;
    }
};

/**
 * Obtient le nom de la catégorie par son ID depuis la base de données
 * @param {number} categoryId - ID de la catégorie
 * @returns {Promise<string|null>} - Nom de la catégorie ou null
 */
export const getCategoryNameById = async (categoryId) => {
    try {
        const category = await findCategoryById(categoryId);
        return category ? category.nom : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du nom de catégorie:', error);
        return null;
    }
};

/**
 * Obtient toutes les catégories disponibles
 * @returns {Promise<Array>} - Liste de toutes les catégories
 */
export const getAllCategories = async () => {
    try {
        return await fetchCategories() || [];
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les catégories:', error);
        return [];
    }
};

/**
 * Invalide le cache des catégories (force une nouvelle récupération)
 */
export const invalidateCache = () => {
    categoriesCache = null;
    cacheTimestamp = null;
    console.log('Cache des catégories invalidé');
};

/**
 * Fonction de debug pour afficher les informations de catégorie
 * @param {Object} compagnie - Objet compagnie
 */
export const debugCategoryInfo = async (compagnie) => {
    console.group('Debug Category Info');
    console.log('Compagnie:', compagnie);
    console.log('Objet categorie:', compagnie?.categorie);
    console.log('Type categorie ID:', compagnie?.type_categorie_id);

    if (compagnie?.categorie?.id) {
        const category = await findCategoryById(compagnie.categorie.id);
        console.log('Catégorie trouvée par ID:', category);
    }

    if (compagnie?.categorie?.nom) {
        const category = await findCategoryByName(compagnie.categorie.nom);
        console.log('Catégorie trouvée par nom:', category);
    }

    const redirectUrl = await getDashboardRedirectUrl(compagnie);
    console.log('URL de redirection:', redirectUrl);

    console.groupEnd();
};

/**
 * Hook personnalisé pour la gestion des catégories (à utiliser dans les composants React)
 * @returns {Object} - Objet avec les fonctions et états des catégories
 */
export const useCategoryRedirection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchCategories();
            setCategories(data || []);
        } catch (err) {
            setError(err.message);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getRedirectUrl = useCallback(async (compagnie) => {
        return await getDashboardRedirectUrl(compagnie);
    }, []);

    return {
        categories,
        loading,
        error,
        loadCategories,
        getRedirectUrl,
        invalidateCache
    };
};