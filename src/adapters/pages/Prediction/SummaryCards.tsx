import React from 'react';
import type {SummaryMetrics} from "../../../entities/PredictionData.ts";

interface SummaryCardsProps {
    summary: SummaryMetrics;
}

export default function SummaryCards({ summary }: SummaryCardsProps): React.JSX.Element {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="bg-[#f1f3f2] p-5 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[110px]">
                <span className="text-[11px] font-bold text-gray-400 tracking-wide">Cash flow prévu (30j)</span>
                <span className="text-2xl font-black tracking-tight text-gray-900 mt-2">{summary.expectedCashFlow} <span className="text-xs font-bold text-gray-400">FCFA</span></span>
            </div>

            <div className="bg-[#f1f3f2] p-5 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[110px]">
                <span className="text-[11px] font-bold text-gray-400 tracking-wide">Commandes prévues</span>
                <span className="text-3xl font-black tracking-tight text-gray-900 mt-2">{summary.expectedOrders}</span>
            </div>

            <div className="bg-[#f1f3f2] p-5 rounded-[24px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[110px]">
                <span className="text-[11px] font-bold text-gray-400 tracking-wide">Seuil de rentabilité</span>
                <span className="text-2xl font-black tracking-tight text-gray-900 mt-2">{summary.breakEvenDate}</span>
            </div>
        </div>
    );
}