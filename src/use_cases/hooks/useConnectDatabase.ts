import { useState } from "react";
import { useAuth } from "./useAuth.ts";
import type { DatabaseConnectionData } from "../../domain/repositories/DatabaseRepository.ts";

interface UseConnectDatabaseResult {
    handleConnect: (form: DatabaseConnectionData) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

export function useConnectDatabase(): UseConnectDatabaseResult {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleConnect = async (form: DatabaseConnectionData): Promise<boolean> => {
        if (!token) {
            setError("Vous devez être connecté pour ajouter une base de données.");
            return false;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Le payload reste en camelCase : la route backend /databases/connect
            // accepte maintenant ce format grâce aux alias Pydantic (dbType, databaseName).
            // L'identité de l'utilisateur passe uniquement par le token JWT, plus besoin
            // d'envoyer user_id manuellement.
            const response = await fetch('http://localhost:8000/databases/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Impossible de se connecter à cette base de données.");
            }

            setSuccessMessage(data.message || "Base de données connectée avec succès !");
            return true;

        } catch (err: any) {
            setError(err.message || "Erreur inattendue lors de la connexion à la base de données.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { handleConnect, isLoading, error, successMessage };
}