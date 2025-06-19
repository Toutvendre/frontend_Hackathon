import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from './axiosConfig';

export const AuthProvider = ({ children }) => {
    const [compagnie, setCompagnie] = useState(null);
    const [token, setToken] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token') || null;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Vérifier le token et charger les données de la compagnie
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                const response = await api.get('/type-categories');
                // Supposons que l'API pourrait être modifiée pour inclure la compagnie
                setCompagnie(response.data.compagnie || {});
            } catch (error) {
                console.error('Erreur lors de la vérification du token:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    setCompagnie(null);
                    setToken(null);
                    setError('Session expirée. Veuillez vous reconnecter.');
                } else {
                    setError('Erreur lors du chargement des données.');
                }
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, [token]);

    // Fonction de connexion
    const login = async (cmpid, motDePasse) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/login', {
                CMPID: cmpid,
                mot_de_passe: motDePasse,
            });
            const { token, compagnie } = response.data;
            localStorage.setItem('auth_token', token);
            setToken(token);
            setCompagnie(compagnie);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Erreur de connexion. Veuillez réessayer.';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fonction de déconnexion
    const logout = async () => {
        try {
            if (token) {
                // Appeler une route de déconnexion si disponible
                await api.post('/logout').catch(() => { });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            setCompagnie(null);
            setToken(null);
            setError(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
            }
        }
    };

    // Fonction d'inscription
    const register = async (companyData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/Inscription', {
                nom: companyData.nom,
                email: companyData.email,
                type_categorie_id: companyData.type_categorie_id,
            });
            // Pas de token renvoyé par /Inscription, donc pas d'auto-login
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Erreur lors de l\'inscription. Veuillez réessayer.';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour le profil de la compagnie
    const updateProfile = async (companyData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put('/profile', companyData);
            setCompagnie(response.data.compagnie || response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Erreur lors de la mise à jour du profil.';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Rafraîchir les données de la compagnie
    const refreshCompany = async () => {
        if (!token) return;
        try {
            setError(null);
            const response = await api.get('/type-categories');
            setCompagnie(response.data.compagnie || {});
            return response.data;
        } catch (error) {
            console.error('Erreur lors du rafraîchissement:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
            throw error;
        }
    };

    // Vérifier si la compagnie est authentifiée
    const isAuthenticated = () => {
        return !!(token && compagnie);
    };

    // Vérifier les rôles (non utilisé pour l'instant, mais inclus pour compatibilité)
    const hasRole = (role) => {
        return compagnie?.roles?.includes(role) || false;
    };

    const hasAnyRole = (roles) => {
        if (!compagnie?.roles) return false;
        if (typeof roles === 'string') {
            return compagnie.roles.includes(roles);
        }
        if (Array.isArray(roles)) {
            return roles.some((r) => compagnie.roles.includes(r));
        }
        return false;
    };

    // Effacer l'erreur
    const clearError = () => {
        setError(null);
    };

    // Contexte
    const contextValue = {
        compagnie,
        token,
        loading,
        error,
        login,
        logout,
        register,
        updateProfile,
        refreshCompany,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        clearError,
        setLoading,
        setCompagnie,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};