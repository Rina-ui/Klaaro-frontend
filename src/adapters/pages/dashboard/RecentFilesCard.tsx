import { MoreVertical } from 'lucide-react'
import type {FileItem} from "../../../entities/Dashboard.ts";

interface Props {
    files: FileItem[]
}

export default function RecentFilesCard({ files }: Props) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col h-[250px]">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400">Fichiers récents</h3>
                <a href="#" className="text-[10px] text-gray-400 hover:underline">Voir tout</a>
            </div>
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-1 scrollbar-thin">
                {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/60 px-2 rounded transition-colors">
                        <div className="min-w-0">
                            <h4 className="text-[11px] font-semibold text-gray-800 truncate max-w-[170px]">{file.name}</h4>
                            <p className="text-[9px] text-gray-400 mt-0.5">{file.size}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    )
}