import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Property } from '../types';

/**
 * INSTRUCTIONS POUR L'UTILISATEUR (SQL SUPABASE)
 * --------------------------------------------------
 * Copiez-collez ce script SQL dans l'onglet "SQL Editor" de votre tableau de bord Supabase :
 * 
 * -- Table des propriétés (properties)
 * CREATE TABLE public.properties (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     title TEXT NOT NULL,
 *     price NUMERIC NOT NULL,
 *     location TEXT NOT NULL,
 *     country VARCHAR(10) NOT NULL,
 *     bedrooms INTEGER DEFAULT 0,
 *     bathrooms INTEGER DEFAULT 0,
 *     sqft INTEGER DEFAULT 0,
 *     type VARCHAR(20) NOT NULL, -- 'sale' | 'rent'
 *     status VARCHAR(20) DEFAULT 'available', -- 'available' | 'offer' | 'sold'
 *     "imageUrl" TEXT,
 *     description TEXT,
 *     features JSONB DEFAULT '[]'::jsonb,
 *     contract JSONB DEFAULT '{}'::jsonb,
 *     "isPromoted" BOOLEAN DEFAULT false,
 *     "createdAt" TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Table des clients (clients)
 * CREATE TABLE public.clients (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     name TEXT NOT NULL,
 *     email TEXT,
 *     phone TEXT,
 *     role VARCHAR(50),
 *     interest TEXT,
 *     budget TEXT,
 *     "createdAt" TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Table des transactions / opérations (operations)
 * CREATE TABLE public.operations (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     "transactionType" VARCHAR(20) NOT NULL, -- 'sale' | 'rent'
 *     amount NUMERIC NOT NULL,
 *     "propertyId" UUID,
 *     "clientId" UUID,
 *     "propertyName" TEXT,
 *     date TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Activer l'accès public pour le développement (ou configurer des politiques RLS appropriées)
 * ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Permettre la lecture publique des propriétés" ON public.properties FOR SELECT USING (true);
 * CREATE POLICY "Permettre l'écriture publique des propriétés" ON public.properties FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Permettre la modification publique des propriétés" ON public.properties FOR UPDATE USING (true);
 * 
 * CREATE POLICY "Permettre l'accès universel aux clients" ON public.clients FOR ALL USING (true);
 * CREATE POLICY "Permettre l'accès universel aux operations" ON public.operations FOR ALL USING (true);
 */

export const supabaseService = {
  // --- Propriétés ---
  getProperties: async (): Promise<Property[]> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('isPromoted', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des propriétés Supabase :", error);
      throw error;
    }

    // Assure la compatibilité des types (JSONB vers Array)
    return (data || []).map((item: any) => ({
      ...item,
      features: typeof item.features === 'string' ? JSON.parse(item.features) : (item.features || []),
      contract: typeof item.contract === 'string' ? JSON.parse(item.contract) : (item.contract || {}),
    })) as Property[];
  },

  createProperty: async (payload: any): Promise<Property> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          title: payload.title,
          price: payload.price,
          location: payload.location,
          country: payload.country,
          bedrooms: payload.bedrooms,
          bathrooms: payload.bathrooms,
          sqft: payload.sqft,
          type: payload.type,
          status: payload.status || 'available',
          imageUrl: payload.imageUrl,
          description: payload.description,
          features: payload.features,
          contract: payload.contract,
          isPromoted: payload.isPromoted || false,
          agentName: payload.agentName,
          agencyName: payload.agencyName,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la propriété Supabase :", error);
      throw error;
    }

    return {
      ...data,
      features: typeof data.features === 'string' ? JSON.parse(data.features) : (data.features || []),
      contract: typeof data.contract === 'string' ? JSON.parse(data.contract) : (data.contract || {}),
    } as Property;
  },

  updatePropertyStatus: async (id: string, status: 'available' | 'offer' | 'sold'): Promise<any> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'update de propriété Supabase :", error);
      throw error;
    }

    return data;
  },

  // --- Clients ---
  getClients: async (): Promise<any[]> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des clients Supabase :", error);
      throw error;
    }

    return data || [];
  },

  createClient: async (payload: any): Promise<any> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          interest: payload.interest,
          budget: payload.budget,
          agentName: payload.agentName,
          agencyName: payload.agencyName,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'enregistrement client Supabase :", error);
      throw error;
    }

    return data;
  },

  // --- Opérations / Transactions ---
  getOperations: async (): Promise<any[]> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des opérations Supabase :", error);
      throw error;
    }

    // Transforme l'opération pour correspondre au format d'affichage
    return (data || []).map((op: any) => ({
      id: op.id,
      transactionType: op.transactionType,
      amount: op.amount,
      date: op.date,
      agentName: op.agentName,
      agencyName: op.agencyName,
      property: { title: op.propertyName || "Bien immobilier" }
    }));
  },

  createOperation: async (payload: any): Promise<any> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    // Récupère d'abord le titre de la propriété si possible
    let propertyName = "Bien immobilier";
    try {
      const { data: propData } = await supabase
        .from('properties')
        .select('title')
        .eq('id', payload.propertyId)
        .single();
      if (propData) {
        propertyName = propData.title;
      }
    } catch (e) {
      console.warn("Impossible de récupérer le nom de la propriété :", e);
    }

    const { data, error } = await supabase
      .from('operations')
      .insert([
        {
          transactionType: payload.type || 'sale',
          amount: payload.amount,
          propertyId: payload.propertyId,
          clientId: payload.clientId,
          propertyName: propertyName,
          agentName: payload.agentName,
          agencyName: payload.agencyName,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création d'opération Supabase :", error);
      throw error;
    }

    // Met à jour le statut du bien en 'sold' ou 'offer'
    try {
      await supabaseService.updatePropertyStatus(payload.propertyId, payload.type === 'sale' ? 'sold' : 'offer');
    } catch (statusErr) {
      console.warn("Erreur de mise à jour du statut de propriété :", statusErr);
    }

    return data;
  },

  // --- Authentification ---
  login: async (payload: any): Promise<any> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      console.error("Erreur lors de la connexion Supabase Auth :", error);
      throw error;
    }

    return {
      access_token: data.session?.access_token || 'mock_supabase_token',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name || data.user?.email?.split('@')[0] || 'Agent',
        role: data.user?.user_metadata?.role || 'agent',
        agencyName: data.user?.user_metadata?.agencyName || 'Lumina Immo',
      }
    };
  },

  register: async (payload: any): Promise<any> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase n'est pas configuré");
    }

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          agencyName: payload.agencyName,
          role: payload.role || 'agent',
        }
      }
    });

    if (error) {
      console.error("Erreur lors de l'inscription Supabase Auth :", error);
      throw error;
    }

    return {
      access_token: data.session?.access_token || 'mock_supabase_token',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: payload.name,
        role: payload.role || 'agent',
        agencyName: payload.agencyName,
      }
    };
  }
};
