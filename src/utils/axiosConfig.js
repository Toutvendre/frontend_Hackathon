// utils/axiosConfig.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // URL de ton backend Laravel
    headers: {
        'Accept': 'application/json',
        // 'Content-Type' sera automatiquement défini par axios selon le type de requête (ex: FormData)
    },
});

// Intercepteur pour ajouter le token d'authentification Bearer dans l'en-tête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
