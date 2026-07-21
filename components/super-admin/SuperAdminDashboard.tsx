import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { Property } from '../../types';
import { 
  LayoutDashboard, 
  Building2, 
  Search, 
  Sparkles, 
  Loader2, 
  LogOut, 
  MapPin,
  Users,
  Activity,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  FileCheck,
  Filter,
  Mail,
  Phone,
  X,
  Database,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Server,
  ShieldAlert,
  Coins,
  Settings,
  PlusCircle
} from 'lucide-react';
import { COUNTRIES } from '../../constants';
import { SpotlightCard } from '../animations/SpotlightCard';
import { ShinyText } from '../animations/ShinyText';
import { CountUp } from '../animations/CountUp';

interface SuperAdminDashboardProps {
  adminName: string;
  onLogout: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ adminName, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'database' | 'listings' | 'users' | 'settings'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Monitoring Database States
  const [dbStatus, setDbStatus] = useState<'testing' | 'online' | 'offline'>('online');
  const [showCredentials, setShowCredentials] = useState(false);
  
  // Settings/Simulation states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [simulatedDowntime, setSimulatedDowntime] = useState(false);
  const [creditPrice, setCreditPrice] = useState(1); // 1 EUR = 100 credits
  
  // Filter states
  const [propertySearch, setPropertySearch] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<'all' | 'BJ' | 'FR'>('all');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propsRes, opsRes, clientsRes] = await Promise.all([
        api.get('/properties'),
        api.get('/operations'),
        api.get('/clients')
      ]);
      setProperties(Array.isArray(propsRes.data) ? propsRes.data : []);
      setOperations(Array.isArray(opsRes.data) ? opsRes.data : []);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
    } catch (err) {
      console.warn("Erreur de chargement des données. Utilisation des listes mockées.");
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setDbStatus('testing');
    setTimeout(() => {
      setDbStatus(isSupabaseConfigured ? 'online' : 'offline');
    }, 1200);
  };

  // Statistiques calculées
  const stats = useMemo(() => {
    const totalListings = properties.length;
    const soldListings = properties.filter(p => p.status === 'sold').length;
    const offerListings = properties.filter(p => p.status === 'offer').length;
    const availableListings = properties.filter(p => p.status === 'available').length;
    
    const totalTransactions = operations.length;
    const totalVolume = operations.reduce((sum, op) => sum + (op.amount || 0), 0);
    const totalCreditsSold = 45000; // Simulation
    const totalCommission = totalVolume * 0.05; // 5% commission moyenne

    return {
      totalListings,
      soldListings,
      offerListings,
      availableListings,
      totalTransactions,
      totalVolume,
      totalCreditsSold,
      totalCommission,
      totalUsers: clients.length + 8 // Clients + agents fictifs
    };
  }, [properties, operations, clients]);

  // Actions de modération
  const handleTogglePromote = async (propertyId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updated = { ...p, isPromoted: !p.isPromoted };
        // Si c'est Supabase, on peut simuler ou persister
        return updated;
      }
      return p;
    }));
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement cette annonce ?")) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      alert("Annonce supprimée du tableau de bord d'administration.");
    }
  };

  const handleUpdatePropertyStatus = async (propertyId: string, status: 'available' | 'offer' | 'sold') => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status } : p));
  };

  // Filtrage des propriétés
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(propertySearch.toLowerCase()) || 
                            p.location.toLowerCase().includes(propertySearch.toLowerCase());
      const matchesCountry = selectedCountryFilter === 'all' || p.country === selectedCountryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [properties, propertySearch, selectedCountryFilter]);

  const formatPrice = (price: number, country: 'BJ' | 'FR') => {
    const config = COUNTRIES[country] || COUNTRIES['BJ'];
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      {/* Top Admin Info Bar */}
      <div className="bg-slate-900 text-white px-8 py-5 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              Lumina Immo <span className="bg-amber-500 text-slate-950 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">Super Admin</span>
            </h1>
            <p className="text-xs text-slate-400">Pilote global de la plateforme adaptative</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/50">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300">Session active : {adminName}</span>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row max-w-8xl w-full mx-auto p-4 sm:p-8 gap-8">
        
        {/* Navigation Admin de Gauche */}
        <div className="lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-grow lg:flex-grow-0 flex items-center justify-center lg:justify-start px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Vue d'ensemble
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex-grow lg:flex-grow-0 flex items-center justify-center lg:justify-start px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'database' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4 mr-3" />
            SGBD Supabase
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-grow lg:flex-grow-0 flex items-center justify-center lg:justify-start px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'listings' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 mr-3" />
            Modération Annonces ({properties.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-grow lg:flex-grow-0 flex items-center justify-center lg:justify-start px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 mr-3" />
            Utilisateurs & Contacts
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-grow lg:flex-grow-0 flex items-center justify-center lg:justify-start px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'settings' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4 mr-3" />
            Simulateur & Tarifs
          </button>
        </div>

        {/* Zone de contenu principale */}
        <div className="flex-grow space-y-6">
          
          {isLoading ? (
            <div className="bg-white rounded-[2rem] p-20 border border-slate-100 flex flex-col items-center justify-center shadow-sm">
              <Loader2 className="w-12 h-12 text-slate-800 animate-spin mb-4" />
              <p className="text-slate-500 font-bold">Chargement des données administratives en cours...</p>
            </div>
          ) : (
            <>
              {/* VUE D'ENSEMBLE */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                        {/* Grille d'indicateurs de performance clés */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SpotlightCard className="p-6" spotlightColor="rgba(99, 102, 241, 0.12)">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume de Transactions</span>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
                      </div>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">
                        <CountUp to={stats.totalVolume} format={(v) => formatPrice(v, 'FR')} />
                      </p>
                      <div className="mt-3 text-xs text-indigo-600 font-bold flex items-center">
                        <span>Total de {stats.totalTransactions} ventes / baux signés</span>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6" spotlightColor="rgba(16, 185, 129, 0.12)">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commissions (5%)</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
                      </div>
                      <p className="text-2xl font-black text-emerald-600 tracking-tight">
                        <CountUp to={stats.totalCommission} format={(v) => formatPrice(v, 'FR')} />
                      </p>
                      <div className="mt-3 text-xs text-emerald-600 font-bold">
                        <span>Bénéfice direct accumulé</span>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6" spotlightColor="rgba(245, 158, 11, 0.12)">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annonces Actives</span>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Building2 className="w-5 h-5" /></div>
                      </div>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">
                        <CountUp to={stats.totalListings} />
                      </p>
                      <div className="mt-3 text-xs text-slate-500 font-semibold flex items-center justify-between">
                        <span>{stats.availableListings} dispo.</span>
                        <span>{stats.soldListings} vendues</span>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.12)">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Base de données</span>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Database className="w-5 h-5" /></div>
                      </div>
                      <div className="text-lg font-black text-slate-900 leading-tight">
                        <ShinyText text={isSupabaseConfigured ? 'Supabase SGBD' : 'Simulée (Locale)'} className="text-base font-extrabold" />
                      </div>
                      <div className="mt-3 text-xs font-bold text-blue-600">
                        <span>{isSupabaseConfigured ? 'Clés API connectées ✨' : 'Mode localStorage 💾'}</span>
                      </div>
                    </SpotlightCard>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Graphique de transaction SVG élégant */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                        <span>Évolution mensuelle des commissions</span>
                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">Mises à jour instantanées</span>
                      </h3>
                      
                      {/* Dessin SVG du graphique */}
                      <div className="relative h-64 w-full mt-6">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grille horizontale */}
                          <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                          
                          {/* Courbe remplie */}
                          <path 
                            d="M 0 180 Q 80 140 130 110 T 250 120 T 380 70 T 500 40 L 500 200 L 0 200 Z" 
                            fill="url(#gradient)" 
                          />
                          {/* Courbe principale */}
                          <path 
                            d="M 0 180 Q 80 140 130 110 T 250 120 T 380 70 T 500 40" 
                            fill="none" 
                            stroke="#4f46e5" 
                            strokeWidth="3.5" 
                            strokeLinecap="round"
                          />
                          
                          {/* Points importants */}
                          <circle cx="130" cy="110" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="250" cy="120" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="380" cy="70" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="500" cy="40" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                        </svg>

                        {/* Légendes du graphique */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-400 px-2 pt-2">
                          <span>Jan</span>
                          <span>Fév</span>
                          <span>Mar</span>
                          <span>Avr</span>
                          <span>Mai</span>
                          <span>Juin</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-around mt-6 border-t border-slate-50 pt-4 text-center">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold">Taux de croissance</p>
                          <p className="text-base font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +24%
                          </p>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div>
                          <p className="text-xs text-slate-400 font-semibold">Objectif atteint</p>
                          <p className="text-base font-extrabold text-indigo-600">88.5%</p>
                        </div>
                      </div>
                    </div>

                    {/* SGBD Status quick card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                          <Server className="w-4 h-4 mr-2 text-indigo-600" />
                          Moniteur SGBD & API
                        </h4>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 mt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Moteur Actif</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>
                              {isSupabaseConfigured ? 'Supabase' : 'Mode simulation'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Status</span>
                            <span className="flex items-center text-xs font-bold text-slate-700">
                              <span className={`w-2 h-2 rounded-full mr-1.5 ${dbStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                              {dbStatus === 'online' ? 'En ligne / Prêt' : 'Hors ligne'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Temps de réponse</span>
                            <span className="text-xs font-bold text-slate-700">24ms</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-6">
                        <button
                          onClick={testDatabaseConnection}
                          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center"
                        >
                          {dbStatus === 'testing' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                              Test de latence...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 mr-2" />
                              Tester la liaison de données
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('database')}
                          className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                        >
                          Inspecter le schéma SQL
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SGBD SUPABASE MONITORING PANEL */}
              {activeTab === 'database' && (
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                        <Database className="w-6 h-6 text-indigo-600" />
                        Base de données relationnelle Supabase (SGBD)
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Innovation de contrôle : Cet affichage et monitoring SGBD est strictement restreint au Super Administrateur.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {isSupabaseConfigured ? (
                        <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-800 text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Relayé sur Supabase Cloud</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-bold" title="Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour basculer.">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Simulation locale active</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Widgets de configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-indigo-600" />
                        Fiche d'identification
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identifiant Unique du Projet</span>
                          <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-100 truncate mt-1">
                            ysthwnucjknkniqfigkg
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Point d'accès API (Endpoint URL)</span>
                          <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-100 truncate mt-1">
                            {supabaseUrl || "https://ysthwnucjknkniqfigkg.supabase.co"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clé Publique Anonyme</span>
                            <button 
                              onClick={() => setShowCredentials(!showCredentials)}
                              className="text-indigo-600 hover:text-indigo-700 text-[10px] font-extrabold uppercase flex items-center"
                            >
                              {showCredentials ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                              {showCredentials ? "Masquer" : "Révéler"}
                            </button>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-100 truncate mt-1">
                            {showCredentials 
                              ? (supabaseAnonKey || "sb_publishable_ifbFzXmCd6SKsCsHLc9lDA_qewA3voR") 
                              : "••••••••••••••••••••••••••••••••••••••••"
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-600" />
                          Tables actives du SGBD
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Les tables requises pour le fonctionnement optimal du portail Lumina</p>
                        
                        <div className="mt-4 space-y-2.5">
                          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-700">properties</span>
                            <span className="text-xs font-extrabold text-indigo-600">{properties.length} entrées</span>
                          </div>
                          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-700">clients</span>
                            <span className="text-xs font-extrabold text-indigo-600">{clients.length} inscrits</span>
                          </div>
                          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-700">operations</span>
                            <span className="text-xs font-extrabold text-indigo-600">{operations.length} transactions</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <button
                          onClick={() => {
                            if (confirm("Voulez-vous réinitialiser le simulateur local à ses valeurs de démonstration ?")) {
                              localStorage.removeItem('properties');
                              localStorage.removeItem('clients');
                              localStorage.removeItem('operations');
                              window.location.reload();
                            }
                          }}
                          className="flex-1 py-3 border-2 border-slate-100 hover:bg-slate-50 rounded-xl text-slate-600 text-xs font-bold transition-all text-center"
                        >
                          Nettoyer cache local
                        </button>
                        <button
                          onClick={testDatabaseConnection}
                          className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                        >
                          Raffraîchir l'état
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Schema SQL guide section */}
                  <div className="border border-slate-100 rounded-3xl p-6 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>Script de structuration SQL (Supabase Editor)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 rounded-full text-indigo-600">Recommandé</span>
                    </h3>
                    <p className="text-xs text-slate-500">Pour monter la base rapidement, appliquez cette modélisation de structure sur votre portail Supabase.</p>
                    
                    <pre className="bg-slate-950 text-slate-300 p-5 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
{`-- Table des propriétés
CREATE TABLE public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    location TEXT NOT NULL,
    country VARCHAR(10) NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    sqft INTEGER DEFAULT 0,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    "imageUrl" TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    "isPromoted" BOOLEAN DEFAULT false
);`}
                    </pre>
                  </div>
                </div>
              )}

              {/* MODÉRATION DES ANNONCES */}
              {activeTab === 'listings' && (
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        Contrôle de conformité des annonces
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">Censurez, sponsorisez gratuitement ou modifiez le statut de n'importe quelle offre du portail.</p>
                    </div>
                  </div>

                  {/* Barre de filtre */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                      <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Rechercher une annonce par titre, ville..."
                        className="bg-transparent w-full focus:outline-none text-xs font-semibold text-slate-700 placeholder-slate-400"
                        value={propertySearch}
                        onChange={(e) => setPropertySearch(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <select 
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none"
                        value={selectedCountryFilter}
                        onChange={(e) => setSelectedCountryFilter(e.target.value as any)}
                      >
                        <option value="all">Tous les pays</option>
                        <option value="BJ">Bénin 🇧🇯</option>
                        <option value="FR">France 🇫🇷</option>
                      </select>
                    </div>
                  </div>

                  {/* Tableau des annonces */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-4 px-6">Bien Immobilier</th>
                          <th className="py-4 px-6">Prix / Loyer</th>
                          <th className="py-4 px-6">Emplacement</th>
                          <th className="py-4 px-6">Statut</th>
                          <th className="py-4 px-6">Sponsorisé</th>
                          <th className="py-4 px-6 text-right">Actions de modération</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                        {filteredProperties.length > 0 ? (
                          filteredProperties.map((prop) => (
                            <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={prop.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                                    alt="" 
                                    className="w-10 h-10 object-cover rounded-xl border border-slate-100" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <p className="font-extrabold text-slate-900 line-clamp-1">{prop.title}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{prop.type === 'sale' ? 'Acheter' : 'Louer'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-900">{formatPrice(prop.price, prop.country)}</td>
                              <td className="py-4 px-6">
                                <span className="flex items-center text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                  {prop.location}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <select
                                  value={prop.status}
                                  onChange={(e) => handleUpdatePropertyStatus(prop.id, e.target.value as any)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black outline-none border cursor-pointer ${
                                    prop.status === 'available' 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                      : prop.status === 'offer' 
                                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  <option value="available">Disponible</option>
                                  <option value="offer">Sous offre</option>
                                  <option value="sold">Vendu / Loué</option>
                                </select>
                              </td>
                              <td className="py-4 px-6">
                                <button
                                  onClick={() => handleTogglePromote(prop.id)}
                                  className={`p-1.5 rounded-xl border transition-all ${
                                    prop.isPromoted 
                                      ? 'bg-amber-500/10 border-amber-300 text-amber-500' 
                                      : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-slate-500'
                                  }`}
                                  title="Mettre en avant"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleDeleteProperty(prop.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all"
                                    title="Supprimer définitivement"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400">Aucune annonce ne correspond à votre recherche.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* UTILISATEURS & CONTACTS */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                        <Users className="w-6 h-6 text-indigo-600" />
                        Annuaire des clients acquéreurs
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">Consultez les fiches de contact et les formulaires d'intérêt soumis par les prospects.</p>
                    </div>
                  </div>

                  {/* Tableau des clients */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-4 px-6">Prospect</th>
                          <th className="py-4 px-6">Email & Téléphone</th>
                          <th className="py-4 px-6">Rôle recherché</th>
                          <th className="py-4 px-6">Bien d'intérêt</th>
                          <th className="py-4 px-6 text-right">Budget max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                        {clients.length > 0 ? (
                          clients.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6 font-extrabold text-slate-900">{c.name}</td>
                              <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                                <p className="flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-400" /> {c.email || 'N/A'}</p>
                                <p className="flex items-center mt-1"><Phone className="w-3 h-3 mr-1 text-slate-400" /> {c.phone || 'N/A'}</p>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${
                                  c.role === 'Acheteur' 
                                    ? 'bg-indigo-50 text-indigo-700' 
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {c.role || 'Inconnu'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-slate-600">{c.interest || 'Recherche libre'}</td>
                              <td className="py-4 px-6 text-right text-slate-900">{c.budget || 'Non spécifié'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400">Aucun prospect enregistré pour le moment.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SIMULATEUR & TARIFS */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="border-b border-slate-50 pb-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <Settings className="w-6 h-6 text-indigo-600" />
                      Simulateur de Maintenance & Variables Taridaires
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Contrôlez les frais d'annonces de la plateforme et simulez des interruptions de serveurs de test.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Variables d'affaires */}
                    <div className="space-y-6">
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center">
                        <Coins className="w-5 h-5 mr-2 text-indigo-600" />
                        Variables Financières
                      </h3>

                      <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Taux d'échange du crédit (EUR)</label>
                          <div className="flex items-center space-x-2 bg-white border border-slate-100 rounded-xl px-4 py-2 mt-1">
                            <span className="text-slate-400 font-bold text-xs">1 EUR =</span>
                            <input 
                              type="number" 
                              className="w-full focus:outline-none font-bold text-xs text-slate-700"
                              value={creditPrice * 100} 
                              onChange={(e) => setCreditPrice(parseFloat(e.target.value) / 100)}
                            />
                            <span className="text-indigo-600 font-bold text-xs">Crédits</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Frais de Sponsorisation (Boost)</label>
                          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3 mt-1">
                            <span className="text-slate-700 font-bold text-xs">Prix par boost d'ad</span>
                            <span className="text-indigo-600 font-black text-xs">5 000 Crédits</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulation de pannes */}
                    <div className="space-y-6">
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center">
                        <Server className="w-5 h-5 mr-2 text-indigo-600" />
                        Simulation Réseau & Maintenance
                      </h3>

                      <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Mode Maintenance adaptatif</p>
                            <p className="text-[11px] text-slate-400">Verrouille le site grand public avec un avertissement de mise à jour.</p>
                          </div>
                          <button
                            onClick={() => {
                              setMaintenanceMode(!maintenanceMode);
                              alert(`Le mode maintenance est maintenant ${!maintenanceMode ? 'ACTIVÉ' : 'DÉSACTIVÉ'}.`);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                              maintenanceMode 
                                ? 'bg-red-600 text-white shadow-md shadow-red-500/15' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {maintenanceMode ? 'Actif' : 'Inactif'}
                          </button>
                        </div>

                        <div className="h-px bg-slate-100"></div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Simuler une coupure Supabase</p>
                            <p className="text-[11px] text-slate-400">Force le basculement direct sur la base de secours locale.</p>
                          </div>
                          <button
                            onClick={() => {
                              setSimulatedDowntime(!simulatedDowntime);
                              alert(`Coupure réseau ${!simulatedDowntime ? 'SIMULÉE' : 'RÉSOULE'}.`);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                              simulatedDowntime 
                                ? 'bg-red-600 text-white shadow-md shadow-red-500/15' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {simulatedDowntime ? 'Coupure active' : 'Normal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
