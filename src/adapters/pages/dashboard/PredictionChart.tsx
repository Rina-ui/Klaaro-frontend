import { ChevronDown } from 'lucide-react'

interface Props {
    data: { date: string; count: number }[]
}

export default function PredictionChart({ data }: Props) {
    const max = Math.max(...data.map(d => d.count), 1);
    const hasActivity = data.some(d => d.count > 0);

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 lg:col-span-2 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Volume de fichiers (7 jours)</h3>
                <button className="text-[10px] border border-gray-100 px-2 py-0.5 rounded bg-white"><ChevronDown size={10} /></button>
            </div>
            <div className="h-28 w-full flex items-end gap-2 mt-2">
                {hasActivity ? (
                    data.map((d) => (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div
                                className="w-full bg-[#1e5138] rounded-t transition-all"
                                style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 1 }}
                            />
                            <span className="text-[8px] text-gray-400">
                                {new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium">
                        Aucun fichier importé cette semaine
                    </div>
                )}
            </div>
        </div>
    )
}
