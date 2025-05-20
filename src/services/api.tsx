// src/sevices/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://frotasimples-bbc0f36789e8.herokuapp.com/',
});

export default api;
