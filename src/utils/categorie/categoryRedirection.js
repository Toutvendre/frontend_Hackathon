import { useState, useCallback } from 'react';
import api from '@/utils/axiosConfig';

let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000;

const DEFAULT_CATEGORY_DASHBOARD_MAP = {
    1: '/dashboard/restaurant',
    2: '/dashboard/vetement',
    3: '/dashboard/sante',
    4: '/dashboard/electronique',
    5: '/dashboard/transport',
    6: '/dashboard/immobilier',
    7: '/dashboard/education',
    8: '/dashboard/beaute',
    9: '/dashboard/loisirs',
    10: '/dashboard/services',
};

const generateDashboardUrl = (categoryName) => {
    if (!categoryName) return '/dashboard';
    return `/dashboard/${categoryName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim()}`;
};

const isCacheValid = () => {
    return categoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION;
};

export const fetchCategories = async () => {
    try {
        if (isCacheValid()) return categoriesCache;
        const response = await api.get('/type-categories');
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid API response format');
        }
        categoriesCache = response.data;
        cacheTimestamp = Date.now();
        return categoriesCache;
    } catch {
        return categoriesCache || null;
    }
};

export const findCategoryById = async (categoryId) => {
    try {
        const categories = await fetchCategories();
        return categories ? categories.find(cat => cat.id === parseInt(categoryId)) || null : null;
    } catch {
        return null;
    }
};

export const findCategoryByName = async (categoryName) => {
    try {
        const categories = await fetchCategories();
        return categories ? categories.find(cat => cat.nom.toLowerCase() === categoryName.toLowerCase()) || null : null;
    } catch {
        return null;
    }
};

export const getDashboardRedirectUrl = async (compagnie) => {
    try {
        if (!compagnie) return '/dashboard';
        let category = null;
        let categoryId = null;

        if (compagnie.categorie?.id) {
            categoryId = compagnie.categorie.id;
            category = await findCategoryById(categoryId);
        }

        if (!category && compagnie.type_categorie_id) {
            categoryId = compagnie.type_categorie_id;
            category = await findCategoryById(categoryId);
        }

        if (!category && compagnie.categorie?.nom) {
            category = await findCategoryByName(compagnie.categorie.nom);
        }

        if (category) {
            return generateDashboardUrl(category.nom);
        }

        if (categoryId && DEFAULT_CATEGORY_DASHBOARD_MAP[categoryId]) {
            return DEFAULT_CATEGORY_DASHBOARD_MAP[categoryId];
        }

        return '/dashboard';
    } catch {
        return '/dashboard';
    }
};

export const isValidCategory = async (categoryId) => {
    try {
        const category = await findCategoryById(categoryId);
        return category !== null;
    } catch {
        return false;
    }
};

export const getCategoryNameById = async (categoryId) => {
    try {
        const category = await findCategoryById(categoryId);
        return category ? category.nom : null;
    } catch {
        return null;
    }
};

export const getAllCategories = async () => {
    try {
        return await fetchCategories() || [];
    } catch {
        return [];
    }
};

export const invalidateCache = () => {
    categoriesCache = null;
    cacheTimestamp = null;
};

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