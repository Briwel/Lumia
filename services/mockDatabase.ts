
import { MOCK_PROPERTIES } from '../constants';

/**
 * MOCK DATABASE SERVICE
 * Simule un backend complet pour le développement.
 */

export const mockDb = {
  get: (key: string): any[] => {
    try {
      const data = localStorage.getItem(`db_${key}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  set: (key: string, val: any) => localStorage.setItem(`db_${key}`, JSON.stringify(val)),
  
  init: () => {
    const version = 'v3.2'; // Version incrémentée pour reset si nécessaire
    if (localStorage.getItem('db_version') !== version) {
      localStorage.setItem('db_users', JSON.stringify([]));
      localStorage.setItem('db_properties', JSON.stringify(MOCK_PROPERTIES));
      localStorage.setItem('db_operations', JSON.stringify([]));
      
      // Seed initial des clients
      const initialClients = [
        { id: '1', name: 'Jean Dupont', email: 'jean@example.com', phone: '+229 97 00 00 01', role: 'Acheteur', interest: 'Villa Fidjrossè', budget: '150M' },
        { id: '2', name: 'Marc Koffi', email: 'marc@example.com', phone: '+229 66 00 00 02', role: 'Locataire', interest: 'Appartement Haie Vive', budget: '500k/mois' }
      ];
      localStorage.setItem('db_clients', JSON.stringify(initialClients));
      
      localStorage.setItem('db_version', version);
      console.log("💾 Mock DB: Validée et synchronisée.");
    }
  }
};

export const applyMockInterceptors = (apiInstance: any) => {
  apiInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (!error.response || error.code === 'ERR_NETWORK') {
        const { config } = error;
        const url = config.url || '';
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

        console.warn(`🛠 Mode Simulation Actif sur: ${url}`);

        if (url.includes('/auth/register')) {
          const users = mockDb.get('users');
          if (users.find(u => u.email === body.email)) {
            return Promise.reject({ response: { status: 409, data: { message: 'Email déjà utilisé' } } });
          }
          const newUser = { ...body, id: Math.random().toString(36).substr(2, 9) };
          users.push(newUser);
          mockDb.set('users', users);
          return Promise.resolve({ data: { access_token: 'mock_jwt_token', user: newUser }, status: 201 });
        }

        if (url.includes('/auth/login')) {
          const users = mockDb.get('users');
          const user = users.find(u => u.email === body.email && u.password === body.password);
          if (!user) return Promise.reject({ response: { status: 401, data: { message: 'Identifiants invalides' } } });
          return Promise.resolve({ data: { access_token: 'mock_jwt_token', user }, status: 200 });
        }

        if (url.includes('/properties')) {
          const props = mockDb.get('properties');
          if (config.method === 'post') {
            const newProp = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString() };
            props.push(newProp);
            mockDb.set('properties', props);
            return Promise.resolve({ data: newProp, status: 201 });
          }
          return Promise.resolve({ data: props, status: 200 });
        }
        
        // Gestion des clients (Nouveau)
        if (url.includes('/clients')) {
            const clients = mockDb.get('clients');
            if (config.method === 'post') {
                const newClient = { ...body, id: Date.now().toString() };
                clients.push(newClient);
                mockDb.set('clients', clients);
                return Promise.resolve({ data: newClient, status: 201 });
            }
            return Promise.resolve({ data: clients, status: 200 });
        }

        if (url.includes('/operations')) {
          return Promise.resolve({ data: mockDb.get('operations'), status: 200 });
        }
      }
      return Promise.reject(error);
    }
  );
};
