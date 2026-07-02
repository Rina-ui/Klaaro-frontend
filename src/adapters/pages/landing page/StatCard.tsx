import React from 'react';

interface StatCardProps {
    value: string;
    label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
    return (
        <div className="bg-white/40 backdrop-blur-md border border-gray-100/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm transition-all duration-300 hover:translate-y-[-4px]">
            <span className="text-5xl font-black tracking-tight text-gray-900 mb-2">{value}</span>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider max-w-[200px] leading-relaxed">{label}</span>
        </div>
    );
};