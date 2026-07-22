export interface AddUserPayload {
    firstname: string;
    lastname: string;
    email: string;
    profession: string;
}

export class HttpEntrepriseRepository {
    private baseUrl = "http://127.0.0.1:8000";

    async addCollaborator(payload: AddUserPayload, token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/enterprise/add-user`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Échec de l'ajout du collaborateur.");
        }
    }

    async getCollaborators(token: string): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/user/members`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error("Impossible de récupérer l'équipe.");
        return response.json();
    }

    async deleteCollaborator(userId: string | number, token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error("Échec de la suppression du collaborateur.");
    }
}