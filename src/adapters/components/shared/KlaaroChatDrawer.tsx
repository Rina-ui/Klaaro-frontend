import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Check, Loader2 } from 'lucide-react';
import { useKlaaroChat } from '../../../use_cases/hooks/useKlaaroChat.ts';
import { useAuth } from '../../../use_cases/hooks/useAuth.ts';
import type {ChartDataPoint} from "../../../infrastructure/api/HttpChatRepository.ts";

interface KlaaroChatDrawerProps {
    activeRapportId?: string | null;
    chartData?: ChartDataPoint[] | null;
}

export default function KlaaroChatDrawer({ activeRapportId, chartData }: KlaaroChatDrawerProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { token } = useAuth();
    const { messages, isLoading, error, sendMessage } = useKlaaroChat(token, activeRapportId, chartData);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickPrompts = [
        { label: " Explique-moi cette prédiction", text: "Que veut dire cette prediction ?" },
        { label: " Pourquoi cette hausse ?", text: "Comment s'explique cette hausse sur le graphique ?" },
        { label: " Des actions recommandées ?", text: "Quelles sont les actions recommandées pour la suite ?" }
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input.trim());
        setInput('');
    };

    const handleQuickPromptClick = (text: string) => {
        if (isLoading) return;
        sendMessage(text);
    };

    const handleAcceptDecision = async (decisionId: string) => {
        if (!token) return;
        try {
            await fetch(`http://127.0.0.1:8000/decision/${decisionId}/accepter`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Action planifiée et acceptée !");
        } catch (err) {
            console.error("Erreur lors de la validation de la décision", err);
        }
    };

    return (
        <>
            {/* Bouton d'ouverture flottant */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 bg-[#1e5138] hover:bg-[#153a28] text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 font-semibold text-xs border-none"
            >
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                    {isOpen ? <X size={18} /> : <MessageSquare size={18} />}
                </div>
                <span>{isOpen ? "Fermer" : "Discuter avec Klaaro"}</span>
            </button>

            {/* Fenêtre de Chat Flottante avec un chouia de transparence (95% opaque + blur) */}
            <div className={`fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-white/95 backdrop-blur-md border border-gray-150/80 shadow-2xl rounded-2xl flex flex-col origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen
                    ? 'scale-100 opacity-100 translate-y-0 visible'
                    : 'scale-75 opacity-0 translate-y-12 pointer-events-none invisible'
            }`}>

                {/* Header opaque de base avec légère transparence */}
                <div className="p-3.5 border-b border-gray-100/30 flex justify-between items-center bg-[#1e5138]/95 text-white backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Sparkles size={15} className="text-emerald-300 animate-pulse" />
                        <div>
                            <h3 className="text-xs font-bold tracking-wide">Klaaro Assistant</h3>
                            <span className="text-[9px] text-emerald-200/80 block">Analyse de Rapport & Graphique</span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                        <X size={16} />
                    </button>
                </div>

                {/* Arrière-plan de base (gray-50) légèrement adouci */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/90 scrollbar-none">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col justify-center text-center p-2">
                            <div className="mb-5 animate-fade-in">
                                <Sparkles size={20} className="text-[#1e5138] mx-auto mb-2 opacity-70 animate-bounce" />
                                <p className="text-xs font-bold text-gray-700">Comment puis-je vous aider aujourd'hui ?</p>
                            </div>

                            {/* Suggestions rapides */}
                            <div className="flex flex-col gap-2 w-full">
                                {quickPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickPromptClick(prompt.text)}
                                        style={{ animationDelay: `${idx * 75}ms` }}
                                        className="w-full text-left bg-white/95 border border-gray-200 hover:border-[#1e5138] hover:bg-emerald-50/30 text-gray-700 text-xs px-4 py-3.5 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer font-medium animate-slide-up"
                                    >
                                        {prompt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                                msg.sender === 'user'
                                    ? 'bg-[#1e5138] text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none'
                            }`}>
                                <p>{msg.text}</p>
                            </div>

                            {msg.decisions && msg.decisions.length > 0 && (
                                <div className="mt-3 w-full max-w-[85%] space-y-2 animate-slide-up">
                                    <span className="text-[9px] font-bold text-[#1e5138] uppercase tracking-wider block">Actions recommandées :</span>
                                    {msg.decisions.map((dec) => (
                                        <div key={dec.id} className="bg-white border-l-4 border-emerald-600 rounded-r-xl p-3 shadow-sm flex flex-col justify-between gap-3 border-y border-r border-gray-200/60 transition-all duration-250 hover:shadow-md">
                                            <div>
                                                <h4 className="text-[10px] font-extrabold text-gray-900">{dec.title}</h4>
                                                <p className="text-[9px] text-gray-500 mt-0.5 leading-normal">{dec.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAcceptDecision(dec.id)}
                                                className="self-end bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-[#1e5138] text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer border-none"
                                            >
                                                <Check size={10} />
                                                <span>Accepter l'action</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-semibold pl-1 animate-pulse">
                            <Loader2 size={12} className="animate-spin text-[#1e5138]" />
                            <span>Klaaro analyse vos courbes...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-[10px] font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie avec un chouia de transparence */}
                <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Poser une question..."
                        className="flex-1 bg-gray-50/80 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:border-[#1e5138] text-gray-800 h-9 transition-colors duration-200"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-[#1e5138] hover:bg-[#153a28] active:scale-95 disabled:scale-100 disabled:bg-gray-250 disabled:text-gray-400 text-white p-2 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center w-9 h-9"
                    >
                        <Send size={13} />
                    </button>
                </form>
            </div>

            {/* Styles d'animation personnalisés */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}