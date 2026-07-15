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

    // Suggestions de questions rapides et légères
    const quickPrompts = [
        { label: "📈 Explique-moi cette prédiction", text: "Que veut dire cette prediction ?" },
        { label: "🔍 Pourquoi cette hausse ?", text: "Comment s'explique cette hausse sur le graphique ?" },
        { label: "💡 Des actions recommandées ?", text: "Quelles sont les actions recommandées pour la suite ?" }
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
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-[#1e5138] hover:bg-[#153a28] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2 font-semibold text-xs border-none"
            >
                <MessageSquare size={18} />
                <span>Discuter avec Klaaro</span>
            </button>

            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-100 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#1e5138] text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-emerald-300 animate-pulse" />
                        <div>
                            <h3 className="text-xs font-bold tracking-wide">Klaaro Assistant</h3>
                            <span className="text-[9px] text-emerald-200/80">Analyse de Rapport & Graphique</span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col justify-center p-2 text-gray-400">
                            <div className="text-center mb-6">
                                <Sparkles size={24} className="text-[#1e5138] mx-auto mb-2 opacity-60" />
                                <p className="text-xs font-bold text-gray-700">Comment puis-je vous aider aujourd'hui ?</p>
                            </div>

                            {/* Boutons d'actions rapides transparents et légers */}
                            <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
                                {quickPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickPromptClick(prompt.text)}
                                        className="w-full text-left bg-white border border-gray-200 hover:border-[#1e5138] hover:bg-emerald-50/30 text-gray-700 text-xs px-4 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer font-medium"
                                    >
                                        {prompt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-[#1e5138] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none'}`}>
                                <p>{msg.text}</p>
                            </div>

                            {msg.decisions && msg.decisions.length > 0 && (
                                <div className="mt-3 w-full max-w-[85%] space-y-2.5">
                                    <span className="text-[9px] font-bold text-[#1e5138] uppercase tracking-wider block">Fiches d'actions recommandées :</span>
                                    {msg.decisions.map((dec) => (
                                        <div key={dec.id} className="bg-white border-l-4 border-emerald-600 rounded-r-xl p-3 shadow-sm flex flex-col justify-between gap-3 border-y border-r border-gray-200/60">
                                            <div>
                                                <h4 className="text-[11px] font-extrabold text-gray-900">{dec.title}</h4>
                                                <p className="text-[10px] text-gray-500 mt-1 leading-normal">{dec.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAcceptDecision(dec.id)}
                                                className="self-end bg-emerald-50 hover:bg-emerald-100 text-[#1e5138] text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer border-none"
                                            >
                                                <Check size={11} />
                                                <span>Accepter l'action</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-medium pl-1">
                            <Loader2 size={12} className="animate-spin text-[#1e5138]" />
                            <span>Klaaro analyse vos courbes et données...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-[10px] font-medium text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ex: Explique-moi ce pic de prévision..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:border-[#1e5138] text-gray-800 h-10"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-[#1e5138] hover:bg-[#153a28] disabled:bg-gray-200 disabled:text-gray-400 text-white p-2.5 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center"
                    >
                        <Send size={14} />
                    </button>
                </form>
            </div>
        </>
    );
}