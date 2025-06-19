// utils/axiosConfig.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Remplacez par l'URL de votre backend Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token aux requêtes
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