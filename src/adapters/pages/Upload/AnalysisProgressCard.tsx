import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import type {AnalysisStatus} from "../../../entities/UploadStats.ts";

interface AnalysisProgressCardProps {
    analysis: AnalysisStatus;
}

export default function AnalysisProgressCard({ analysis }: AnalysisProgressCardProps): React.JSX.Element {
    return (
        <div className="bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-sm text-gray-900 tracking-wide">Analyse en cours...</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">{analysis.progressPercentage}%</span>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-4">{analysis.fileName} • {analysis.fileSize}</p>

                {/* Barre de progression */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-5">
                    <div
                        className="bg-[#1e5138] h-full rounded-full transition-all duration-700"
                        style={{ width: `${analysis.progressPercentage}%` }}
                    />
                </div>

                {/* Étapes de l'analyse */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium border-t border-gray-200/30 pt-3.5">
                    <div className={`flex items-center gap-2 ${analysis.steps.ocr === 'completed' ? 'text-gray-800' : 'text-gray-400'}`}>
                        <CheckCircle2 size={14} className={analysis.steps.ocr === 'completed' ? 'text-emerald-600' : 'text-gray-300'} />
                        <span>OCR terminé</span>
                    </div>
                    <div className={`flex items-center gap-2 ${analysis.steps.categorization === 'completed' ? 'text-gray-800' : 'text-gray-400'}`}>
                        <CheckCircle2 size={14} className={analysis.steps.categorization === 'completed' ? 'text-emerald-600' : 'text-gray-300'} />
                        <span>Catégorisation</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-800">
                        {analysis.steps.fiscalImpact === 'processing' ? (
                            <>
                                <RefreshCw size={13} className="animate-spin text-emerald-600" />
                                <span className="text-gray-800">Impact fiscal</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={14} className="text-gray-300" />
                                <span className="text-gray-400">Impact fiscal</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}