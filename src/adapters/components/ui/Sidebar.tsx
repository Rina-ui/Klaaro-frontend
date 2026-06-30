import {colors} from "../../../styles/token.ts";

const menuItems = [
    { icon: 'space_dashboard', label: 'Dashboard', active: true },
    { icon: 'database', label: 'Mes données' },
    { icon: 'forum', label: 'Analyses' },
    { icon: 'trending_up', label: 'Prédictions' },
    { icon: 'shield', label: 'Sécurité' },
    { icon: 'notifications', label: 'Alertes' },
    { icon: 'settings', label: 'Paramètres' },
]

export default function Sidebar() {
    return (
        <aside style={{ backgroundColor: colors.surface }} className="w-24 min-h-screen flex flex-col items-center py-8 gap-10">
            {/* Logo */}
            <div style={{ backgroundColor: colors.primary }} className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">K</span>
            </div>

            {/* Menu */}
            <nav className="flex flex-col gap-3 flex-grow">
                {menuItems.map(item => (
                    <button
                        key={item.label}
                        title={item.label}
                        style={{
                            backgroundColor: item.active ? colors.primary : 'transparent',
                            color: item.active ? 'white' : colors.onSurfaceVariant
                        }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:bg-[#EDF4F0]"
                    >
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </button>
                ))}
            </nav>

            {/* Avatar bottom */}
            <button style={{ backgroundColor: colors.surfaceContainer }} className="w-11 h-11 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl" style={{ color: colors.onSurfaceVariant }}>person</span>
            </button>
        </aside>
    )
}
