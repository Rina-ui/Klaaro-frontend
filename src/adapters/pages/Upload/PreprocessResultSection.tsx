import React, { useState } from 'react';
import {
    BarChart, Bar,
    LineChart, Line,
    ScatterChart, Scatter,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type {PreprocessResponse} from '../../../use_cases/hooks/useUploadDashboard.ts';

// Extension de l'interface pour supporter le type de graphique du backend
interface ExtendedPreprocessResponse extends PreprocessResponse {
    chart_type?: 'bar' | 'line' | 'scatter' | 'pie';
}

interface Props {
    result: ExtendedPreprocessResponse;
}

const COLORS = ['#1e5138', '#2d7a54', '#40a773', '#73cda2', '#a6e3c5'];

export default function PreprocessResultSection({ result }: Props): React.JSX.Element {
    const [showPreview, setShowPreview] = useState(false);

    const columns = result.rapport.colonnes_apres || [];
    const dataRows = result.apercu_donnees || [];
    const chartType = result.chart_type || 'bar'; // Type dynamique reçu du backend

    // Fonction de rendu dynamique du graphique selon le type détecté par le ML
    const renderChart = () => {
        if (!result.chart_data || result.chart_data.length === 0) {
            return <p className="text-sm text-gray-400 italic">Aucune donnée structurelle disponible pour l'affichage graphique.</p>;
        }

        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={result.chart_data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend iconSize={10} fontSize={11} />
                        <Line type="monotone" dataKey="valeur" stroke="#1e5138" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                );

            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis type="category" dataKey="name" stroke="#6b7280" fontSize={11} />
                        <YAxis type="number" dataKey="valeur" stroke="#6b7280" fontSize={11} axisLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Distribution" data={result.chart_data} fill="#1e5138" />
                    </ScatterChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={result.chart_data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="valeur"
                        >
                            {result.chart_data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                );

            case 'bar':
            default:
                return (
                    <BarChart data={result.chart_data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#f9fafb' }} />
                        <Bar dataKey="valeur" fill="#1e5138" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    return (
        <div className="w-full mt-6 flex flex-col gap-6 transition-all duration-300">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Rapport de Prétraitement */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Rapport de Prétraitement</h3>
                        <p className="text-sm text-gray-600 mb-1">
                            Format décodé : <span className="font-bold text-[#1e5138]">.{result.format_origine.toUpperCase()}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Lignes : <span className="font-semibold">{result.rapport.lignes_avant}</span> → <span className="font-bold text-[#1e5138]">{result.rapport.lignes_apres}</span>
                        </p>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Actions de nettoyage</h4>
                        <ul className="space-y-1 max-h-[110px] overflow-y-auto mb-4">
                            {result.rapport.actions.map((action, idx) => (
                                <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                    <span className="text-[#1e5138] font-bold">✓</span> {action}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full py-2.5 px-4 bg-[#1e5138] hover:bg-[#153a28] text-white text-xs font-bold rounded-xl transition-colors duration-200 text-center shadow-sm"
                    >
                        {showPreview ? "Masquer l'aperçu des données" : "Voir l'aperçu des données"}
                    </button>
                </div>

                {/* Graphique Adaptatif */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 min-h-[260px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Analyse Graphique Visuelle</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md text-gray-500">
                            Mode : {chartType}
                        </span>
                    </div>
                    <div className="w-full h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Aperçu des données (.head()) */}
            {showPreview && (
                <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Aperçu des données nettoyées</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Affichage des 5 premières lignes du jeu de données brut.</p>
                    </div>

                    {columns.length > 0 && dataRows.length > 0 ? (
                        <div className="w-full overflow-x-auto border border-gray-100 rounded-xl">
                            <table className="w-full border-collapse text-left text-xs text-gray-600">
                                <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
                                    {columns.map((col) => (
                                        <th key={col} className="p-3 uppercase tracking-wider">{col}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {dataRows.slice(0, 5).map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                                        {columns.map((col) => (
                                            <td key={col} className="p-3 font-medium max-w-xs truncate">
                                                {typeof row[col] === 'object' && row[col] !== null
                                                    ? JSON.stringify(row[col])
                                                    : String(row[col])
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Aucune ligne disponible pour l'aperçu.</p>
                    )}
                </div>
            )}
        </div>
    );
}