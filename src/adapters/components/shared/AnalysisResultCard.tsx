import { Download, FileSpreadsheet, CheckCircle2, Info } from 'lucide-react';

interface AnalysisResultProps {
    filename: string;
    preprocessedFileUrl?: string;
    explications: string;
    statistiques?: {
        lignesNettoyees: number;
        valeursManquantesCorrigees: number;
        anomaliesDetectees: number;
    };
}

export default function AnalysisResultCard({
                                               filename,
                                               preprocessedFileUrl,
                                               explications,
                                               statistiques
                                           }: AnalysisResultProps) {

    // Télécharger le fichier prétraité
    const handleDownloadPreprocessed = () => {
        if (preprocessedFileUrl) {
            window.open(preprocessedFileUrl, '_blank');
        } else {
            // Simulation de téléchargement si pas d'URL réelle
            const content = "Col1,Col2,Col3\nVal1,Val2,Val3";
            const blob = new Blob([content], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pretraite_${filename}`;
            a.click();
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
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                        <FileSpreadsheet size={14} className="text-emerald-700" />
                        <span>Télécharger Fichier Prétraité</span>
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