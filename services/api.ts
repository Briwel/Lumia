
import axios from 'axios';
import { mockDb, applyMockInterceptors } from './mockDatabase';

/**
 * CLIENT API FRONTEND
 * Tente de se connecter au backend NestJS (port 3000).
 * Si le serveur est éteint, bascule automatiquement sur la DB locale.
 */

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialisation de la DB locale au cas où
mockDb.init();

// Injection du jeton d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Application du fallback Mock (simulation)
applyMockInterceptors(api);

export default api;
