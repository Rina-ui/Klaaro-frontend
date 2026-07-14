import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartDataPoint {
    date: string;
    Historique: number | null;
    Prevision: number | null;
}

interface Props {
    chartData: ChartDataPoint[];
    lastGeneratedAt?: string | null;
}

function formatRelative(dateString?: string | null): string {
    if (!dateString) return "Aucune prédiction récente";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Aucune prédiction récente";
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return "Mise à jour à l'instant";
    if (diffMin < 60) return `Mise à jour il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Mise à jour il y a ${diffH}h`;
    return `Mise à jour le ${date.toLocaleDateString('fr-FR')}`;
}

export default function PredictionChart({ chartData, lastGeneratedAt }: Props): React.JSX.Element {
    const hasData = chartData && chartData.length > 0;

    return (
        <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[350px]">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="font-bold text-sm text-gray-900 tracking-wide">Prévisions</h3>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5"> • {formatRelative(lastGeneratedAt)}</p>
                    </div>
                </div>

                <div className="relative w-full h-64 mt-6">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#9ca3af" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1e5138" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#1e5138" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 11 }}
                                />
                                <Area type="monotone" dataKey="Historique" stroke="#6b7280" strokeWidth={2} fill="url(#histGrad)" connectNulls />
                                <Area type="monotone" dataKey="Prevision" stroke="#1e5138" strokeWidth={2.5} fill="url(#predGrad)" connectNulls />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                            <span className="text-xs font-semibold">Aucune prédiction pour le moment</span>
                            <span className="text-[10px]">Importe un fichier ci-dessus pour lancer un calcul.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
