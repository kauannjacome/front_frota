import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
});

// Interceptor para enviar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authTokenFrota');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
