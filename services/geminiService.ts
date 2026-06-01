
import { GoogleGenAI } from "@google/genai";

// Fix: Always use named parameter for apiKey and obtain it directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to check if API key exists
export const isApiKeySet = (): boolean => !!process.env.API_KEY;

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
  // Fix: Direct check on process.env.API_KEY
  if (!process.env.API_KEY) return "Veuillez configurer votre clé API pour utiliser l'IA.";

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

    // Fix: Use ai.models.generateContent to query GenAI
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Access .text property directly (not a method)
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
  // Fix: Direct check on process.env.API_KEY
  if (!process.env.API_KEY) return "Configuration API manquante.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Tu es un assistant immobilier virtuel pour 'Lumina Immo'. Tu es poli, professionnel et expert en immobilier. Tu aides les utilisateurs à trouver des conseils sur l'achat, la location, les prêts immobiliers et la décoration. Réponds toujours en français de manière concise.",
      },
    });

    // Fix: Use sendMessage with named parameters
    const result = await chat.sendMessage({ message: newMessage });
    // Fix: Access .text property directly
    return result.text || "Je n'ai pas compris, pouvez-vous reformuler ?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Désolé, je rencontre des difficultés techniques pour le moment.";
  }
};
