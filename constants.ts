
import { Property, CountryConfig, CountryCode } from './types';

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  BJ: {
    code: 'BJ',
    name: 'Bénin',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    locale: 'fr-BJ',
    flag: '🇧🇯',
    legalMention: 'Loi 2017-12 (Bail Habitation)'
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'fr-FR',
    flag: '🇫🇷',
    legalMention: 'DPE & Loi Alur'
  }
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Villa Moderne Fidjrossè',
    price: 150000000,
    location: 'Cotonou, Fidjrossè Plage',
    country: 'BJ',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 250,
    type: 'sale',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    description: 'Somptueuse villa neuve située à quelques mètres de la route des pêches. Finitions haut de gamme et sécurité renforcée.',
    features: ['Piscine', 'Guérite', 'Climatisation Centrale', 'Groupe Électrogène'],
    contract: {
      type: 'template',
      name: 'Compromis de vente (Normes Bénin)',
      description: 'Document sécurisant la transaction selon le code foncier béninois.',
      contentPreview: 'CONTRAT DE VENTE IMMOBILIÈRE\n\nEntre les soussignés...\nArticle 1 : Objet de la vente...'
    }
  },
  {
    id: '2',
    title: 'Appartement Haie Vive',
    price: 450000,
    location: 'Cotonou, Haie Vive',
    country: 'BJ',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 110,
    type: 'rent',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    description: 'Appartement meublé de standing au cœur du quartier résidentiel. Idéal pour séjours professionnels.',
    features: ['Meublé', 'Ascenseur', 'Wifi Haut Débit', 'Sécurité 24/7'],
    contract: {
      type: 'template',
      name: 'Bail Habitation Loi 2017-12',
      description: 'Bail conforme limitant la caution à 3 mois au Bénin.',
      contentPreview: 'CONTRAT DE BAIL À USAGE D\'HABITATION\n\nConformément à la loi n° 2017-12 du 15 février 2017...'
    }
  },
  {
    id: '3',
    title: 'Loft Parisien Lumineux',
    price: 2400,
    location: 'Paris 4ème, Le Marais',
    country: 'FR',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 65,
    type: 'rent',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'Superbe loft rénové avec goût sous les toits de Paris. Charme de l\'ancien et confort moderne.',
    features: ['Poutres apparentes', 'Cuisine Équipée', 'Dressing', 'Vue Tour Eiffel'],
    contract: {
      type: 'template',
      name: 'Bail Loi Alur (France)',
      description: 'Contrat de location standardisé aux normes françaises.',
      contentPreview: 'CONTRAT DE LOCATION (LOI ALUR)\n\nArticle 1 : Désignation des parties...'
    }
  }
];
