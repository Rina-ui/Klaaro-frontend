export type RapportType = 'preprocessing' | 'prediction';

export interface RapportEntity {
    id: string;
    type: RapportType;
    content: string;
    periode: string;
    date_generation: string;
    user_id: string;
}

export interface CreateRapportPayload {
    type: RapportType;
    content: string;
    periode: string;
}
