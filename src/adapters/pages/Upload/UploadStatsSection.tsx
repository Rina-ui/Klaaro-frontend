import React from 'react';
import { FileText, Database, Image as ImageIcon, Layers } from 'lucide-react';
import type {UploadStats} from "../../../entities/UploadStats.ts";

interface UploadStatsSectionProps {
    stats: UploadStats;
    globalVolume: number;
}

export default function UploadStatsSection({ stats, globalVolume }: UploadStatsSectionProps): React.JSX.Element {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-start">
            {/* Les 3 cartes blanches regroupées de manière serrée */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-8">

                {/* Fichiers Uploadés */}
                <div className="bg-[#f1f3f2] p-6 rounded-[28px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 tracking-wide">Fichiers uploadés</span>
                        <span className="text-[10px] font-bold bg-emerald-100/60 text-emerald-800 px-2 py-0.5 rounded-full">+{stats.uploadedFilesTrend}</span>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                        <div className="p-3 bg-gray-200/60 rounded-2xl text-gray-500">
                            <FileText size={20} />
                        </div>
                        <span className="text-4xl font-black tracking-tight text-gray-900">{stats.uploadedFilesCount}</span>
                    </div>
                </div>

                {/* Connexions BD */}
                <div className="bg-[#f1f3f2] p-6 rounded-[28px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 tracking-wide">Connexions BD</span>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                        <div className="p-3 bg-gray-200/60 rounded-2xl text-gray-500">
                            <Database size={20} />
                        </div>
                        <span className="text-4xl font-black tracking-tight text-gray-900">{stats.databaseConnectionsCount}</span>
                    </div>
                </div>

                {/* Photos Scannées */}
                <div className="bg-[#f1f3f2] p-6 rounded-[28px] border border-gray-200/30 shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 tracking-wide">Photos scannées</span>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                        <div className="p-3 bg-gray-200/60 rounded-2xl text-gray-500">
                            <ImageIcon size={20} />
                        </div>
                        <span className="text-4xl font-black tracking-tight text-gray-900">{stats.scannedPhotosCount}<span className="text-sm font-bold text-gray-400">/{stats.scannedPhotosMax}</span></span>
                    </div>
                </div>
            </div>

            {/* Le bloc vert (Volume global) */}
            <div className="lg:col-start-10 lg:col-span-3 bg-[#1e5138] p-6 rounded-[28px] text-white shadow-md flex flex-col justify-between min-h-[140px] w-full">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-200/70 tracking-wide">Volume global traité</span>
                    <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-full">Ce mois</span>
                </div>
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <span className="text-5xl font-black tracking-tight">{globalVolume}</span>
                        <span className="text-[11px] block text-emerald-100/60 font-semibold mt-1">Documents & sources</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl text-white">
                        <Layers size={22} />
                    </div>
                </div>
            </div>
        </div>
    );
}