import React from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import type { InsightReport } from "../../../entities/PredictionData.ts";

interface InsightCardProps {
    insight: InsightReport;
    onNewSimulation: () => void;
    onViewDetails: () => void;
}

export default function InsightCard({ insight, onNewSimulation, onViewDetails }: InsightCardProps): React.JSX.Element {
    const hasInsight = insight.percentage > 0;

    return (
        <div className="lg:col-start-10 lg:col-span-3 flex flex-col justify-between bg-[#1e5138] p-6 rounded-[32px] text-white shadow-md min-h-[350px]">
            <div>
                <span className="text-xs font-bold text-emerald-200/70 tracking-wide flex items-center gap-1.5 mb-6">
                    <ArrowUpRight size={14} /> Insight IA
                </span>
                {hasInsight ? (
                    <p className="text-xs font-medium leading-relaxed text-emerald-50/90">
                        {insight.message}
                    </p>
                ) : (
                    <p className="text-xs font-medium leading-relaxed text-emerald-50/60">
                        Lance une prédiction pour obtenir un insight personnalisé basé sur tes données.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <button onClick={onNewSimulation} className="w-full bg-white text-gray-900 hover:bg-gray-50 transition-all text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                    <Plus size={13} className="text-[#1e5138]" />
                    <span>Nouvelle Simulation</span>
                </button>
                <button onClick={onViewDetails} className="w-full bg-white/10 hover:bg-white/15 transition-all text-white text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Voir les détails</span>
                    <ArrowUpRight size={13} />
                </button>
            </div>
        </div>
    );
}