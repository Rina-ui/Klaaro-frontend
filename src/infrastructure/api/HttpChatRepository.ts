import {API_BASE_URL} from "../../config/api.ts";

export interface ChartDataPoint {
    date: string;
    Historique: number | null;
    Prevision: number | null;
}

export interface DecisionEmbedded {
    id: string;
    content: string;
    description: string;
    status: string;
    date: string;
}

export interface ReponseAI {
    id: string;
    type: string;
    content: string;
    received_at: string;
    decisions: DecisionEmbedded[];
}

export interface RequeteResponse {
    id: string;
    type: string;
    content: string;
    send_date: string;
    rapport_id: string | null;
    reponse: ReponseAI | null;
}

export class HttpChatRepository {
    private baseUrl = `${API_BASE_URL}`;

    async askAssistant(
        payload: {
            type: string;
            content: string;
            rapport_id?: string | null;
            chart_data?: ChartDataPoint[] | null;
        },
        token: string
    ): Promise<RequeteResponse> {
        const response = await fetch(`${this.baseUrl}/decision/demander`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || "Erreur lors de la communication avec Klaaro.");
        }

        return response.json();
    }
}