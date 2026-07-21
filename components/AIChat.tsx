import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  Bot, 
  Trash2, 
  HelpCircle, 
  ChevronRight,
  MessageSquare,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  { 
    label: "Trouver une villa à Cotonou 🇧🇯", 
    text: "Je recherche une villa de haut standing à Cotonou avec cour et titre foncier" 
  },
  { 
    label: "Modèles de contrats légaux 📝", 
    text: "Quels sont les modèles de contrats légaux disponibles pour le Bénin et la France ?" 
  },
  { 
    label: "Frais de caution au Bénin 💰", 
    text: "Quels sont les frais d'agence typiques et la réglementation de la caution de location au Bénin ?" 
  },
  { 
    label: "Achat ou location sécurisée 🏠", 
    text: "Quelles sont les étapes pour acheter un bien immobilier en toute sécurité au Bénin ?" 
  }
];

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('lumina_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      { role: 'model', text: "Bonjour ! Je suis l'assistant virtuel Lumina Immo. Je suis spécialisé dans l'immobilier, les questions légales, l'estimation et la conformité au Bénin et en France.\n\nComment puis-je vous accompagner aujourd'hui ?" }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('lumina_chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: queryText };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await chatWithAssistant(history, queryText);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, j'ai rencontré une petite erreur de connexion. Veuillez réessayer dans quelques instants." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Voulez-vous réinitialiser la conversation ?")) {
      const defaultMsg: ChatMessage[] = [
        { role: 'model', text: "Bonjour ! Je suis l'assistant virtuel Lumina Immo. Je suis spécialisé dans l'immobilier, les questions légales, l'estimation et la conformité au Bénin et en France.\n\nComment puis-je vous accompagner aujourd'hui ?" }
      ];
      setMessages(defaultMsg);
      localStorage.removeItem('lumina_chat_history');
    }
  };

  // Advanced formatting to render bold text and lists nicely
  const formatMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let content = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-extrabold text-slate-900 bg-slate-100/60 px-1 rounded">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      if (isBullet) {
        return (
          <div key={i} className="flex items-start ml-2 my-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 mt-2 flex-shrink-0" />
            <div className="flex-grow text-slate-700 leading-relaxed text-sm">
              {parts.length > 0 ? parts : line.replace(/^[-*]\s+/, '')}
            </div>
          </div>
        );
      }

      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-2 last:mb-0 leading-relaxed text-slate-700 text-sm'}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop blurring the app context slightly */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer pointer-events-auto"
            onClick={onClose}
          />

          {/* Sliding Side Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 h-full w-full sm:w-[460px] bg-white shadow-3xl z-50 flex flex-col border-l border-slate-100 overflow-hidden pointer-events-auto"
          >
            {/* Header: Indigo and Deep Slate refined gradient */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-5 flex items-center justify-between text-white shadow-md relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight tracking-tight">Assistant Lumina IA</h3>
                  <div className="flex items-center text-[10px] text-indigo-200 font-semibold mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                    Conseiller Expert Actif
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 relative z-10">
                {messages.length > 1 && (
                  <button 
                    onClick={handleClearHistory} 
                    className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
                    title="Effacer la conversation"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages area */}
            <div className="flex-grow p-5 overflow-y-auto bg-slate-50/50 space-y-5 scroll-smooth flex flex-col">
              
              {/* Introduction Banner inside the message container */}
              <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-violet-50/40 rounded-2xl border border-indigo-100/50 text-slate-600 text-xs leading-relaxed space-y-1">
                <div className="flex items-center text-indigo-800 font-bold gap-1 mb-1">
                  <Sparkle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Comment puis-je vous aider ?</span>
                </div>
                <p>Posez-moi des questions sur les réglementations, baux de location conformes, compromis de vente ou demandez-moi d'analyser des critères pour un bien immobilier.</p>
              </div>

              {/* Chat Bubble List */}
              <div className="space-y-4 flex-grow">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start'}`}>
                    {msg.role === 'model' && (
                      <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2 mt-1 shadow-xs flex-shrink-0">
                        <Bot className="h-4 w-4 text-indigo-600" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[85%] p-4 shadow-xs border transition-all duration-200 ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white border-indigo-700 rounded-2xl rounded-tr-none' 
                          : 'bg-white border-slate-100 text-slate-800 rounded-2xl rounded-tl-none'
                      }`}
                    >
                      {msg.role === 'model' ? formatMessageText(msg.text) : <p className="text-sm leading-relaxed">{msg.text}</p>}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start items-start">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2 mt-1 shadow-xs flex-shrink-0">
                      <Bot className="h-4 w-4 text-indigo-600 animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs flex items-center space-x-2">
                      <span className="flex space-x-1">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Suggestions list & input area */}
            <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
              
              {/* Starters prompt suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div className="mb-4 space-y-1.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Suggestions de démarrage
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {STARTER_PROMPTS.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(prompt.text)}
                        className="text-left w-full p-2.5 bg-slate-50 hover:bg-indigo-50/60 hover:text-indigo-950 border border-slate-100 hover:border-indigo-100 rounded-xl text-xs text-slate-600 font-medium transition-all flex items-center justify-between group"
                      >
                        <span className="truncate">{prompt.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input field */}
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-2 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white focus-within:border-indigo-300 transition-all">
                <input 
                  type="text" 
                  className="flex-grow bg-transparent px-3 py-1.5 focus:outline-none text-sm text-slate-800 placeholder-slate-400"
                  placeholder="Posez votre question à Lumina..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className={`p-2.5 rounded-xl transition-all transform ${
                    input.trim() && !isLoading 
                      ? 'bg-indigo-600 text-white shadow-md hover:scale-[1.03] active:scale-95' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                </button>
              </div>

              {/* Verified PWA note */}
              <div className="text-center mt-3">
                <p className="text-[10px] text-slate-400">L'IA de Lumina analyse les critères conformes pour garantir votre sécurité légale.</p>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};