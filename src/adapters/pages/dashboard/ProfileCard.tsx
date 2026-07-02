export default function ProfileCard() {
    return (
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col items-center text-center justify-between">
            <div className="flex flex-col items-center w-full mt-1">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marina" alt="Avatar" className="w-12 h-12 bg-amber-100 rounded-full border p-0.5 mb-1.5" />
                <h3 className="font-bold text-xs">Marina K.</h3>
                <p className="text-[10px] text-gray-400">marina@gmail.com</p>
                <span className="mt-1.5 text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Premium</span>
            </div>
            <div className="grid grid-cols-3 gap-1 w-full border-t border-gray-100 pt-2.5 text-center">
                <div><span className="text-[9px] text-gray-400 block">Projets</span><span className="font-bold text-xs">12</span></div>
                <div><span className="text-[9px] text-gray-400 block">Analyses</span><span className="font-bold text-xs">173</span></div>
                <div><span className="text-[9px] text-gray-400 block">Preds</span><span className="font-bold text-xs">820</span></div>
            </div>
        </div>
    )
}