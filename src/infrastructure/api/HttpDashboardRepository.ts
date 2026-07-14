export interface DashboardRecentFile {
    id: string;
    name: string;
    taille: number;
    type: string;
    upload_date: string;
}

export interface DashboardActivityEntry {
    kind: 'alerte' | 'rapport' | 'decision';
    text: string;
    sub: string;
    date: string;
    niveau_gravite?: string | null;
}

export interface DashboardSummary {
    uploadedFilesCount: number;
    analysesCount: number;
    predictionsCount: number;
    decisionsCount: number;
    alertesCount: number;
    recentFiles: DashboardRecentFile[];
    recentActivity: DashboardActivityEntry[];
    uploadsByDay: { date: string; count: number }[];
}

export class HttpDashboardRepository {
    private baseUrl = "http://127.0.0.1:8000";

    async getSummary(token: string): Promise<DashboardSummary> {
        const response = await fetch(`${this.baseUrl}/dashboard/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Impossible de charger le résumé du tableau de bord.");
        }

        return response.json();
    }
}