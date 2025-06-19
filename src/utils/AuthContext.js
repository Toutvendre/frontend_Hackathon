import { createContext, useContext } from 'react';

const AuthContext = createContext({
    compagnie: null,
    token: null,
    loading: true,
    error: null,
    login: async () => { },
    logout: async () => { },
    register: async () => { },
    updateProfile: async () => { },
    refreshCompany: async () => { },
    isAuthenticated: () => false,
    hasRole: () => false,
    hasAnyRole: () => false,
    clearError: () => { },
    setLoading: () => { },
    setCompagnie: () => { },
});

const useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };