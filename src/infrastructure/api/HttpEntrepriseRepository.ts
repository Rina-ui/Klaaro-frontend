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
}