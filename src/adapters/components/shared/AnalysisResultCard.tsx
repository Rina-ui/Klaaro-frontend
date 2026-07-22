import { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useAuth } from '../../../use_cases/hooks/useAuth.ts';

interface SimpleDownloadButtonProps {
    filename: string;
    rawFile?: File; // Le fichier d'origine sélectionné
    exportFormat?: 'csv' | 'xlsx' | 'json'; // Format souhaité ('csv' par défaut)
}

export default function SimpleDownloadButton({
                                                 filename,
                                                 rawFile,
                                                 exportFormat = 'csv'
                                             }: SimpleDownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const { token } = useAuth();

    // Télécharger le fichier prétraité depuis l'API FastAPI
    const handleDownloadPreprocessed = async () => {
        if (!rawFile) {
            console.error("Fichier d'origine non fourni au composant.");
            alert("Aucun fichier d'origine trouvé pour le téléchargement.");
            return;
        }

        setIsDownloading(true);

        try {
            const formData = new FormData();
            formData.append('file', rawFile);

            const apiUrl = `http://localhost:8000/ml/export?export_format=${exportFormat}`;

            const headers: Record<string, string> = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = "Erreur lors du téléchargement du fichier.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;
                } catch {
                    // Si la réponse n'est pas au format JSON
                }
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const contentDisposition = response.headers.get('Content-Disposition');
            let downloadFilename = `klaaro_clean_${filename}`;
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const matches = contentDisposition.match(/filename="?([^";]+)"?/);
                if (matches && matches[1]) {
                    downloadFilename = matches[1];
                }
            }

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFilename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (error: unknown) {
            console.error("Erreur de téléchargement :", error);
            const errorMessage = error instanceof Error ? error.message : "Impossible de télécharger le fichier nettoyé.";
            alert(errorMessage);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownloadPreprocessed}
            disabled={isDownloading || !rawFile}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 border border-emerald-200/60 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
            {isDownloading ? (
                <Loader2 size={16} className="animate-spin text-emerald-700" />
            ) : (
                <FileSpreadsheet size={16} className="text-emerald-700" />
            )}
            <span>{isDownloading ? "Téléchargement..." : "Télécharger Fichier Prétraité"}</span>
        </button>
    );
}