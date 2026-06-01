import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bonjour ! Je suis l\'assistant Lumina. Comment puis-je vous aider dans votre recherche immobilière aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithAssistant(history, userMessage.text);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:items-end sm:p-6 bg-slate-900/40 backdrop-blur-sm sm:bg-transparent transition-all">
      <div className="bg-white w-full h-full sm:h-[650px] sm:w-[420px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-white/50 ring-1 ring-slate-900/5">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 flex items-center justify-between text-white shadow-lg relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          
          <div className="flex items-center relative z-10">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mr-3 border border-white/30 shadow-inner">
              <Sparkles className="h-5 w-5 text-indigo-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Assistant Lumina</h3>
              <div className="flex items-center text-xs text-indigo-100 opacity-90">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                En ligne • Propulsé par Gemini
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow p-5 overflow-y-auto bg-slate-50 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}>
               {msg.role === 'model' && (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-2 mb-1 shadow-sm flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
               )}
              <div 
                className={`max-w-[80%] p-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end">
               <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-2 mb-1 shadow-sm flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
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

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center bg-slate-100 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all shadow-inner">
            <input 
              type="text" 
              className="flex-grow bg-transparent px-4 focus:outline-none text-sm text-slate-800 placeholder-slate-400"
              placeholder="Posez une question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-full transition-all transform ${
                input.trim() && !isLoading 
                  ? 'bg-indigo-600 text-white shadow-md hover:scale-105 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">L'IA peut faire des erreurs. Vérifiez les informations.</p>
          </div>
        </div>

      </div>
    </div>
  );
};