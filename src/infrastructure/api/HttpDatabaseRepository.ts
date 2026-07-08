import type {DatabaseConnectionData, DatabaseRepository} from "../../domain/repositories/DatabaseRepository.ts";

export class HttpDatabaseRepository implements DatabaseRepository {
    private baseUrl = "http://127.0.0.1:8000";

    async connectDatabase(connection: DatabaseConnectionData, token: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${this.baseUrl}/databases/connect`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: connection.name,
                db_type: connection.dbType,
                host: connection.host,
                port: Number(connection.port),
                username: connection.username,
                password: connection.password,
                database_name: connection.databaseName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Échec de la connexion à la base de données.");
        }

        return { success: true, message: data.message };
    }
}