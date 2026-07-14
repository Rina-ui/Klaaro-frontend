import React, { useState } from 'react';
import { FileSpreadsheet, BrainCircuit, Loader2 } from 'lucide-react';
import { useAuth } from '../../../use_cases/hooks/useAuth.ts';

interface ConfigBarProps {
    onPredict: (file: File, targetCol: string, nDays: number) => void;
    loading: boolean;
}

export default function PredictionConfigBar({ onPredict, loading }: ConfigBarProps): React.JSX.Element {
    const { token } = useAuth();
    const [targetCol, setTargetCol] = useState('');
    const [nDays, setNDays] = useState(30);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [availableColumns, setAvailableColumns] = useState<string[]>([]);
    const [columnsLoading, setColumnsLoading] = useState(false);
    const [columnsError, setColumnsError] = useState<string | null>(null);

    // Dès qu'un fichier est choisi, on lit ses colonnes.
    // Pour un CSV : lecture locale instantanée (juste la 1ère ligne), pas d'appel réseau.
    // Pour un Excel : on n'a pas de lib de parsing xlsx côté front, donc on passe
    // par /ml/preprocess en dernier recours (plus lent, mais rare en pratique).
    const readCsvColumnsLocally = (file: File): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const text = reader.result as string;
                    const firstLine = text.split(/\r?\n/)[0] ?? '';
                    const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';
                    const columns = firstLine
                        .split(delimiter)
                        .map((c) => c.trim().replace(/^"|"$/g, ''))
                        .filter(Boolean);
                    columns.length ? resolve(columns) : reject(new Error("En-têtes introuvables."));
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error("Impossible de lire le fichier."));
            // On ne lit que les 64 premiers Ko : largement suffisant pour la 1ère ligne, beaucoup plus rapide sur un gros fichier
            reader.readAsText(file.slice(0, 65536));
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setAvailableColumns([]);
        setTargetCol('');
        setColumnsError(null);

        const isCsv = file.name.toLowerCase().endsWith('.csv');

        if (isCsv) {
            try {
                const columns = await readCsvColumnsLocally(file);
                setAvailableColumns(columns);
                setTargetCol(columns[0]);
            } catch (err) {
                console.error("Erreur lors de la lecture locale des colonnes :", err);
                setColumnsError("Impossible de lire les colonnes de ce fichier.");
            }
            return;
        }

        // Fichier Excel : pas de parsing local, on passe par le backend
        if (!token) return;

        setColumnsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8000/ml/preprocess', {
                method: 'POST',
                body: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok && data.rapport?.colonnes_apres?.length) {
                setAvailableColumns(data.rapport.colonnes_apres);
                setTargetCol(data.rapport.colonnes_apres[0]);
            } else {
                setColumnsError("Impossible de lire les colonnes de ce fichier.");
            }
        } catch (err) {
            console.error("Erreur lors de la lecture des colonnes :", err);
            setColumnsError("Impossible de lire les colonnes de ce fichier.");
        } finally {
            setColumnsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile && targetCol) onPredict(selectedFile, targetCol, nDays);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-[#f1f3f2] p-4 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col md:flex-row items-center gap-4 mb-6">

            {/* Input Fichier */}
            <div className="flex-1 w-full relative flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#1e5138] rounded-xl h-12 transition-colors bg-white cursor-pointer">
                <input type="file" onChange={handleFileChange} accept=".csv,.xlsx,.xls" className="absolute inset-0 opacity-0 cursor-pointer" required />
                <div className="flex items-center gap-2 text-gray-500">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="text-xs font-semibold truncate max-w-[150px]">
                        {selectedFile ? selectedFile.name : "Importer un fichier..."}
                    </span>
                </div>
            </div>

            {/* Sélecteur de colonne : menu déroulant dès que les colonnes sont connues,
                sinon champ texte de secours (fichier pas encore choisi / lecture échouée) */}
            <div className="flex-1 w-full">
                {availableColumns.length > 0 ? (
                    <select
                        value={targetCol}
                        onChange={(e) => setTargetCol(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1e5138]"
                        required
                    >
                        {availableColumns.map((col) => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                ) : (
                    <div className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl flex items-center gap-2">
                        {columnsLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1e5138]" />
                                <span className="text-xs font-semibold text-gray-400">Lecture des colonnes...</span>
                            </>
                        ) : (
                            <input
                                type="text"
                                value={targetCol}
                                onChange={(e) => setTargetCol(e.target.value)}
                                placeholder={columnsError ?? "Sélectionnez d'abord un fichier"}
                                className="w-full bg-transparent text-xs font-semibold text-gray-700 focus:outline-none"
                                disabled={!selectedFile}
                                required
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Input Jours */}
            <div className="flex-1 w-full flex items-center bg-white border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[#1e5138]">
                <input
                    type="number"
                    value={nDays}
                    onChange={(e) => setNDays(parseInt(e.target.value) || 30)}
                    className="w-full bg-transparent text-xs font-semibold text-gray-700 focus:outline-none"
                    min="1"
                    required
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Jours</span>
            </div>

            {/* Bouton Soumettre */}
            <button
                type="submit"
                disabled={loading || !selectedFile || !targetCol || columnsLoading}
                className="h-12 px-6 bg-[#1e5138] hover:bg-[#153a28] disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
                <BrainCircuit className="w-4 h-4" />
                {loading ? "Calcul..." : "Prédire"}
            </button>
        </form>
    );
}