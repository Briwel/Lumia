import React, { useState, useEffect } from 'react';
import { Home, Menu, X, UserCircle } from 'lucide-react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../constants';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'welcome' | 'home' | 'add' | 'agent' | 'details';
  onChangeView: (view: 'welcome' | 'home' | 'add' | 'agent' | 'details') => void;
  currentCountry: CountryCode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onChangeView, 
  currentCountry
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const country = COUNTRIES[currentCountry];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentMode = (activeView === 'home' || activeView === 'welcome') && !scrolled;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
      {/* Navbar */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isTransparentMode 
            ? 'bg-transparent py-4' 
          : 'bg-white/95 shadow-sm border-b border-slate-200 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => onChangeView('welcome')}>
              <div className="h-10 w-10 bg-[#102a43] rounded-sm flex items-center justify-center mr-3 shadow-lg group-hover:bg-[#c49a5a] transition-colors duration-300">
                <Home className="h-5 w-5 text-[#f8f5ef]" />
              </div>
              <span className={`font-extrabold text-2xl tracking-tight transition-colors ${isTransparentMode ? 'text-white' : 'text-slate-900'}`}>
                Lumina<span className="text-[#c49a5a]"> Immo</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <div className="hidden lg:flex items-center space-x-1">
                <button 
                  onClick={() => onChangeView('welcome')} 
                  className={`px-3 xl:px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeView === 'welcome' 
                      ? 'bg-[#102a43] text-white'
                      : isTransparentMode ? 'text-slate-100 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Accueil
                </button>
                <button 
                  onClick={() => onChangeView('home')} 
                  className={`px-3 xl:px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeView === 'home' 
                      ? 'bg-[#102a43] text-white'
                      : isTransparentMode ? 'text-slate-100 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Acheter / Louer
                </button>
                <button 
                  onClick={() => onChangeView('agent')} 
                  className={`px-3 xl:px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center ${
                    activeView === 'agent' 
                      ? 'bg-[#102a43] text-white'
                      : isTransparentMode ? 'text-slate-100 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Espace Pro
                </button>
              </div>

              <button 
                onClick={() => onChangeView('agent')} 
                className={`flex items-center px-4 lg:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isTransparentMode 
                    ? 'bg-white text-slate-900 hover:bg-slate-100' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                }`}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Connexion
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className={`p-2 rounded-xl ${isTransparentMode ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-fade-in flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-[#102a43] rounded-sm flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900">Lumina <span className="text-[#c49a5a]">Immo</span></span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-grow p-6 space-y-2">
            <button 
              onClick={() => { onChangeView('welcome'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-5 py-4 rounded-lg font-bold transition-all ${activeView === 'welcome' ? 'bg-amber-50 text-[#102a43]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => { onChangeView('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-5 py-4 rounded-lg font-bold transition-all ${activeView === 'home' ? 'bg-amber-50 text-[#102a43]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Acheter / Louer
            </button>
            <button 
              onClick={() => { onChangeView('agent'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-5 py-4 rounded-lg font-bold transition-all ${activeView === 'agent' ? 'bg-amber-50 text-[#102a43]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Espace Pro
            </button>
          </div>

          <div className="p-6 border-t border-slate-100">
             <button 
                onClick={() => { onChangeView('agent'); setMobileMenuOpen(false); }}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center"
             >
                <UserCircle className="w-5 h-5 mr-2" />
                Se connecter
             </button>
          </div>
        </div>
      )}

      <main className="flex-grow pt-0">{children}</main>

      <footer className="bg-slate-950 text-white pt-20 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-[#c49a5a] rounded-sm flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white">Lumina <span className="text-[#c49a5a]">Immo</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Votre interlocuteur de confiance pour des projets immobiliers durables.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Légal ({country.code})</h3>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>{country.legalMention}</li>
              <li>Conditions Générales</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          <p>&copy; 2024 Lumina Immo. Localisé pour {country.name}.</p>
        </div>
      </footer>
    </div>
  );
};