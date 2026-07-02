import React from 'react';

export default function PredictionChart(): React.JSX.Element {
    return (
        <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[350px]">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 tracking-wide">Prévisions</h3>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5"> • Mise à jour il y a 2h</p>
                    </div>

                    <div className="flex bg-gray-200/80 p-0.5 rounded-xl text-[10px] font-bold text-gray-400 shadow-inner">
                        <span className="px-2.5 py-1 cursor-pointer hover:text-gray-700">Optimiste</span>
                        <span className="bg-white text-[#1e5138] px-3 py-1 rounded-lg shadow-sm">Réaliste</span>
                        <span className="px-2.5 py-1 cursor-pointer hover:text-gray-700">Pessimiste</span>
                    </div>
                </div>

                <div className="relative w-full h-44 mt-8 flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1e5138" stopOpacity="0.12" />
                                <stop offset="100%" stopColor="#1e5138" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>
                        <line x1="200" y1="0" x2="200" y2="120" stroke="#1e5138" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />

                        <rect x="25" y="70" width="12" height="50" rx="3" fill="#e2e4e3" />
                        <rect x="75" y="60" width="12" height="60" rx="3" fill="#e2e4e3" />
                        <rect x="125" y="80" width="12" height="40" rx="3" fill="#e2e4e3" />
                        <rect x="175" y="50" width="12" height="70" rx="3" fill="#e2e4e3" />

                        <path d="M 187 60 Q 230 45, 280 55 T 380 20" fill="none" stroke="#1e5138" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 187 60 Q 230 45, 280 55 T 380 20 L 380 120 L 187 120 Z" fill="url(#chart-grad)" />

                        <circle cx="187" cy="60" r="4.5" fill="#1e5138" stroke="white" strokeWidth="2.5" />
                    </svg>

                    <div className="absolute top-[28px] left-[148px] bg-[#1e5138] text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                        Aujourd'hui
                    </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mt-3 px-1">
                    <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span className="text-[#1e5138] font-black">Mai</span><span>Juin</span><span>Juil</span><span>Août</span>
                </div>
            </div>
        </div>
    );
}