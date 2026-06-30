import { LayoutGrid, Database, MessageSquare, TrendingUp, ShieldCheck, Settings } from 'lucide-react'
import {colors} from "../../../styles/token.ts";

const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', active: true },
    { icon: Database, label: 'Mes données' },
    { icon: MessageSquare, label: 'Analyses' },
    { icon: TrendingUp, label: 'Prédictions' },
    { icon: ShieldCheck, label: 'Sécurité' },
]

export default function Sidebar() {
    return (
        <aside style={{ backgroundColor: colors.surfaceContainer }} className="rounded-2xl py-2.5 px-1.5 flex flex-col items-center gap-3.5 w-11 shrink-0">
            <div style={{ backgroundColor: colors.primary }} className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-white text-xs font-medium">
                K
            </div>

            <nav className="flex flex-col gap-3.5 items-center">
                {menuItems.map(item => {
                    const Icon = item.icon
                    return (
                        <button key={item.label} title={item.label} style={{ color: item.active ? colors.primary : colors.onSurfaceVariant }}>
                            <Icon className="h-4 w-4" />
                        </button>
                    )
                })}
            </nav>

            <div className="flex-1" />

            <Settings className="h-4 w-4" style={{ color: colors.onSurfaceVariant }} />
        </aside>
    )
}