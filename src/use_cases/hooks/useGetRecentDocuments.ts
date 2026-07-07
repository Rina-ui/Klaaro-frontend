import { useState, useEffect } from "react";
import { useAuth } from "./useAuth.ts";
import {HttpDocumentRepository} from "../../infrastructure/HttpDocumentRepository.ts";

// Instanciation de l'infrastructure (peut être injectée via un container DI si nécessaire)
const documentRepository = new HttpDocumentRepository();

export function useGetRecentDocuments() {
    const { user, token } = useAuth();
    const [files, setFiles] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDocuments() {
            if (!user?.id || !token) return;

            try {
                setLoading(true);
                setError(null);

                const fetchedDocuments = await documentRepository.getDocumentsByUserId(user.id, token);

                // On garde les 5 fichiers les plus récents pour le Dashboard
                setFiles(fetchedDocuments.slice(0, 5));
            } catch (err: any) {
                setError(err.message || "Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        }

        loadDocuments();
    }, [user?.id, token]);

    return { files, loading, error };
}