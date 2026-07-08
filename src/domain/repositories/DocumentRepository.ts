export type TypeDocument = 'csv' | 'excel' | 'xml'| 'pdf' | 'image';


export interface DocumentUploadData {
    name: string;
    type: TypeDocument;
    taille: number;
    content: string;
    user_id: string;
}

export interface UploadStats {
    uploadedFilesCount: number;
    uploadedFilesTrend: number;
    databaseConnectionsCount: number;
    scannedPhotosCount: number;
    scannedPhotosMax: number;
}

export interface DocumentRepository {
    uploadDocument(doc: {
        name: string;
        type: "csv" | "excel" | "json" | "pdf" | "xml" | "image";
        taille: number;
        content: string
    }, token: string): Promise<any>;
    getStatsByUserId(userId: string, token: string): Promise<UploadStats>;
}