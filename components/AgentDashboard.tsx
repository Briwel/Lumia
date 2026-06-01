
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  LayoutDashboard, 
  Building2, 
  Plus, 
  Search, 
  Sparkles, 
  Loader2, 
  LogOut, 
  MapPin,
  FileText,
  Users,
  Activity,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Upload,
  ShieldCheck,
  FileCheck,
  Filter,
  Mail,
  Phone,
  Image as ImageIcon,
  X,
  ListPlus,
  CreditCard,
  Zap
} from 'lucide-react';
import { Property } from '../types';
import { generatePropertyDescription } from '../services/geminiService';

interface AgentDashboardProps {
  agentName: string;
  onLogout: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agentName, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'create' | 'clients' | 'contracts' | 'ops'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Système de monétisation
  const [credits, setCredits] = useState(2500); // Solde initial simulé
  const BOOST_COST = 5000;

  // States pour la recherche client
  const [clientSearch, setClientSearch] = useState('');
  const [clientFilter, setClientFilter] = useState<'all' | 'Acheteur' | 'Locataire'>('all');

  const [contracts] = useState([
    { id: 'c1', type: 'Bail Habitation', property: 'Appartement Haie Vive', client: 'Marc Koffi', status: 'Signé', date: '2024-03-15' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    location: '', 
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    features: '',
    type: 'sale' as 'sale' | 'rent',
    description: '',
    country: 'BJ' as any,
    imageUrl: '',
    contractMode: 'template' as 'template' | 'upload',
    contractName: '',
    contractDescription: ''
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.contractMode === 'template') {
        const defaultTemplate = formData.type === 'sale' 
            ? 'Compromis de Vente (Standard)' 
            : 'Bail Habitation (Loi 2017-12)';
        setFormData(prev => ({ ...prev, contractName: defaultTemplate }));
    }
  }, [formData.type, formData.contractMode]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propsRes, opsRes, clientsRes] = await Promise.all([
        api.get('/agent/properties'),
        api.get('/operations'),
        api.get('/clients')
      ]);
      setProperties(Array.isArray(propsRes.data) ? propsRes.data : []);
      setOperations(Array.isArray(opsRes.data) ? opsRes.data : []);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
    } catch (err) {
      console.warn("Utilisation des données simulées.");
      setOperations([
        { id: 'op1', transactionType: 'rent', amount: 450000, property: { title: 'Appartement Haie Vive' }, date: '2024-04-01' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeTransaction = async (property: Property) => {
    const amount = prompt(`Confirmer le montant final pour ${property.title} :`, property.price.toString());
    if (!amount) return;

    try {
      setIsLoading(true);
      await api.post('/operations', {
        propertyId: property.id,
        clientId: '1',
        amount: parseFloat(amount),
        type: property.type
      });
      alert(`Félicitations ! La ${property.type === 'sale' ? 'vente' : 'location'} est enregistrée.`);
      fetchData();
    } catch (err) {
      alert("Erreur lors de la clôture de la transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoostProperty = async (property: Property) => {
    if (credits < BOOST_COST) {
        alert(`Solde insuffisant ! Il vous faut ${BOOST_COST} crédits pour sponsoriser une annonce.`);
        return;
    }

    const confirm = window.confirm(`Booster "${property.title}" pour ${BOOST_COST} crédits ? Cela la placera en tête de liste avec un badge "Sponsorisé".`);
    
    if (confirm) {
        setCredits(prev => prev - BOOST_COST);
        // Simulation d'appel API pour update la propriété
        // await api.put(`/properties/${property.id}`, { isPromoted: true });
        
        // Mise à jour locale pour l'UI
        setProperties(prev => prev.map(p => p.id === property.id ? { ...p, isPromoted: true } : p));
        alert("Annonce boostée avec succès !");
    }
  };

  const handleBuyCredits = () => {
      const amount = prompt("Combien de crédits voulez-vous acheter ? (Simulation)\nPack Découverte: 5000\nPack Pro: 20000");
      if(amount) {
          setCredits(prev => prev + parseInt(amount));
          alert("Paiement simulé accepté. Crédits ajoutés !");
      }
  };

  const handleGenerateDescription = async () => {
    if (!formData.location || !formData.title) return;
    setIsGenerating(true);
    const desc = await generatePropertyDescription({
      type: formData.type === 'sale' ? 'Vente' : 'Location',
      location: formData.location,
      bedrooms: formData.bedrooms || 'Non spécifié',
      highlights: formData.features || formData.title
    });
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.price) {
        alert("Le titre et le prix sont obligatoires.");
        return;
    }

    try {
      setIsPublishing(true);
      
      const contractData = {
        type: formData.contractMode,
        name: formData.contractMode === 'upload' 
            ? (formData.contractName || 'Document importé') 
            : formData.contractName,
        description: formData.contractMode === 'template' 
            ? 'Modèle certifié par la plateforme Lumina.' 
            : (formData.contractDescription || 'Document juridique importé par l\'agent.'),
        contentPreview: formData.contractMode === 'template' 
            ? 'ARTICLE 1 : DÉSIGNATION DES PARTIES...' 
            : undefined
      };

      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');

      const payload = { 
        ...formData, 
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        sqft: Number(formData.sqft) || 0,
        features: featuresArray,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        contract: contractData 
      };
      
      await api.post('/properties', payload);
      alert("Annonce publiée avec succès !");
      setFormData({
        title: '', location: '', price: '', bedrooms: '', bathrooms: '', sqft: '', features: '',
        type: 'sale', description: '', country: 'BJ', imageUrl: '',
        contractMode: 'template', contractName: '', contractDescription: ''
      });
      setActiveTab('listings');
      fetchData();
    } catch (err) {
      alert("Erreur de publication.");
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
        (client.name || '').toLowerCase().includes(clientSearch.toLowerCase()) || 
        (client.email || '').toLowerCase().includes(clientSearch.toLowerCase());
    
    const matchesRole = clientFilter === 'all' || client.role === clientFilter;
    
    return matchesSearch && matchesRole;
  });

  const safeOperations = Array.isArray(operations) ? operations : [];
  const safeProperties = Array.isArray(properties) ? properties : [];
  const totalRevenue = safeOperations.reduce((acc, op) => acc + (parseFloat(op.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Espace Pro</h1>
            <p className="text-slate-500 font-medium text-lg italic">Bonjour, {agentName}</p>
          </div>
          
          <div className="flex items-center gap-4">
              {/* Wallet Widget */}
              <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Solde Crédits</span>
                      <span className="font-extrabold text-indigo-600">{credits.toLocaleString()} pts</span>
                  </div>
                  <button 
                    onClick={handleBuyCredits}
                    className="bg-slate-900 text-white p-2 rounded-xl hover:bg-indigo-600 transition-colors" title="Recharger"
                  >
                      <Plus className="w-4 h-4" />
                  </button>
              </div>

              <button onClick={onLogout} className="flex items-center text-slate-400 hover:text-red-500 font-bold transition-colors">
                <LogOut className="w-5 h-5 mr-2" />
                Déconnexion
              </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8 no-scrollbar overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'listings', label: 'Annonces', icon: Building2 },
            { id: 'clients', label: 'Portefeuille Clients', icon: Users },
            { id: 'contracts', label: 'Documents', icon: FileText },
            { id: 'ops', label: 'Ventes & Locations', icon: Activity },
            { id: 'create', label: 'Publier', icon: Plus },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center px-5 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[500px] animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-2">Actifs</p>
                  <h3 className="text-3xl font-extrabold">{safeProperties.filter(p => p && p.status === 'available').length}</h3>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-2">Clôturés</p>
                  <h3 className="text-3xl font-extrabold text-emerald-600">{safeOperations.length}</h3>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-2">Chiffre d'affaires</p>
                  <h3 className="text-3xl font-extrabold text-indigo-600">{totalRevenue.toLocaleString()} FCFA</h3>
               </div>
               <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden group cursor-pointer" onClick={handleBuyCredits}>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <p className="text-indigo-100 font-bold text-xs uppercase mb-2 flex items-center"><CreditCard className="w-3 h-3 mr-1"/> Monétisation</p>
                  <h3 className="text-3xl font-extrabold mb-1">{credits} <span className="text-lg opacity-70">Crédits</span></h3>
                  <p className="text-xs text-indigo-100 mt-2 underline opacity-0 group-hover:opacity-100 transition-opacity">Recharger maintenant</p>
               </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Propriété</th>
                      <th className="px-6 py-4">Prix</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeProperties.map(p => (
                      <tr key={p.id} className={`transition-colors ${p.isPromoted ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50/50'}`}>
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{p.title}</div>
                            {p.isPromoted && <span className="text-[10px] font-bold uppercase text-amber-500 flex items-center"><Zap className="w-3 h-3 mr-1"/> Sponsorisé</span>}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{(p.price || 0).toLocaleString()} {p.country === 'BJ' ? 'FCFA' : '€'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${p.status === 'available' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {p.status === 'available' ? 'En ligne' : 'Vendu / Loué'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                              {p.status === 'available' && !p.isPromoted && (
                                <button 
                                    onClick={() => handleBoostProperty(p)}
                                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center"
                                    title={`Booster pour ${BOOST_COST} crédits`}
                                >
                                    <Sparkles className="w-3 h-3 mr-1.5" />
                                    Booster
                                </button>
                              )}
                              
                              {p.status === 'available' && (
                                <button 
                                  onClick={() => handleFinalizeTransaction(p)}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1.5" />
                                  Clôturer
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {/* ... (Le reste des onglets Clients, Ops, Create reste identique) ... */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Users className="mr-3 text-indigo-600" />
                        Contacts
                    </h2>
                    
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Rechercher (Nom, Email)..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative w-full md:w-48">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter className="w-4 h-4 text-slate-400" />
                            </div>
                            <select 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium appearance-none cursor-pointer transition-all hover:bg-slate-100"
                                value={clientFilter}
                                onChange={(e) => setClientFilter(e.target.value as any)}
                            >
                                <option value="all">Tous les rôles</option>
                                <option value="Acheteur">Acheteur</option>
                                <option value="Locataire">Locataire</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Recherche / Intérêt</th>
                                <th className="px-6 py-4 text-right">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredClients.length > 0 ? filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold mr-3 shadow-md">
                                                {(client.name || 'A').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{client.name || 'Client Inconnu'}</div>
                                                <div className="text-xs text-slate-500">{client.email || 'Pas d\'email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${client.role === 'Acheteur' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {client.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{client.interest}</div>
                                        <div className="text-xs text-slate-400">{client.budget ? `Budget: ${client.budget}` : 'Budget non spécifié'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors" title="Envoyer un email">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors" 
                                                title={`Appeler ${client.phone}`}
                                                onClick={() => client.phone && window.open(`tel:${client.phone}`)}
                                            >
                                                <Phone className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-slate-400 flex flex-col items-center">
                                        <Search className="w-10 h-10 mb-2 opacity-20" />
                                        <span className="font-medium">Aucun client trouvé pour cette recherche.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {activeTab === 'ops' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Transaction</th>
                      <th className="px-6 py-4">Montant Final</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeOperations.length > 0 ? safeOperations.map((o, idx) => (
                      <tr key={o.id || idx}>
                        <td className="px-6 py-4 font-bold text-slate-900">{o.property?.title || 'Bien non spécifié'}</td>
                        <td className="px-6 py-4 text-emerald-600 font-extrabold">{(parseFloat(o.amount) || 0).toLocaleString()} FCFA</td>
                        <td className="px-6 py-4 text-xs font-bold uppercase text-slate-400">{o.transactionType === 'sale' ? 'Vente Définitive' : 'Contrat de Bail'}</td>
                        <td className="px-6 py-4 text-right text-slate-400 text-sm">{o.date ? new Date(o.date).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">Aucune opération enregistrée.</td></tr>
                    )}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'contracts' && (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Gestion des documents</h3>
                <p>Retrouvez ici l'historique de tous les contrats générés et signés.</p>
                <div className="mt-6 flex justify-center">
                   <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600 transition-colors">Bientôt disponible</button>
                </div>
             </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center"><Building2 className="mr-3 text-indigo-600" />Nouvelle Annonce</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Titre</label>
                   <input className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: Appartement Haie Vive" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Prix</label>
                   <input type="number" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: 500000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Localisation</label>
                   <input className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: Cotonou, Haie Vive" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Type de Transaction</label>
                   <select className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                     <option value="sale">Vente</option>
                     <option value="rent">Location</option>
                   </select>
                 </div>
              </div>

              {/* DETAILS DU BIEN */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Nb. Pièces / Chambres</label>
                   <input type="number" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: 3" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Nb. Salles de bain</label>
                   <input type="number" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: 2" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-400">Superficie (m²)</label>
                   <input type="number" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: 150" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} />
                 </div>
              </div>

              {/* EQUIPEMENTS */}
              <div className="space-y-1 mb-6">
                <label className="text-[10px] font-bold uppercase text-slate-400">Équipements & Atouts (séparés par des virgules)</label>
                <div className="relative">
                    <ListPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="Ex: Piscine, Garage, Groupe Électrogène, Vue Mer..." 
                        value={formData.features} 
                        onChange={e => setFormData({...formData, features: e.target.value})} 
                    />
                </div>
              </div>

              {/* SECTION IMAGE UPLOAD */}
              <div className="mb-8">
                 <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Photo Principale</label>
                 <div className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${formData.imageUrl ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                    
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    
                    {formData.imageUrl ? (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group">
                            <img src={formData.imageUrl} alt="Prévisualisation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white font-bold flex items-center">
                                    <ImageIcon className="w-5 h-5 mr-2" />
                                    Changer l'image
                                </p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFormData({...formData, imageUrl: ''}); }}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 z-30 hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-slate-700 text-sm">Cliquez ou déposez une image ici</p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                        </div>
                    )}
                 </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Description marketing</label>
                  <button onClick={handleGenerateDescription} disabled={isGenerating} className="text-[10px] font-bold text-indigo-600 flex items-center bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100">
                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : <Sparkles className="h-3 w-3 mr-1"/>}
                    IA Gemini
                  </button>
                </div>
                <textarea rows={4} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              {/* SECTION CONTRATS & DOCUMENTS */}
              <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <div className="flex items-center mb-4">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="font-bold text-slate-800">Documents Juridiques</h3>
                 </div>
                 
                 <div className="flex gap-4 mb-4">
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, contractMode: 'template'})}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.contractMode === 'template' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}`}
                    >
                        <FileCheck className="w-6 h-6" />
                        <span className="font-bold text-sm">Utiliser un modèle Lumina</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, contractMode: 'upload'})}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.contractMode === 'upload' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}`}
                    >
                        <Upload className="w-6 h-6" />
                        <span className="font-bold text-sm">Importer un document (PDF)</span>
                    </button>
                 </div>

                 {formData.contractMode === 'template' ? (
                     <div className="space-y-2 animate-fade-in">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Modèle certifié</label>
                        <select 
                            className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            value={formData.contractName}
                            onChange={(e) => setFormData({...formData, contractName: e.target.value})}
                        >
                            {formData.type === 'sale' ? (
                                <>
                                    <option>Compromis de Vente (Standard)</option>
                                    <option>Promesse Unilatérale de Vente</option>
                                    <option>Offre d'Achat Formelle</option>
                                </>
                            ) : (
                                <>
                                    <option>Bail Habitation (Loi 2017-12)</option>
                                    <option>Bail Commercial</option>
                                    <option>Bail Meublé (Courte Durée)</option>
                                </>
                            )}
                        </select>
                        <p className="text-xs text-slate-500 mt-2 flex items-center">
                            <CheckCircle className="w-3 h-3 text-emerald-500 mr-1" />
                            Ce modèle inclut les clauses légales obligatoires pour le Bénin et la France.
                        </p>
                     </div>
                 ) : (
                    <div className="animate-fade-in">
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-white hover:bg-slate-50/50 transition-colors cursor-pointer relative mb-4">
                        <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFormData({
                                        ...formData, 
                                        contractName: e.target.files[0].name,
                                        contractDescription: 'Document importé le ' + new Date().toLocaleDateString()
                                    })
                                }
                            }}
                        />
                        <Upload className="w-8 h-8 mb-2 text-slate-400" />
                        <span className="font-medium text-sm">
                            {formData.contractName ? 'Remplacer le fichier' : 'Cliquez pour importer votre contrat (PDF)'}
                        </span>
                     </div>
                     
                     {formData.contractName && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg text-sm font-bold">
                                <FileText className="w-4 h-4 mr-2" />
                                {formData.contractName}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Description du document</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.contractDescription}
                                    onChange={(e) => setFormData({...formData, contractDescription: e.target.value})}
                                    placeholder="Ex: Bail signé le..."
                                />
                            </div>
                        </div>
                     )}
                    </div>
                 )}
              </div>

              <button 
                onClick={handlePublish} 
                disabled={isPublishing} 
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center"
              >
                {isPublishing ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : <Building2 className="h-5 w-5 mr-2"/>}
                Publier l'annonce
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
