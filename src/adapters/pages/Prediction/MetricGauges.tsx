import React from 'react';
import { BarChart3, TrendingUp, ChevronRight } from 'lucide-react';
import type {MetricOverview} from "../../../entities/PredictionData.ts";

interface MetricGaugesProps {
    metrics: MetricOverview;
}

export default function MetricGauges({ metrics }: MetricGaugesProps): React.JSX.Element {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-center w-full">
            {/* GÉLULES DE PROGRESSION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-6">
                <div className="cursor-pointer group">
                    <span className="text-[11px] font-bold text-gray-500 block mb-1.5 flex items-center gap-1 group-hover:text-gray-900 transition-colors">
                        <BarChart3 size={12} className="text-[#1e5138]" /> Overview
                    </span>
                    <div className="w-full bg-[#d8dbd8] h-7 rounded-full overflow-hidden p-0.5 shadow-inner transition-all group-hover:ring-1 group-hover:ring-[#1e5138]/20">
                        <div className="bg-[#1e5138] h-full rounded-full flex items-center justify-between px-3 shadow-sm" style={{ width: `${metrics.overviewProgress}%` }}>
                            <span className="text-[10px] font-black text-white">{metrics.overviewProgress}%</span>
                            <ChevronRight size={10} className="text-white opacity-80" />
                        </div>
                    </div>
                </div>

                <div className="cursor-pointer group">
                    <span className="text-[11px] font-bold text-gray-400 block mb-1.5 flex items-center gap-1 group-hover:text-gray-900 transition-colors">
                        <TrendingUp size={12} /> Croissance
                    </span>
                    <div className="w-full bg-[#d8dbd8] h-7 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className="bg-white h-full rounded-full flex items-center pl-3 shadow-sm" style={{ width: `${metrics.growthProgress}%` }}>
                            <span className="text-[10px] font-black text-gray-700">{metrics.growthProgress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPTEURS CHIFFRÉS SANS BADGES */}
            <div className="lg:col-start-9 lg:col-span-4 flex justify-between items-center gap-4">
                <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">{metrics.criticalIssues}</span>
                    <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Critical issues</span>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">{metrics.daysSpent}</span>
                    <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Days spent</span>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">{metrics.overnightWork}</span>
                    <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Overnight work</span>
                </div>
            </div>
        </div>
    );
}