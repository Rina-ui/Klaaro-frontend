import { useState, useEffect } from "react";
import { useAuth } from "./useAuth.ts";
import { HttpDocumentRepository } from "../../infrastructure/api/HttpDocumentRepository.ts";
import type { DocumentEntity } from "../../entities/Document.ts";

const documentRepository = new HttpDocumentRepository();

export function useGetRecentDocuments() {
    const { token } = useAuth();
    const [files, setFiles] = useState<DocumentEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadDocuments() {
            if (!token) return;

            try {
                setLoading(true);
                setError(null);
                const fetchedDocuments = await documentRepository.getRecentDocuments(token);

                if (isMounted) {
                    setFiles(fetchedDocuments.slice(0, 5));
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Une erreur est survenue.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadDocuments().catch((err) => console.error(err));

        return () => {
            isMounted = false;
        };
    }, [token]);

    return { files, loading, error };
}