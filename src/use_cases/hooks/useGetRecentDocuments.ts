import { useState, useEffect } from "react";
import { useAuth } from "./useAuth.ts";
import { HttpDocumentRepository } from "../../infrastructure/api/HttpDocumentRepository.ts";
import type {DocumentEntity} from "../../entities/Document.ts";

const documentRepository = new HttpDocumentRepository();

export function useGetRecentDocuments() {
    const { user, token } = useAuth();
    const [files, setFiles] = useState<DocumentEntity[]>([]); // 💡 Utilise DocumentEntity
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadDocuments() {
            if (!user?.id || !token) return;

            try {
                setLoading(true);
                setError(null);
                const fetchedDocuments = await documentRepository.getDocumentsByUserId(user.id, token);
                if (isMounted) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
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
    }, [user?.id, token]);

    return { files, loading, error };
}