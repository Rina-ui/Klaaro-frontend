import { useAuth } from "../../../use_cases/hooks/useAuth.ts"

export default function ProfileCard() {
    const { user } = useAuth()

    // Génération dynamique de l'avatar basé sur son prénom
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstname || 'Klaaro'}`

    return (
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col items-center text-center justify-between shadow-sm">
            <div className="flex flex-col items-center w-full mt-1">
                {/* CORRECTION : Avatar et textes dynamiques */}
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-12 h-12 bg-amber-100 rounded-full border p-0.5 mb-1.5"
                />
                <h3 className="font-bold text-xs">
                    {user?.firstname} {user?.lastname?.toUpperCase()}
                </h3>
                <p className="text-[10px] text-gray-400 truncate w-full max-w-[150px]">
                    {user?.email}
                </p>
                <span className="mt-1.5 text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {user?.role || 'User'}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-1 w-full border-t border-gray-100 pt-2.5 text-center">
                <div><span className="text-[9px] text-gray-400 block">Projets</span><span className="font-bold text-xs">12</span></div>
                <div><span className="text-[9px] text-gray-400 block">Analyses</span><span className="font-bold text-xs">173</span></div>
                <div><span className="text-[9px] text-gray-400 block">Preds</span><span className="font-bold text-xs">820</span></div>
            </div>
        </div>
    )
}