
import { GoogleGenAI } from "@google/genai";

// Helper to safely retrieve API Key from Vite or Node env
const getApiKey = (): string => {
  let key = '';
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    key = import.meta.env.VITE_GEMINI_API_KEY || 
          import.meta.env.VITE_API_KEY || 
          import.meta.env.GEMINI_API_KEY || 
          import.meta.env.API_KEY || '';
  }
  if (!key && typeof process !== 'undefined' && process.env) {
    key = process.env.GEMINI_API_KEY || 
          process.env.API_KEY || 
          process.env.VITE_GEMINI_API_KEY || '';
  }
  return key || 'AIzaSyANaOyTmKQrQPx5yUbRoKwosqciMMVnQIs';
};

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// Helper to check if API key exists
export const isApiKeySet = (): boolean => !!getApiKey();

/**
 * Generates a professional real estate description based on features.
 */
export const generatePropertyDescription = async (
  features: { 
    type: string; 
    location: string; 
    bedrooms: string; 
    highlights: string 
  }
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Veuillez configurer la clé VITE_GEMINI_API_KEY dans votre fichier .env pour utiliser l'IA.";

  try {
    const prompt = `
      Agis comme un agent immobilier expert et rédige une description de propriété attrayante et professionnelle (en français) pour une annonce immobilière.
      
      Détails du bien :
      - Type : ${features.type}
      - Localisation : ${features.location}
      - Chambres : ${features.bedrooms}
      - Points forts : ${features.highlights}

      La description doit être engageante, mettre en valeur le style de vie, et faire environ 100-150 mots. N'utilise pas de markdown, juste du texte brut avec des sauts de ligne.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Impossible de générer la description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erreur lors de la génération de la description via l'IA.";
  }
};

/**
 * Chat with the AI assistant about real estate.
 */
export const chatWithAssistant = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Clé API manquante. Veuillez renseigner VITE_GEMINI_API_KEY dans votre fichier .env.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Tu es un assistant immobilier virtuel pour 'Lumina Immo'. Tu es poli, professionnel et expert en immobilier. Tu aides les utilisateurs à trouver des conseils sur l'achat, la location, les prêts immobiliers et la décoration. Réponds toujours en français de manière concise.",
      },
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Je n'ai pas compris, pouvez-vous reformuler ?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Désolé, je rencontre des difficultés techniques pour le moment.";
  }
};
