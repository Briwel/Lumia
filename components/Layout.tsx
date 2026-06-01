import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, Menu, X, UserCircle } from 'lucide-react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'home' | 'add' | 'agent' | 'details';
  onChangeView: (view: 'home' | 'add' | 'agent' | 'details') => void;
  onOpenChat: () => void;
  currentCountry: CountryCode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onChangeView, 
  onOpenChat, 
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

  const isTransparentMode = activeView === 'home' && !scrolled;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Navbar */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isTransparentMode 
            ? 'bg-transparent py-4' 
            : 'glass-effect shadow-md border-b border-slate-200/50 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => onChangeView('home')}>
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className={`font-extrabold text-2xl tracking-tight transition-colors ${isTransparentMode ? 'text-white' : 'text-slate-900'}`}>
                Lumina<span className="text-indigo-600">Immo</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => onChangeView('home')} 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeView === 'home' 
                    ? 'bg-indigo-600 text-white' 
                    : isTransparentMode ? 'text-slate-100 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Acheter / Louer
              </button>
              <button 
                onClick={() => onChangeView('agent')} 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center ${
                  activeView === 'agent' 
                    ? 'bg-indigo-600 text-white' 
                    : isTransparentMode ? 'text-slate-100 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Espace Pro
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => onChangeView('agent')} 
                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
            <div className="md:hidden flex items-center space-x-3">
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
        <div className="md:hidden fixed inset-0 z-[60] bg-white animate-fade-in flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900">LuminaImmo</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-grow p-6 space-y-2">
            <button 
              onClick={() => { onChangeView('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${activeView === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Acheter / Louer
            </button>
            <button 
              onClick={() => { onChangeView('agent'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${activeView === 'agent' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
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

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={onOpenChat} 
          className="group relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
        >
          <span className="absolute inset-0 rounded-full bg-white opacity-20 group-hover:animate-ping"></span>
          <MessageCircle className="h-8 w-8 relative z-10" />
        </button>
      </div>

      <footer className="bg-slate-950 text-white pt-20 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white">Lumina<span className="text-indigo-400">Immo</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Plateforme immobilière intelligente adaptative.</p>
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