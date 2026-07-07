import { MoreVertical, FileText, Loader2 } from 'lucide-react'
import { useGetRecentDocuments } from '../../../use_cases/hooks/useGetRecentDocuments.ts'

export default function RecentFilesCard() {
    const { files, loading, error } = useGetRecentDocuments();

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col h-[250px] shadow-sm">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400">Fichiers récents</h3>
                <a href="/documents" className="text-[10px] text-gray-400 hover:underline">Voir tout</a>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Loader2 size={18} className="animate-spin text-[#1e5138]" />
                    <span className="text-[10px] font-semibold">Chargement des fichiers...</span>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="flex-1 flex items-center justify-center text-center p-2">
                    <span className="text-[10px] font-semibold text-red-500 bg-red-50 p-2 rounded-xl">
                        {error}
                    </span>
                </div>
            )}

            {/* Documents List */}
            {!loading && !error && (
                <div className="flex-1 overflow-y-auto pr-0.5 space-y-1 scrollbar-thin">
                    {files.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                            <FileText size={20} className="opacity-40" />
                            <span className="text-[10px] font-medium">Aucun document déposé</span>
                        </div>
                    ) : (
                        files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/60 px-2 rounded transition-colors">
                                <div className="min-w-0 flex items-center gap-2">
                                    <FileText size={14} className="text-gray-400 shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="text-[11px] font-semibold text-gray-800 truncate max-w-[150px]" title={file.name}>
                                            {file.name}
                                        </h4>
                                        <p className="text-[9px] text-gray-400">
                                            {file.size}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}