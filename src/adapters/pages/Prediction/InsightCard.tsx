import React from 'react';
import { ArrowUpRight, Plus, Sparkles } from 'lucide-react';
import type { InsightReport } from "../../../entities/PredictionData.ts";

interface InsightCardProps {
    insight: InsightReport;
    onNewSimulation: () => void;
    onViewDetails: () => void;
}

export default function InsightCard({ insight, onNewSimulation, onViewDetails }: InsightCardProps): React.JSX.Element {
    // Vérification que nous avons soit un message, soit un pourcentage supérieur à 0
    const hasInsight = Boolean(insight?.message && insight.message.trim() !== "");

    return (
        <div className="lg:col-start-10 lg:col-span-3 flex flex-col justify-between bg-[#1e5138] p-6 rounded-[32px] text-white shadow-md min-h-[420px] max-h-[500px]">
            {/* Header de la carte */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-200/70 tracking-wide flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-300" /> Synthèse & Décisions KLAARO
                </span>
                {insight.percentage > 0 && (
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                        {insight.percentage}% impact
                    </span>
                )}
            </div>

            {/* Zone de contenu de la synthèse décisionnelle avec défilement fluide */}
            <div className="flex-1 overflow-y-auto my-2 pr-1 custom-scrollbar">
                {hasInsight ? (
                    <div className="text-xs font-normal leading-relaxed text-emerald-50/90 whitespace-pre-line space-y-2">
                        {insight.message}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs font-medium leading-relaxed text-emerald-50/60 text-center italic">
                            Lance une prédiction pour obtenir la synthèse IA et les suggestions de décisions basées sur tes données.
                        </p>
                    </div>
                )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-emerald-800/60 mt-2">
                <button
                    onClick={onNewSimulation}
                    className="w-full bg-white text-gray-900 hover:bg-emerald-50 transition-all text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                    <Plus size={13} className="text-[#1e5138]" />
                    <span>Nouvelle Simulation</span>
                </button>
                <button
                    onClick={onViewDetails}
                    className="w-full bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 transition-all text-white text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <span>Voir les détails</span>
                    <ArrowUpRight size={13} />
                </button>
            </div>
        </div>
    );
}