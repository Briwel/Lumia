
export type CountryCode = 'BJ' | 'FR';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  flag: string;
  legalMention: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  country: CountryCode;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'sale' | 'rent';
  status: 'available' | 'offer' | 'sold';
  imageUrl: string;
  description: string;
  features: string[];
  isPromoted?: boolean; // Nouveau champ pour la monétisation
  agentName?: string;   // Propriété sécurisée du créateur
  agencyName?: string;  // Agence du créateur
  contract?: {
    type: 'upload' | 'template';
    name: string;
    description?: string;
    contentPreview?: string;
  };
}

export interface SearchFilters {
  query: string;
  type: 'all' | 'sale' | 'rent';
  minPrice: number;
  maxPrice: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
