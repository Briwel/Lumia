import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight, 
  Play, 
  ArrowUpRight, 
  Smartphone, 
  CheckCircle2, 
  MessageSquare,
  Lock,
  Globe
} from 'lucide-react';
import { SpotlightCard } from './animations/SpotlightCard';
import { ShinyText } from './animations/ShinyText';
import { BlurText } from './animations/BlurText';
import { CountryCode } from '../types';
import { COUNTRIES } from '../constants';

interface WelcomeScreenProps {
  onExplore: () => void;
  onGoToPro: () => void;
  onOpenChat: () => void;
  currentCountry: CountryCode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onExplore,
  onGoToPro,
  onOpenChat,
  currentCountry
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'security' | 'legal'>('ai');
  const [simulatedMessages, setSimulatedMessages] = useState([
    { sender: 'user', text: "Je cherche une villa moderne de 4 chambres à Cotonou avec un titre foncier." },
    { sender: 'ai', text: "Recherche en cours dans notre base de données sécurisée... J'ai trouvé la Villa Fidjrossé : 4 chambres, piscine, titre foncier approuvé à 100%. Souhaitez-vous générer un compromis de vente ?" }
  ]);

  const country = COUNTRIES[currentCountry];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden">
      
      {/* 1. HERO SECTION WITH ANIMATED LIGHT GLOWS */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Soft abstract glowing background spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300/20 via-violet-300/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-emerald-100/30 rounded-full blur-[80px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* PWA Badge & Country Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 animate-fade-in">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Propulsé par l'IA
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  PWA Installable sur Mobile
                </span>
              </div>

              {/* Title with BlurText */}
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-2xl mx-auto lg:mx-0">
                <BlurText text="L'Immobilier Intelligent," duration={0.5} />
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-300% animate-gradient-flow">
                  Sécurisé & Conforme
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Découvrez la première plateforme immobilière qui allie un <span className="text-indigo-600 font-semibold">assistant IA conversationnel</span>, 
                la génération automatique de <span className="text-violet-600 font-semibold">contrats légaux certifiés</span> conformes aux normes du Bénin 🇧🇯 et de la France 🇫🇷, 
                et une architecture ultra-sécurisée contre les attaques.
              </p>

              {/* Interactive buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={onExplore}
                  className="w-full sm:w-auto px-8 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Building2 className="w-5 h-5" />
                  Rechercher un Bien
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={onGoToPro}
                  className="w-full sm:w-auto px-8 py-4.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5 text-slate-400" />
                  Espace Pro Agent
                </button>
              </div>

              {/* Soft trust badges */}
              <div className="pt-6 border-t border-slate-200/60 max-w-xl mx-auto lg:mx-0">
                <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <span className="block text-3xl font-black text-slate-900">99.8%</span>
                    <span className="text-slate-500 text-xs font-semibold">Transactions Sécurisées</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-black text-slate-900">100%</span>
                    <span className="text-slate-500 text-xs font-semibold">Conforme Code Foncier</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-black text-slate-900">1-Clic</span>
                    <span className="text-slate-500 text-xs font-semibold">Téléchargement PDF</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Hero Interactive App Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[380px] lg:max-w-none bg-slate-900 rounded-[3rem] p-3.5 shadow-2xl shadow-indigo-950/20 border-4 border-slate-800">
                
                {/* Simulated Screen */}
                <div className="bg-slate-950 rounded-[2.5rem] p-6 overflow-hidden text-white relative min-h-[460px] flex flex-col justify-between">
                  {/* Glowing core indicator */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />

                  {/* Header of simulation */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400">Assistant Intelligent</span>
                        <span className="block text-sm font-black text-white">Lumina IA</span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  </div>

                  {/* Body: Simulated conversation */}
                  <div className="flex-grow py-6 space-y-4 text-xs">
                    <div className="space-y-1.5 max-w-[85%]">
                      <span className="text-[10px] text-slate-500 font-bold uppercase ml-1">Acheteur</span>
                      <div className="bg-white/10 p-3.5 rounded-2xl rounded-tl-none border border-white/5 text-slate-200 leading-relaxed">
                        {simulatedMessages[0].text}
                      </div>
                    </div>

                    <div className="space-y-1.5 max-w-[90%] ml-auto text-right">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase mr-1">Lumina IA</span>
                      <div className="bg-gradient-to-r from-indigo-600/90 to-violet-600/90 p-3.5 rounded-2xl rounded-tr-none text-white text-left leading-relaxed shadow-lg shadow-indigo-900/30">
                        {simulatedMessages[1].text}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls / CTA to test the Chat */}
                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <button 
                      onClick={onOpenChat}
                      className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      Essayer l'Assistant IA en Direct
                    </button>
                    <p className="text-[10px] text-center text-slate-500">
                      Entièrement localisé pour le Bénin 🇧🇯 et la France 🇫🇷
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES BENTO GRID SECTION */}
      <section className="py-20 bg-slate-100/50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              L'écosystème complet
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Pensé pour les Acheteurs, Locataires et Agents
            </h2>
            <p className="text-slate-500 font-medium">
              Une alliance parfaite entre conformité légale, assistance par IA générative et sécurité de pointe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: AI Assistant */}
            <SpotlightCard className="flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Assistant IA de recherche</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Notre intelligence artificielle comprend le langage naturel, analyse les besoins complexes des clients et propose des correspondances de biens certifiées.
                </p>
              </div>
              <button 
                onClick={onOpenChat}
                className="mt-6 flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 group gap-1"
              >
                Lancer une discussion
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SpotlightCard>

            {/* Card 2: Legal Contracts */}
            <SpotlightCard className="flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100 text-violet-600">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Contrats certifiés en 1 clic</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Fini les baux et compromis douteux. Accédez instantanément à des documents rédigés selon les lois foncières en vigueur (Bénin 🇧🇯, France 🇫🇷).
                </p>
              </div>
              <button 
                onClick={onExplore}
                className="mt-6 flex items-center text-xs font-bold text-violet-600 hover:text-violet-700 group gap-1"
              >
                Explorer les annonces avec contrats
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SpotlightCard>

            {/* Card 3: Enterprise Security */}
            <SpotlightCard className="flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Pare-feu & Protection de Données</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sécurité avancée intégrée : filtre d'entrée anti-injection SQLi, pare-feu applicatif de requêtes (WAF), protection contre les attaques de force brute et isolation stricte des portefeuilles clients.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-max">
                <Lock className="w-3 h-3" />
                Activé en temps réel
              </div>
            </SpotlightCard>

          </div>
        </div>
      </section>

      {/* 3. PREMIUM CALL TO ACTION SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-600/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="max-w-3xl space-y-6 relative z-10 text-center md:text-left">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                Prêt à essayer ?
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Entrez dans une nouvelle ère de l'immobilier
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Que vous recherchiez une propriété ou que vous soyez un professionnel souhaitant simplifier et sécuriser ses transactions, Lumina Immo est là pour vous accompagner.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                <button 
                  onClick={onExplore}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.01]"
                >
                  Commencer l'exploration
                </button>
                <button 
                  onClick={onGoToPro}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10"
                >
                  Accéder à l'Espace Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
