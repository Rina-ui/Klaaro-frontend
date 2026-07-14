import type { RapportEntity, CreateRapportPayload } from "../../entities/Report.ts";

export class HttpRapportRepository {
    private baseUrl = "http://127.0.0.1:8000";

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

    async getRapportsByUser(token: string, userId: string): Promise<RapportEntity[]> {
        const response = await fetch(`${this.baseUrl}/rapports/user/${userId}`, {
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

    // Renvoie le rapport le plus récent d'un type donné (ex: dernière analyse, dernière prédiction)
    async getLatestRapportByType(token: string, userId: string, type: RapportEntity['type']): Promise<RapportEntity | null> {
        const rapports = await this.getRapportsByUser(token, userId);
        const filtered = rapports
            .filter(r => r.type === type)
            .sort((a, b) => new Date(b.date_generation).getTime() - new Date(a.date_generation).getTime());
        return filtered[0] ?? null;
    }
}
