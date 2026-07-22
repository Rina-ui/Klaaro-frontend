import { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle2, Info, Loader2 } from 'lucide-react';

interface AnalysisResultProps {
    filename: string;
    rawFile?: File; // Le fichierUpload sélectionné par l'utilisateur
    explications: string;
    statistiques?: {
        lignesNettoyees: number;
        valeursManquantesCorrigees: number;
        anomaliesDetectees: number;
    };
    exportFormat?: 'csv' | 'xlsx' | 'json'; // Format souhaité (csv par défaut)
}

export default function AnalysisResultCard({
                                               filename,
                                               rawFile,
                                               explications,
                                               statistiques,
                                               exportFormat = 'csv'
                                           }: AnalysisResultProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    // Télécharger le fichier prétraité depuis l'API FastAPI
    const handleDownloadPreprocessed = async () => {
        if (!rawFile) {
            console.error("Fichier d'origine non fourni au composant.");
            return;
        }

        setIsDownloading(true);

        try {
            const formData = new FormData();
            formData.append('file', rawFile);

            // URL de ton API Backend (ajuste l'URL/port selon ta configuration)
            const apiUrl = `${'http://localhost:8000'}/ml/export?export_format=${exportFormat}`;

            // Récupération éventuelle du token d'authentification si la route est sécurisée
            const token = localStorage.getItem('token');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Erreur lors du téléchargement du fichier.");
            }

            // Récupération du blob binaire renvoyé par FastAPI
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            // Extraction dynamique du nom de fichier transmis via les headers HTTP
            const contentDisposition = response.headers.get('Content-Disposition');
            let downloadFilename = `klaaro_clean_${filename}`;
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const matches = contentDisposition.match(/filename="?([^";]+)"?/);
                if (matches && matches[1]) {
                    downloadFilename = matches[1];
                }
            }

            // Déclenchement automatique du téléchargement
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFilename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (error) {
            console.error("Erreur de téléchargement :", error);
            alert("Impossible de télécharger le fichier nettoyé.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Télécharger le rapport explicatif au format texte/markdown
    const handleDownloadReport = () => {
        const reportContent = `RAPPORT D'ANALYSE KLAARO\nFichier source : ${filename}\nDate : ${new Date().toLocaleDateString('fr-FR')}\n\n=========================================\nEXPLICATIONS ET SYNTHÈSE :\n=========================================\n\n${explications}`;

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_analyse_${filename}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full space-y-5">
            {/* Entête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md mb-1">
                        <CheckCircle2 size={12} /> Analyse & Prétraitement Terminés
                    </span>
                    <h3 className="font-bold text-sm text-gray-800">{filename}</h3>
                </div>

                {/* Boutons d'exportation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadPreprocessed}
                        disabled={isDownloading || !rawFile}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 border border-emerald-200/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                        {isDownloading ? (
                            <Loader2 size={14} className="animate-spin text-emerald-700" />
                        ) : (
                            <FileSpreadsheet size={14} className="text-emerald-700" />
                        )}
                        <span>{isDownloading ? "Téléchargement..." : "Télécharger Fichier Prétraité"}</span>
                    </button>

                    <button
                        onClick={handleDownloadReport}
                        className="px-3 py-2 bg-[#1e5138] hover:bg-[#153a28] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                        <Download size={14} />
                        <span>Rapport Explicatif</span>
                    </button>
                </div>
            </div>

            {/* Statistiques rapides de prétraitement */}
            {statistiques && (
                <div className="grid grid-cols-3 gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100/80 text-center">
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium">Lignes traitées</p>
                        <p className="text-sm font-bold text-gray-800">{statistiques.lignesNettoyees}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium">Valeurs corrigées</p>
                        <p className="text-sm font-bold text-emerald-600">{statistiques.valeursManquantesCorrigees}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium">Anomalies détectées</p>
                        <p className="text-sm font-bold text-amber-600">{statistiques.anomaliesDetectees}</p>
                    </div>
                </div>
            )}

            {/* Explications fournies par le backend */}
            <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Info size={14} className="text-[#1e5138]" /> Explications et Interprétation des Résultats
                </h4>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                    {explications}
                </div>
            </div>
        </div>
    );
}