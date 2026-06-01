
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PropertyCard } from './components/PropertyCard';
import { AIChat } from './components/AIChat';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentAuth } from './components/AgentAuth';
import api from './services/api';
import { COUNTRIES } from './constants';
import { 
  Search, 
  MapPin, 
  ArrowLeft, 
  Building2, 
  FileText, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Navigation,
  Loader2,
  Bed,
  Bath,
  Maximize,
  FileCheck,
  Download,
  User,
  Mail,
  Send,
  X,
  CheckCircle2
} from 'lucide-react';
import { Property, CountryCode } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'add' | 'details' | 'agent'>('home');
  const [currentCountry, setCurrentCountry] = useState<CountryCode>('BJ');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detectedCity, setDetectedCity] = useState<string>('');
  
  const [isAgentAuthenticated, setIsAgentAuthenticated] = useState(false);
  const [agentName, setAgentName] = useState('');

  // Contact Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const countryConfig = COUNTRIES[currentCountry];

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/properties');
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des biens:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedAgent = localStorage.getItem('agentName');
    if (savedAgent) {
      setAgentName(savedAgent);
      setIsAgentAuthenticated(true);
    }

    fetchProperties();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          if (lat > 20) {
            setCurrentCountry('FR');
            setDetectedCity('Paris');
          } else {
            setCurrentCountry('BJ');
            setDetectedCity('Cotonou');
          }
        }
      );
    }
  }, []);

  const handleLoginSuccess = (name: string) => {
    setAgentName(name);
    setIsAgentAuthenticated(true);
    localStorage.setItem('agentName', name);
    setActiveView('agent');
    fetchProperties();
  };

  const handleLogout = () => {
    setIsAgentAuthenticated(false);
    setAgentName('');
    localStorage.removeItem('agentName');
    localStorage.removeItem('auth_token');
    setActiveView('home');
    fetchProperties();
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setIsSubmittingContact(true);
    try {
        await api.post('/clients', {
            ...contactForm,
            role: selectedProperty.type === 'sale' ? 'Acheteur' : 'Locataire',
            interest: selectedProperty.title,
            budget: `${selectedProperty.price} (Affiché)`
        });
        alert('Votre demande de contact a été envoyée à l\'agent ! Il vous recontactera sous peu.');
        setIsContactModalOpen(false);
        setContactForm({ name: '', email: '', phone: '' });
    } catch (error) {
        alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
        setIsSubmittingContact(false);
    }
  };

  const filteredProperties = useMemo(() => {
    const propsToFilter = Array.isArray(properties) ? properties : [];
    return propsToFilter.filter(p => {
      if (!p) return false;
      const matchesCountry = p.country === currentCountry;
      const matchesSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || p.type === filterType;
      const matchesStatus = p.status !== 'sold'; 
      return matchesCountry && matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, searchTerm, filterType, currentCountry]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setActiveView('details');
    window.scrollTo(0, 0);
  };

  const formatPrice = (price: number, country: CountryCode) => {
    const config = COUNTRIES[country];
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const renderHome = () => (
    <>
      <div className="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/lumina_hero_1780162841140.png" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-50"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-sm font-semibold mb-6 animate-fade-in-up">
            ✨ Immobilier {countryConfig.name} avec Lumina IA
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tight leading-tight">
            Réinventez votre recherche <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">au {countryConfig.name}</span>
          </h1>
          
          <div className="bg-white/95 backdrop-blur-xl p-3 rounded-3xl shadow-2xl shadow-indigo-900/20 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto transform transition-all hover:scale-[1.01]">
            <div className="flex-grow flex items-center bg-slate-50 rounded-xl px-6 py-4 border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Quel type de bien recherchez-vous ? (Villa...)" 
                className="bg-transparent w-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center min-w-[160px]">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Biens à la une</h2>
            <p className="text-slate-500">Sélection exclusive en {countryConfig.name} {detectedCity ? `proche de ${detectedCity}` : ''}</p>
          </div>
          <div className="flex gap-2">
            {['all', 'sale', 'rent'].map((t) => (
              <button 
                key={t}
                onClick={() => setFilterType(t as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterType === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
              >
                {t === 'all' ? 'Tout' : t === 'sale' ? 'Vente' : 'Location'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Chargement des offres en cours...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} onClick={() => handlePropertyClick(property)} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400">
                Aucun bien disponible pour le moment.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  const renderDetails = () => {
    if (!selectedProperty) return null;
    const isRent = selectedProperty.type === 'rent';
    const country = COUNTRIES[selectedProperty.country];

    return (
      <div className="bg-slate-50 min-h-screen pb-20 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setActiveView('home')} className="flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour aux résultats
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img src={selectedProperty.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                <div className="absolute top-6 left-6 flex gap-2">
                   <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold">{country.flag} {country.name}</span>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <div className="flex gap-2 mb-6">
                   <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white ${isRent ? 'bg-emerald-500' : 'bg-indigo-600'}`}>{isRent ? 'Location' : 'Vente'}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{selectedProperty.title}</h1>
                <div className="flex items-center text-slate-500 text-lg mb-8">
                  <MapPin className="h-6 w-6 mr-2 text-indigo-500" />
                  {selectedProperty.location}
                </div>
                <div className="grid grid-cols-3 gap-6 py-8 border-y border-slate-100 mb-8 text-center">
                  <div className="flex flex-col"><span className="text-slate-400 text-xs font-bold uppercase mb-1">Chambres</span><span className="text-2xl font-extrabold">{selectedProperty.bedrooms}</span></div>
                  <div className="flex flex-col"><span className="text-slate-400 text-xs font-bold uppercase mb-1">Bains</span><span className="text-2xl font-extrabold">{selectedProperty.bathrooms}</span></div>
                  <div className="flex flex-col"><span className="text-slate-400 text-xs font-bold uppercase mb-1">Surface</span><span className="text-2xl font-extrabold">{selectedProperty.sqft} m²</span></div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Description</h3>
                <p className="text-slate-600 leading-relaxed text-lg mb-10">{selectedProperty.description}</p>
                
                {/* SECTION ÉQUIPEMENTS & ATOUTS */}
                {selectedProperty.features && selectedProperty.features.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                            <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                            Équipements & Atouts
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {selectedProperty.features.map((feature, idx) => (
                                <span key={idx} className="px-4 py-2.5 bg-slate-50 rounded-xl text-slate-700 font-semibold text-sm flex items-center border border-slate-100 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <ShieldCheck className="h-10 w-10 text-emerald-500 mr-4" />
                  <div>
                    <h4 className="font-bold text-slate-900">Bien vérifié par Lumina</h4>
                    <p className="text-sm text-slate-500">Documentations foncières conformes ({country.legalMention})</p>
                  </div>
                </div>

                {/* SECTION CONTRAT DANS LES DÉTAILS */}
                {selectedProperty.contract && (
                  <div className="mt-10 bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
                     
                     <div className="flex items-start mb-6 relative z-10">
                        <div className="p-4 bg-indigo-50 rounded-2xl mr-5 border border-indigo-100">
                           <FileCheck className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                           <h3 className="text-xl font-bold text-slate-900 mb-1">Documentation Légale</h3>
                           <p className="text-indigo-600 font-semibold text-sm mb-2">{selectedProperty.contract.name}</p>
                           {selectedProperty.contract.description && (
                              <p className="text-slate-500 text-sm italic border-l-2 border-slate-200 pl-3">
                                {selectedProperty.contract.description}
                              </p>
                           )}
                        </div>
                     </div>

                     {/* Aperçu du contrat */}
                     {selectedProperty.contract.contentPreview && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 mb-6 relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                           <p className="whitespace-pre-wrap leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                             {selectedProperty.contract.contentPreview}
                           </p>
                           <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
                           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-slate-400 border border-slate-100">Aperçu partiel</div>
                        </div>
                     )}

                     <button
                       onClick={() => alert("Le téléchargement du document démarrera sous peu (Simulation).")}
                       className="w-full flex items-center justify-center py-4 border-2 border-indigo-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 rounded-xl text-indigo-700 font-bold transition-all shadow-sm group"
                     >
                        <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Télécharger le document (PDF)
                     </button>
                  </div>
                )}

              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-28">
                <p className="text-indigo-300 text-sm font-bold uppercase mb-2">Prix total</p>
                <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-4xl font-extrabold">{formatPrice(selectedProperty.price, selectedProperty.country)}</span>
                  {isRent && <span className="text-lg text-slate-400">/mois</span>}
                </div>
                <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-indigo-600 py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center mb-4"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contacter l'Agent
                </button>
                <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-white/10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-md text-white"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Envoyer un message
                </button>
                <p className="text-center text-xs text-slate-500 mt-6">
                   Réponse moyenne sous 2h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout 
      activeView={activeView} 
      onChangeView={setActiveView}
      onOpenChat={() => setIsChatOpen(true)}
      currentCountry={currentCountry}
    >
      {activeView === 'home' && renderHome()}
      {activeView === 'details' && renderDetails()}
      {activeView === 'agent' && (
        !isAgentAuthenticated 
          ? <AgentAuth onLoginSuccess={handleLoginSuccess} onBack={() => setActiveView('home')} />
          : <AgentDashboard agentName={agentName} onLogout={handleLogout} />
      )}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* MODAL DE CONTACT */}
      {isContactModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 relative">
                      <button 
                        onClick={() => setIsContactModalOpen(false)}
                        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                      >
                          <X className="w-5 h-5" />
                      </button>
                      <h3 className="text-2xl font-bold text-white mb-2">Contact Rapide</h3>
                      <p className="text-indigo-100 text-sm">Laissez vos coordonnées pour être recontacté par l'agent concernant <span className="font-bold">"{selectedProperty?.title}"</span>.</p>
                  </div>
                  
                  <form onSubmit={handleContactSubmit} className="p-8 space-y-5">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom & Prénom</label>
                          <div className="relative">
                              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                              <input 
                                  type="text" 
                                  required
                                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                  placeholder="Jean Dupont"
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                              <input 
                                  type="email" 
                                  required
                                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                  placeholder="jean@exemple.com"
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp / Téléphone</label>
                          <div className="relative">
                              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                              <input 
                                  type="tel" 
                                  required
                                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                  placeholder="+229 97 00 00 00"
                                  value={contactForm.phone}
                                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                              />
                          </div>
                      </div>

                      <button 
                          type="submit" 
                          disabled={isSubmittingContact}
                          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center mt-4"
                      >
                          {isSubmittingContact ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                              <>
                                  <Send className="w-5 h-5 mr-2" />
                                  Envoyer ma demande
                              </>
                          )}
                      </button>
                      
                      <p className="text-center text-[10px] text-slate-400 px-4">
                          En envoyant ce formulaire, vous acceptez d'être contacté par l'agent immobilier pour ce bien.
                      </p>
                  </form>
              </div>
          </div>
      )}

    </Layout>
  );
};

export default App;
