import type {DocumentRepository} from "../domain/repositories/DocumentRepository.ts";

export class HttpDocumentRepository implements DocumentRepository {
    private baseUrl = "http://127.0.0.1:8000";

    async getDocumentsByUserId(userId: string, token: string): Promise<Document[]> {
        const response = await fetch(`${this.baseUrl}/documents/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de récupérer les documents depuis le serveur.");
        }

        const data = await response.json();

        // Mapping de la réponse API brute vers notre entité Domaine
        return Array.isArray(data) ? data.map((doc: any) => ({
            id: doc.id || doc._id,
            name: doc.name,
            size: doc.size || "Taille inconnue",
            createdAt: doc.created_at
        })) : [];
    }
}