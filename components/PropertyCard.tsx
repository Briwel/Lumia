
import React from 'react';
import { Property } from '../types';
import { Bed, Bath, Maximize, MapPin, Heart, ArrowUpRight, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { COUNTRIES } from '../constants';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const countryConfig = COUNTRIES[property.country];
  const isPromoted = property.isPromoted;
  
  const formattedPrice = new Intl.NumberFormat(countryConfig.locale, {
    style: 'currency',
    currency: countryConfig.currency,
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div 
      className={`group bg-white rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-2 border relative ${
        isPromoted 
          ? 'border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-100' 
          : 'border-slate-100 hover:shadow-2xl hover:shadow-indigo-900/10'
      }`}
      onClick={onClick}
    >
      {/* Badge Sponsorisé */}
      {isPromoted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30 bg-amber-400 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-b-lg shadow-sm flex items-center">
            <Sparkles className="w-3 h-3 mr-1 fill-white" />
            Sponsorisé
        </div>
      )}

      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors z-10"></div>
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur-md ${
            property.type === 'sale' ? 'bg-indigo-600/90' : 'bg-emerald-500/90'
          }`}>
            {property.type === 'sale' ? 'Vente' : 'Location'}
          </span>
        </div>

        <button className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-lg hover:scale-110">
          <Heart className="h-5 w-5 fill-current opacity-50 hover:opacity-100 transition-opacity" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent z-20">
          <p className="text-2xl font-extrabold text-white tracking-tight">
            {formattedPrice}
            {property.type === 'rent' && <span className="text-sm font-medium ml-1 text-slate-200">/mois</span>}
          </p>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{property.title}</h3>
          <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100" />
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
          <span className="truncate font-medium">{property.location}</span>
        </div>

        {/* Indicateur de Contrat */}
        {property.contract && (
            <div className="mb-4 flex items-center bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0" />
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-emerald-600/70 leading-none mb-0.5">Document Inclus</span>
                    <span className="text-xs font-semibold text-emerald-800 line-clamp-1" title={property.contract.name}>{property.contract.name}</span>
                </div>
            </div>
        )}
        
        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
            <Bed className="h-5 w-5 mb-1 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-700">{property.bedrooms} <span className="text-slate-400 font-normal">Ch.</span></span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
            <Bath className="h-5 w-5 mb-1 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-700">{property.bathrooms} <span className="text-slate-400 font-normal">Sdb.</span></span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
            <Maximize className="h-5 w-5 mb-1 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-700">{property.sqft} <span className="text-slate-400 font-normal">m²</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
