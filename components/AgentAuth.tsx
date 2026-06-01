
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Building2, Sparkles, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';

interface AgentAuthProps {
  onLoginSuccess: (name: string) => void;
  onBack: () => void;
}

export const AgentAuth: React.FC<AgentAuthProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agencyName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, agencyName: formData.agencyName };

      const response = await api.post(endpoint, payload);
      
      /**
       * EXTRACTION ROBUSTE DES DONNÉES
       * Gère les structures { data: { user, token } } (Axios standard)
       * Et les structures { user, token } (Directes)
       */
      const result = response.data || response;
      
      // On cherche les propriétés même si elles sont encore un niveau plus bas
      const user = result.user || result.data?.user;
      const token = result.access_token || result.data?.access_token || result.token;

      if (user && token) {
        localStorage.setItem('auth_token', token);
        const displayName = user.name || user.email || 'Agent';
        onLoginSuccess(displayName);
      } else {
        console.error("Structure de réponse reçue:", response);
        throw new Error("Les données reçues du serveur sont incomplètes.");
      }
      
    } catch (err: any) {
      console.error("Détails de l'erreur d'Auth:", err);
      const errorMessage = err.response?.data?.message || err.message || "Erreur de connexion.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 min-h-[600px]">
        
        {/* Côté Gauche : Visuel & Infos */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-12 transition-colors font-bold group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour au site
            </button>
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Propulsez votre agence <br/>
              <span className="text-indigo-400">avec Lumina IA</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Gérez vos mandats, générez des descriptions automatiques et suivez vos ventes sur une interface unique.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Génération d'annonces par IA</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Pilotage de votre activité</span>
            </div>
          </div>
        </div>

        {/* Côté Droit : Formulaire */}
        <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                {isLogin ? 'Bon retour !' : 'Rejoindre Lumina'}
              </h3>
              <p className="text-slate-500">
                {isLogin 
                  ? 'Connectez-vous pour gérer vos biens.' 
                  : 'Créez votre compte agent en quelques secondes.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start text-red-600">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="Votre nom complet"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all font-medium"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="Nom de l'agence"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all font-medium"
                      value={formData.agencyName}
                      onChange={e => setFormData({...formData, agencyName: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="Adresse email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="Mot de passe"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center group active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>
                    {isLogin ? 'Se connecter' : 'Créer mon compte'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                {isLogin ? "Nouveau ici ?" : "Déjà un compte ?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-indigo-600 font-bold hover:underline"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
