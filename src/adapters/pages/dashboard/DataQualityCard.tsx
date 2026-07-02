export default function DataQualityCard() {
    return (
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col justify-between items-center">
            <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400 w-full text-left">Qualité des données</h3>
            <div className="relative w-20 h-20 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" strokeWidth="3.5" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeWidth="3.5" strokeDasharray="92, 100" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                    <span className="text-base font-bold block leading-none">92%</span>
                    <span className="text-[8px] text-gray-400 mt-0.5 block">Très bonne</span>
                </div>
            </div>
            <div className="flex gap-3 text-[9px] text-gray-400 font-medium border-t border-gray-50 pt-2 w-full justify-center">
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Complètes</div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Manquantes</div>
            </div>
        </div>
    )
}