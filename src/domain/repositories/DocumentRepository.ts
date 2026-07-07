export interface DocumentRepository {
    getDocumentsByUserId(userId: string, token: string): Promise<Document[]>;
}