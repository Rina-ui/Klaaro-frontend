import type { DocumentRepository, DocumentUploadData } from "../../domain/repositories/DocumentRepository.ts";
import type { UploadStats } from "../../entities/UploadStats.ts";
import type {DocumentEntity} from "../../entities/Document.ts";

//reponse envoyee au back
interface DocumentBackendResponse {
    id: string;
    name: string;
    type: 'csv' | 'excel' | 'json' | 'pdf' | 'xml' | 'image';
    taille: number;
    content: string;
    user_id: string;
}

export class HttpDocumentRepository implements DocumentRepository {
    private baseUrl = "http://127.0.0.1:8000";

    async uploadDocument(doc: DocumentUploadData, token: string): Promise<DocumentBackendResponse> {
        const response = await fetch(`${this.baseUrl}/documents/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        });
        if (!response.ok) throw new Error("Échec du téléversement du document.");

        return response.json() as Promise<DocumentBackendResponse>;
    }

    async getDocumentsByUserId(userId: string, token: string): Promise<DocumentEntity[]> {
        const response = await fetch(`${this.baseUrl}/documents/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de récupérer les documents de l'utilisateur.");
        }

        const data = await response.json();
        //  Typage explicite du tableau pour remplacer le "any"
        const rawDocuments = (Array.isArray(data) ? data : [data]) as DocumentBackendResponse[];

        // Plus aucun "any" ici, TypeScript connaît le type de chaque 'doc'
        return rawDocuments.map((doc: DocumentBackendResponse): DocumentEntity => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            taille: doc.taille,
            content: doc.content,
            user_id: doc.user_id
        }));
    }

    async getStatsByUserId(userId: string, token: string): Promise<UploadStats> {
        try {
            const documents = await this.getDocumentsByUserId(userId, token);

            return {
                uploadedFilesCount: documents.filter(d => d.type !== 'image').length,
                uploadedFilesTrend: documents.length,
                databaseConnectionsCount: 1,
                scannedPhotosCount: documents.filter(d => d.type === 'image').length,
                scannedPhotosMax: 50
            };
        } catch (err) {
            throw new Error("Erreur lors du calcul des statistiques.", { cause: err });
        }
    }
}