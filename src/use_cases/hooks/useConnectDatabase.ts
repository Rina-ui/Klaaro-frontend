import { useState } from "react";
import { useAuth } from "./useAuth.ts"; // Ton hook existant
import { HttpDatabaseRepository } from "../../infrastructure/api/HttpDatabaseRepository.ts";
import type {DatabaseConnectionData} from "../../domain/repositories/DatabaseRepository.ts";

const dbRepository = new HttpDatabaseRepository();

export function useConnectDatabase() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function handleConnect(connectionData: DatabaseConnectionData) {
        if (!token) {
            setError("Session expirée. Veuillez vous reconnecter.");
            return false;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await dbRepository.connectDatabase(connectionData, token);
            setSuccessMessage(result.message);
            return true;
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return { handleConnect, isLoading, error, successMessage, setError, setSuccessMessage };
}