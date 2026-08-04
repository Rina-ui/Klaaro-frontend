import type {CreateRapportPayload, RapportEntity} from "../../entities/Report.ts";
import {API_BASE_URL} from "../../config/api.ts";

export class HttpRapportRepository {
    private baseUrl = `${API_BASE_URL}`;

    async createRapport(payload: CreateRapportPayload, token: string): Promise<RapportEntity> {
        const response = await fetch(`${this.baseUrl}/rapports/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Échec de la sauvegarde du rapport.");
        }

        return response.json();
    }

    // Modification ici : On interroge la route `/me` du backend
    async getRapportsByUser(token: string): Promise<RapportEntity[]> {
        const response = await fetch(`${this.baseUrl}/rapports/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de charger les rapports.");
        }

        return response.json();
    }

    // Modification ici : Plus besoin de userId, on utilise uniquement le token
    async getLatestRapportByType(token: string, type: RapportEntity['type']): Promise<RapportEntity | null> {
        const rapports = await this.getRapportsByUser(token);
        const filtered = rapports
            .filter(r => r.type === type)
            // Assure-toi que le champ correspond bien à ce que renvoie ton RapportResponse (ex: date_generation ou date_creation)
            .sort((a, b) => new Date(b.date_generation).getTime() - new Date(a.date_generation).getTime());
        return filtered[0] ?? null;
    }
}