import { ChevronDown } from 'lucide-react'

export default function PredictionChart() {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 lg:col-span-2 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Évolution des prédictions</h3>
                <button className="text-[10px] border border-gray-100 px-2 py-0.5 rounded bg-white"><ChevronDown size={10} /></button>
            </div>
            <div className="h-28 w-full flex items-end relative">
                <svg className="w-full h-full stroke-emerald-600 fill-emerald-50/10" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 Q15,15 25,22 T50,12 T75,18 T100,5 L100,30 L0,30 Z" strokeWidth="0.5" />
                    <path d="M0,25 Q15,15 25,22 T50,12 T75,18 T100,5" strokeWidth="1" fill="none" />
                </svg>
            </div>
        </div>
    )
}