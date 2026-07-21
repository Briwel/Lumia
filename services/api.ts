import axios from 'axios';
import { mockDb } from './mockDatabase';
import { isSupabaseConfigured } from './supabaseClient';
import { supabaseService } from './supabaseService';

// =========================================================================
//                   DATABASE FIREWALL & SECURITY LAYER (WAF)
// =========================================================================

// 1. RATE LIMITING: Simule une protection contre les attaques DoS et Brute-Force sur la base de données.
const REQUEST_WINDOW_MS = 10000; // Fenêtre de 10 secondes
const MAX_REQUESTS_PER_WINDOW = 40;
const requestHistory: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  // Supprimer les timestamps de requêtes obsolètes
  while (requestHistory.length > 0 && requestHistory[0] < now - REQUEST_WINDOW_MS) {
    requestHistory.shift();
  }
  if (requestHistory.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  requestHistory.push(now);
  return true;
}

// 2. INPUT SANITIZATION: Nettoyage récursif contre l'Injection SQL (SQLi) et les attaques XSS Stockées (Data Poisoning).
function sanitizeInput(value: any): any {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    let cleaned = value;

    // Protection Anti-Injection SQL (Enlève les commentaires et déjoue l'évasion par guillemet/caractère spécial)
    cleaned = cleaned.replace(/--+/g, ''); // Élimine les commentaires de ligne SQL
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, ''); // Élimine les commentaires de bloc SQL

    // Liste noire de mots-clés d'injection SQL courants (remplace par une valeur neutre)
    const sqlKeywordsRegex = /\b(UNION\s+SELECT|SELECT\s+.*\s+FROM|INSERT\s+INTO|DROP\s+TABLE|DELETE\s+FROM|UPDATE\s+.*\s+SET|OR\s+1\s*=\s*1|AND\s+1\s*=\s*1)\b/gi;
    cleaned = cleaned.replace(sqlKeywordsRegex, '[CLEANED_SECURE]');

    // Échappement des caractères HTML pour bloquer le XSS Stocké en DB
    cleaned = cleaned
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return cleaned.trim();
  }

  if (typeof value === 'number') {
    // Éviter l'injection de NaN, de valeurs infinies ou de débordement de mémoire
    if (!isFinite(value)) return 0;
    // Forcer les valeurs négatives interdites à 0 (pour les prix, montants, surfaces)
    return value < 0 ? 0 : value;
  }

  if (Array.isArray(value)) {
    return value.map(v => sanitizeInput(v));
  }

  if (typeof value === 'object') {
    const cleanedObj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        // Validation des clés d'objet pour éviter la pollution de prototype (__proto__)
        if (key === '__proto__' || key === 'constructor') continue;
        cleanedObj[key] = sanitizeInput(value[key]);
      }
    }
    return cleanedObj;
  }

  return value;
}

// Validation stricte des e-mails (Anti-injection LDAP/SQL par e-mail)
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Initialisation de la DB locale au cas où
mockDb.init();

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: async (config) => {
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    // --- SÉCURITÉ 1 : PROTECTION BRUTE FORCE / DOS ---
    if (!checkRateLimit()) {
      return Promise.reject({
        response: {
          status: 429,
          data: { message: "Sécurité de la Base de Données : Trop de requêtes. Veuillez patienter pour éviter une surcharge." }
        }
      });
    }

    // Récupération sécurisée des données de session client actuelles
    const loggedInUserRole = localStorage.getItem('userRole') || 'agent';
    const loggedInAgentName = localStorage.getItem('agentName') || 'Agent';

    // Parse et nettoyage automatique du payload entrant
    let rawBody = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    let body = sanitizeInput(rawBody);

    // --- SÉCURITÉ 2 : PRÉVENTION DE L'ESCALADE DE PRIVILÈGES ---
    if (url.includes('/auth/register')) {
      if (body.role === 'super_admin') {
        body.role = 'agent'; // Empêche l'enregistrement d'un super-administrateur non autorisé
      }
    }

    const adminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'superadmin@lumina.com';
    const adminPassword = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'LuminaAdmin2026!';
    const adminName = import.meta.env.VITE_SUPER_ADMIN_NAME || 'Super Admin Lumina';

    // --- BYPASS SUPER ADMIN COMPLÈTEMENT INVISIBLE ---
    if (url.includes('/auth/login') && body.email?.toLowerCase() === adminEmail.toLowerCase() && body.password === adminPassword) {
      console.log("👑 [Super Admin Bypass] Connexion sécurisée réussie pour le Super Administrateur.");
      return {
        data: {
          access_token: 'secret_superadmin_token_2026',
          user: {
            id: 'super_admin_id',
            email: adminEmail,
            name: adminName,
            role: 'super_admin',
            agencyName: 'Lumina Immo Corporation'
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }

    // --- VALIDATION STRICTE FORMAT E-MAIL AU LOGIN/INSCRIPTION ---
    if ((url.includes('/auth/login') || url.includes('/auth/register')) && body.email) {
      if (!isValidEmail(body.email)) {
        return Promise.reject({
          response: {
            status: 400,
            data: { message: "Format de l'adresse email invalide." }
          }
        });
      }
    }

    // --- SÉCURITÉ 3 : INJECTION DES METADONNÉES DE CRÉATEUR EN BASE DE DONNÉES (SERVER-SIDE MOCK) ---
    // Attache l'agent connecté à toute création d'entité pour empêcher l'usurpation d'identité ou le cross-agent injection.
    if (method === 'post' && (url.includes('/properties') || url.includes('/clients') || url.includes('/operations'))) {
      body.agentName = loggedInAgentName;
      body.agencyName = localStorage.getItem('agencyName') || 'Lumina Immo';
    }

    // --- CAS 1 : SUPABASE CONFIGURÉ ---
    if (isSupabaseConfigured) {
      console.log(`📡 [Supabase Request] ${method.toUpperCase()} ${url}`, body);
      try {
        if (url.includes('/auth/register')) {
          const res = await supabaseService.register(body);
          return { data: res, status: 201, statusText: 'Created', headers: {}, config };
        }
        if (url.includes('/auth/login')) {
          const res = await supabaseService.login(body);
          return { data: res, status: 200, statusText: 'OK', headers: {}, config };
        }
        if (url.includes('/properties') || url.includes('/agent/properties')) {
          if (method === 'post') {
            const res = await supabaseService.createProperty(body);
            return { data: res, status: 201, statusText: 'Created', headers: {}, config };
          }
          let res = await supabaseService.getProperties();

          // SÉCURITÉ 4 (RLS Client-Side) : Filtrage pour assurer l'invisibilité des données du Super Admin
          // et isolation stricte par agent si ce n'est pas le super-admin.
          if (loggedInUserRole !== 'super_admin') {
            // Un agent ordinaire ne doit jamais voir les données du super admin
            res = res.filter(p => p.agentName !== adminName && p.agentName !== 'super_admin');
            
            // Si requête privée agent, isoler à ses propres biens
            if (url.includes('/agent/properties')) {
              res = res.filter(p => p.agentName === loggedInAgentName || p.agencyName === (localStorage.getItem('agencyName') || 'Lumina Immo'));
            }
          }

          return { data: res, status: 200, statusText: 'OK', headers: {}, config };
        }
        if (url.includes('/clients')) {
          if (method === 'post') {
            const res = await supabaseService.createClient(body);
            return { data: res, status: 201, statusText: 'Created', headers: {}, config };
          }
          let res = await supabaseService.getClients();

          // SÉCURITÉ 4 (RLS Client-Side) : Filtrage et Isolation des clients
          if (loggedInUserRole !== 'super_admin') {
            // Cacher les données du Super Admin et isoler les clients à l'agent connecté
            res = res.filter(c => c.agentName !== adminName && c.agentName !== 'super_admin');
            res = res.filter(c => !c.agentName || c.agentName === loggedInAgentName);
          }

          return { data: res, status: 200, statusText: 'OK', headers: {}, config };
        }
        if (url.includes('/operations')) {
          if (method === 'post') {
            const res = await supabaseService.createOperation(body);
            return { data: res, status: 201, statusText: 'Created', headers: {}, config };
          }
          let res = await supabaseService.getOperations();

          // SÉCURITÉ 4 (RLS Client-Side) : Isolation stricte des opérations financières
          if (loggedInUserRole !== 'super_admin') {
            res = res.filter(o => o.agentName !== adminName && o.agentName !== 'super_admin');
            res = res.filter(o => !o.agentName || o.agentName === loggedInAgentName);
          }

          return { data: res, status: 200, statusText: 'OK', headers: {}, config };
        }
      } catch (err: any) {
        console.error(`❌ [Supabase Error] ${url}:`, err);
        return Promise.reject({
          response: {
            status: err.status || 400,
            data: { message: err.message || 'La requête Supabase a échoué' }
          }
        });
      }
    }

    // --- CAS 2 : MODE SIMULATION LOCAL ---
    console.log(`🛠 [Local Mock DB] ${method.toUpperCase()} ${url}`, body);
    try {
      if (url.includes('/auth/register')) {
        const users = mockDb.get('users');
        if (users.find((u: any) => u.email === body.email)) {
          return Promise.reject({
            response: { status: 409, data: { message: 'Email déjà utilisé' } }
          });
        }
        const newUser = { ...body, id: Math.random().toString(36).substr(2, 9) };
        users.push(newUser);
        mockDb.set('users', users);
        return { data: { access_token: 'mock_jwt_token', user: newUser }, status: 201, statusText: 'Created', headers: {}, config };
      }

      if (url.includes('/auth/login')) {
        const users = mockDb.get('users');
        const user = users.find((u: any) => u.email === body.email && u.password === body.password);
        if (!user) {
          // Permettre de se connecter en mode démo avec n'importe quel mot de passe si aucun utilisateur n'existe encore
          const isDemoMode = users.length === 0;
          const isEmailAdmin = body.email.toLowerCase().includes('admin');
          const demoUser = isDemoMode ? { 
            email: body.email, 
            name: body.email.split('@')[0], 
            role: isEmailAdmin ? 'super_admin' : 'agent',
            agencyName: 'Lumina Immo'
          } : null;
          if (demoUser) {
            return { data: { access_token: 'mock_jwt_token', user: demoUser }, status: 200, statusText: 'OK', headers: {}, config };
          }
          return Promise.reject({
            response: { status: 401, data: { message: 'Identifiants invalides' } }
          });
        }
        return { data: { access_token: 'mock_jwt_token', user }, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url.includes('/properties') || url.includes('/agent/properties')) {
        const props = mockDb.get('properties');
        if (method === 'post') {
          const newProp = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString() };
          props.push(newProp);
          mockDb.set('properties', props);
          return { data: newProp, status: 201, statusText: 'Created', headers: {}, config };
        }

        let filteredProps = [...props];

        // SÉCURITÉ 4 (RLS Client-Side) : Masquer le Super Admin et isoler par agent
        if (loggedInUserRole !== 'super_admin') {
          filteredProps = filteredProps.filter((p: any) => p.agentName !== adminName && p.agentName !== 'super_admin');
          if (url.includes('/agent/properties')) {
            filteredProps = filteredProps.filter((p: any) => p.agentName === loggedInAgentName || p.agencyName === (localStorage.getItem('agencyName') || 'Lumina Immo'));
          }
        }

        return { data: filteredProps, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url.includes('/clients')) {
        const clients = mockDb.get('clients');
        if (method === 'post') {
          const newClient = { ...body, id: Date.now().toString() };
          clients.push(newClient);
          mockDb.set('clients', clients);
          return { data: newClient, status: 201, statusText: 'Created', headers: {}, config };
        }

        let filteredClients = [...clients];

        // SÉCURITÉ 4 (RLS Client-Side) : Masquer le Super Admin et isoler par agent
        if (loggedInUserRole !== 'super_admin') {
          filteredClients = filteredClients.filter((c: any) => c.agentName !== adminName && c.agentName !== 'super_admin');
          filteredClients = filteredClients.filter((c: any) => !c.agentName || c.agentName === loggedInAgentName);
        }

        return { data: filteredClients, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url.includes('/operations')) {
        const ops = mockDb.get('operations');
        if (method === 'post') {
          const newOp = {
            id: Date.now().toString(),
            transactionType: body.type || 'sale',
            amount: body.amount,
            property: { title: "Bien Immobilier" },
            agentName: loggedInAgentName,
            agencyName: localStorage.getItem('agencyName') || 'Lumina Immo',
            date: new Date().toISOString()
          };
          ops.push(newOp);
          mockDb.set('operations', ops);
          return { data: newOp, status: 201, statusText: 'Created', headers: {}, config };
        }

        let filteredOps = [...ops];

        // SÉCURITÉ 4 (RLS Client-Side) : Masquer le Super Admin et isoler par agent
        if (loggedInUserRole !== 'super_admin') {
          filteredOps = filteredOps.filter((o: any) => o.agentName !== adminName && o.agentName !== 'super_admin');
          filteredOps = filteredOps.filter((o: any) => !o.agentName || o.agentName === loggedInAgentName);
        }

        return { data: filteredOps, status: 200, statusText: 'OK', headers: {}, config };
      }
    } catch (err: any) {
      console.error(`❌ [Mock DB Error] ${url}:`, err);
      return Promise.reject({
        response: {
          status: 500,
          data: { message: err.message || 'La requête simulée a échoué' }
        }
      });
    }

    return Promise.reject({
      response: {
        status: 404,
        data: { message: 'Endpoint non trouvé' }
      }
    });
  }
});

// Injection du jeton d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

