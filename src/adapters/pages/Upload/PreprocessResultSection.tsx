import React, { useState, useRef, useEffect } from 'react';
import {
    BarChart, Bar,
    LineChart, Line,
    ScatterChart, Scatter,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export interface PreparedChart {
    type: 'bar' | 'line' | 'scatter' | 'pie';
    title: string;
    reason: string;
    explanation: string;
    colonne_choisie?: string;
    data: Array<{ name: string | number; valeur: number }>;
}

interface PreprocessResponse {
    status: string;
    format_origine: string;
    charts: PreparedChart[];
    rapport: {
        lignes_avant: number;
        lignes_apres: number;
        colonnes_avant: string[];
        colonnes_apres: string[];
        actions: string[];
    };
    apercu_donnees: Array<Record<string, any>>;
}

interface Props {
    result: Partial<PreprocessResponse> | null | undefined;
}

const COLORS = ['#1e5138', '#2d7a54', '#40a773', '#73cda2', '#a6e3c5'];

const EMPTY_RAPPORT = {
    lignes_avant: 0,
    lignes_apres: 0,
    colonnes_avant: [] as string[],
    colonnes_apres: [] as string[],
    actions: [] as string[]
};

export default function PreprocessResultSection({ result }: Props): React.JSX.Element {
    const [showPreview, setShowPreview] = useState(false);
    const [openExplanationIndex, setOpenExplanationIndex] = useState<number | null>(null);

    // Référence pour cibler l'ancre du tableau d'aperçu
    const previewRef = useRef<HTMLDivElement>(null);

    // ✅ Garde-fou : si le résultat n'a pas la forme attendue (ex: réponse OCR
    // plutôt que réponse de prétraitement ML), on ne plante jamais, on affiche
    // un état vide à la place.
    const rapport = result?.rapport ?? EMPTY_RAPPORT;
    const columns = rapport.colonnes_apres ?? [];
    const dataRows = result?.apercu_donnees ?? [];
    const charts = result?.charts ?? [];
    const hasRapport = !!result?.rapport;

    // Déclenche le scroll dès que l'aperçu est activé
    useEffect(() => {
        if (showPreview && previewRef.current) {
            previewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [showPreview]);

    const renderSingleChart = (chart: PreparedChart) => {
        if (!chart.data || chart.data.length === 0) {
            return <p className="text-sm text-gray-400 italic">Aucune donnée exploitable pour ce graphique.</p>;
        }

        switch (chart.type) {
            case 'line':
                return (
                    <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="valeur" stroke="#1e5138" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                );

            case 'scatter':
                return (
                    <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis type="category" dataKey="name" stroke="#6b7280" fontSize={11} />
                        <YAxis type="number" dataKey="valeur" stroke="#6b7280" fontSize={11} axisLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Points" data={chart.data} fill="#1e5138" />
                    </ScatterChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={chart.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="valeur"
                        >
                            {chart.data.map((_entry, index) => (
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
                    <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#f9fafb' }} />
                        <Bar dataKey="valeur" fill="#1e5138" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    // Si on n'a vraiment rien d'exploitable (ni rapport, ni graphiques), on
    // affiche un état vide clair plutôt qu'un bloc à moitié rendu.
    if (!hasRapport && charts.length === 0) {
        return (
            <div className="w-full mt-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-sm text-gray-400 italic">
                    Ce résultat ne contient pas de rapport de prétraitement exploitable pour cet affichage.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full mt-6 flex flex-col gap-6 transition-all duration-300">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* BLOC RAPPORT DE NETTOYAGE */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full lg:col-span-1">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Rapport de Pretraitement</h3>
                        <p className="text-sm text-gray-600 mb-1">
                            Format decode : <span className="font-bold text-[#1e5138]">.{(result?.format_origine ?? 'inconnu').toUpperCase()}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Lignes : <span className="font-semibold">{rapport.lignes_avant}</span> → <span className="font-bold text-[#1e5138]">{rapport.lignes_apres}</span>
                        </p>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Actions de nettoyage</h4>
                        {rapport.actions.length > 0 ? (
                            <ul className="space-y-1 max-h-[140px] overflow-y-auto mb-4">
                                {rapport.actions.map((action, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                        <span className="text-[#1e5138] font-bold">✓</span> {action}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-400 italic mb-4">Aucune action de nettoyage enregistrée.</p>
                        )}
                    </div>

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full py-2.5 px-4 bg-[#1e5138] hover:bg-[#153a28] text-white text-xs font-bold rounded-xl transition-colors duration-200 text-center shadow-sm cursor-pointer border-none"
                    >
                        {showPreview ? "Masquer l'aperçu des données" : "Voir l'aperçu des données"}
                    </button>
                </div>

                {/* BLOC GRAPHIQUE CENTRAL PRINCIPAL */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 min-h-[260px] flex flex-col justify-between">
                    {charts.length > 0 ? (
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{charts[0].title}</h3>
                                <button
                                    onClick={() => setOpenExplanationIndex(openExplanationIndex === 0 ? null : 0)}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border-none cursor-pointer transition-colors"
                                >
                                    {openExplanationIndex === 0 ? "Fermer l'analyse" : "Analyser les données"}
                                </button>
                            </div>

                            <div className="w-full h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    {renderSingleChart(charts[0])}
                                </ResponsiveContainer>
                            </div>

                            {openExplanationIndex === 0 && (
                                <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl transition-all flex flex-col gap-3">
                                    {charts[0].colonne_choisie && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Criblage des données</h4>
                                            <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200/60 leading-relaxed font-medium">
                                                {charts[0].colonne_choisie}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Analyse approfondie</h4>
                                        <p className="text-xs text-gray-800 font-semibold leading-relaxed">{charts[0].explanation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic flex items-center justify-center h-full">Aucune représentation visuelle disponible.</p>
                    )}
                </div>
            </div>

            {/* AUTRES GRAPHIQUES DISPONIBLES - RESTE DE LA LISTE */}
            {charts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {charts.slice(1).map((chart, idx) => {
                        const actualIndex = idx + 1;
                        const isUniqueSecondary = charts.slice(1).length === 1;

                        return (
                            <div
                                key={idx}
                                className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between ${
                                    isUniqueSecondary ? 'md:col-span-2' : ''
                                }`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-gray-900">{chart.title}</h4>
                                    <button
                                        onClick={() => setOpenExplanationIndex(openExplanationIndex === actualIndex ? null : actualIndex)}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border-none cursor-pointer transition-colors"
                                    >
                                        {openExplanationIndex === actualIndex ? "Fermer l'analyse" : "Analyser les données"}
                                    </button>
                                </div>
                                <div className="w-full h-[200px] my-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {renderSingleChart(chart)}
                                    </ResponsiveContainer>
                                </div>

                                {openExplanationIndex === actualIndex && (
                                    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl transition-all flex flex-col gap-3">
                                        {chart.colonne_choisie && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Criblage des données</h4>
                                                <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200/60 leading-relaxed font-medium">
                                                    {chart.colonne_choisie}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Analyse approfondie</h4>
                                            <p className="text-xs text-gray-800 font-semibold leading-relaxed">{chart.explanation}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* SECTION APERÇU DES DONNÉES TABLEAU AVEC ANCRE DE SÉLECTION */}
            {showPreview && (
                <div ref={previewRef} className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm scroll-mt-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Aperçu des donnees nettoyees</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Affichage des 5 premieres lignes du jeu de donnees apres passage des filtres.</p>
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