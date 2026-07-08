import type { UploadStats } from "../../entities/UploadStats.ts";
import type { DocumentEntity } from "../../entities/Document.ts";

export interface UploadDocumentPayload {
    name: string;
    type: 'csv' | 'excel' | 'json' | 'pdf' | 'xml' | 'image';
    taille: number;
    content: string;
}

export class HttpDocumentRepository {
    private baseUrl = "http://127.0.0.1:8000";

    // Récupération des documents récents filtrés automatiquement par le Token JWT
    async getRecentDocuments(token: string): Promise<DocumentEntity[]> {
        const response = await fetch(`${this.baseUrl}/documents/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de charger les documents récents.");
        }

        const data = await response.json();
        return data as DocumentEntity[];
    }

    // Aligné sur la méthode clean (sans argument userId inutilisé pour corriger TS6133)
    async getDocumentsByUserId(token: string): Promise<DocumentEntity[]> {
        return this.getRecentDocuments(token);
    }

    // Récupération des statistiques du tableau de bord
    async getStatsByUserId(token: string): Promise<UploadStats> {
        const response = await fetch(`${this.baseUrl}/documents/stats`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de récupérer les statistiques.");
        }

        return await response.json();
    }

    // Envoi d'un nouveau document - Remplacement du type générique par UploadDocumentPayload
    async uploadDocument(payload: UploadDocumentPayload, token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/documents/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Échec du téléversement du document.");
        }
    }
}