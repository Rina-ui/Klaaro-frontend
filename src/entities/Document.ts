export type TypeDocument = 'csv' | 'excel' | 'json' | 'pdf' | 'xml' | 'image';

export interface DocumentEntity {
    id: string;
    name: string;
    type: TypeDocument;
    taille: number;
    content: string;
    user_id: string;
}