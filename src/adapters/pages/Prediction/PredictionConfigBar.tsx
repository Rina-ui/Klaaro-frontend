import React, { useState } from 'react';
import { FileSpreadsheet, BrainCircuit } from 'lucide-react';

interface ConfigBarProps {
    onPredict: (file: File, targetCol: string, nDays: number) => void;
    loading: boolean;
}

export default function PredictionConfigBar({ onPredict, loading }: ConfigBarProps): React.JSX.Element {
    const [targetCol, setTargetCol] = useState('ventes');
    const [nDays, setNDays] = useState(30);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) onPredict(selectedFile, targetCol, nDays);
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

            {/* Input Colonne */}
            <div className="flex-1 w-full">
                <input
                    type="text"
                    value={targetCol}
                    onChange={(e) => setTargetCol(e.target.value)}
                    placeholder="Colonne (ex: ventes)"
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1e5138]"
                    required
                />
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
                disabled={loading || !selectedFile}
                className="h-12 px-6 bg-[#1e5138] hover:bg-[#153a28] disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
                <BrainCircuit className="w-4 h-4" />
                {loading ? "Calcul..." : "Prédire"}
            </button>
        </form>
    );
}