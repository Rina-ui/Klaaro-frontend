import { useState, useCallback } from "react";
import {
    type ChartDataPoint,
    HttpChatRepository,
    type RequeteResponse
} from "../../infrastructure/api/HttpChatRepository.ts";

const chatRepo = new HttpChatRepository();

export interface ChatMessage {
    id: string;
    sender: "user" | "klaaro";
    text: string;
    timestamp: Date;
    decisions?: Array<{
        id: string;
        title: string;
        description: string;
    }>;
}

export const useKlaaroChat = (
    token: string | null,
    activeRapportId?: string | null,
    chartData?: ChartDataPoint[] | null
) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!token) {
            setError("Vous devez être connecté pour interagir avec Klaaro.");
            return;
        }

        setError(null);
        setIsLoading(true);

        const userMsgId = Math.random().toString();
        const userMessage: ChatMessage = {
            id: userMsgId,
            sender: "user",
            text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const result: RequeteResponse = await chatRepo.askAssistant({
                type: "CHAT_LIBRE",
                content: text,
                rapport_id: activeRapportId || null,
                chart_data: chartData || null
            }, token);

            if (result.reponse) {
                const klaaroMessage: ChatMessage = {
                    id: result.reponse.id,
                    sender: "klaaro",
                    text: result.reponse.content,
                    timestamp: new Date(result.reponse.received_at),
                    decisions: result.reponse.decisions.map(dec => ({
                        id: dec.id,
                        title: dec.content,
                        description: dec.description
                    }))
                };
                setMessages(prev => [...prev, klaaroMessage]);
            }
        } catch (err: any) {
            setError(err.message || "Impossible de joindre l'IA.");
            setMessages(prev => [...prev, {
                id: Math.random().toString(),
                sender: "klaaro",
                text: "Désolé, je n'ai pas pu analyser ces données graphiques.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [token, activeRapportId, chartData]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearHistory: () => setMessages([])
    };
};