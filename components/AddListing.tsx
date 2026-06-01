import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowLeft, Check } from 'lucide-react';
import { generatePropertyDescription } from '../services/geminiService';

interface AddListingProps {
  onBack: () => void;
}

export const AddListing: React.FC<AddListingProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: '',
    type: 'sale',
    highlights: '',
    description: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.type || !formData.location || !formData.bedrooms) {
      alert("Veuillez remplir les champs de base (Type, Localisation, Chambres) pour générer une description.");
      return;
    }

    setIsGenerating(true);
    const desc = await generatePropertyDescription({
      type: formData.type === 'sale' ? 'Vente' : 'Location',
      location: formData.location,
      bedrooms: formData.bedrooms,
      highlights: formData.highlights || 'Non spécifié'
    });
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="group flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium">
          <div className="p-2 bg-white rounded-full shadow-sm mr-3 group-hover:shadow-md transition-all">
             <ArrowLeft className="h-4 w-4" />
          </div>
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Sidebar Visual */}
            <div className="md:col-span-2 bg-indigo-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-400 rounded-full blur-3xl"></div>
               </div>
               
               <div className="relative z-10">
                 <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 shadow-inner border border-white/20">
                    <Sparkles className="h-6 w-6 text-white" />
                 </div>
                 <h2 className="text-3xl font-extrabold mb-4 leading-tight">Vendez intelligemment avec l'IA</h2>
                 <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                   Remplissez les détails de base et laissez notre modèle Gemini générer une description captivante qui attirera plus d'acheteurs.
                 </p>
               </div>

               <div className="relative z-10 mt-12 space-y-4">
                  <div className="flex items-center text-sm text-indigo-100">
                    <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3" />
                    </div>
                    Rédaction optimisée
                  </div>
                  <div className="flex items-center text-sm text-indigo-100">
                     <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3" />
                    </div>
                    Gain de temps
                  </div>
                  <div className="flex items-center text-sm text-indigo-100">
                     <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3" />
                    </div>
                    Meilleure visibilité
                  </div>
               </div>
            </div>

            {/* Form Section */}
            <div className="md:col-span-3 p-8 lg:p-10">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Détails du bien</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type de transaction</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all font-medium text-slate-700 hover:bg-slate-100"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="sale">Vente</option>
                        <option value="rent">Location</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder-slate-400 hover:bg-slate-100"
                      placeholder="ex: Lyon, Confluence"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prix (€)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder-slate-400 hover:bg-slate-100"
                      placeholder="ex: 350000"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chambres</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder-slate-400 hover:bg-slate-100"
                      placeholder="ex: 3"
                      value={formData.bedrooms}
                      onChange={e => setFormData({...formData, bedrooms: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Points forts</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder-slate-400 hover:bg-slate-100"
                    placeholder="ex: Lumineux, rénové, proche métro, vue dégagée, parquet"
                    value={formData.highlights}
                    onChange={e => setFormData({...formData, highlights: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                     <button 
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="text-xs flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                     >
                       {isGenerating ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin"/> : <Sparkles className="h-3 w-3 mr-1.5"/>}
                       Générer avec l'IA
                     </button>
                  </div>
                  <div className="relative">
                     <textarea 
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder-slate-400 resize-none hover:bg-slate-100"
                      placeholder="La description générée apparaîtra ici..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    {isGenerating && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                          <span className="text-sm font-medium text-indigo-600">Rédaction en cours...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                    Publier l'annonce
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};