import {
    LayoutDashboard, FileText, BarChart3, Calendar,
    Users, FolderHeart, Settings, LogOut, Menu, ChevronLeft
} from 'lucide-react'

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    return (
        <aside
            onClick={() => isCollapsed && onToggle()}
            className={`
                fixed top-6 left-6 z-50 flex flex-col justify-between items-center bg-white border border-gray-100 shadow-sm
                transition-all duration-500 ease-in-out select-none
                ${isCollapsed
                ? 'w-16 h-16 rounded-full py-0 justify-center hover:bg-gray-50 cursor-pointer'
                : 'w-20 h-[calc(100vh-48px)] rounded-[40px] py-6 cursor-default'
            }
            `}
        >
            {isCollapsed ? (
                <div className="text-gray-800 transition-transform duration-300 transform scale-110">
                    <Menu size={24} />
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center gap-5 w-full">
                        {/* Bouton flèche pour replier proprement la sidebar */}
                        <button
                            onClick={onToggle}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all border border-gray-100 mb-2 shadow-sm active:scale-95 cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button className="p-4 bg-[#1a1a1a] text-white rounded-full shadow-md transition-transform active:scale-95 cursor-pointer">
                            <LayoutDashboard size={20} />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors cursor-pointer"><FileText size={20} /></button>
                        <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors cursor-pointer"><BarChart3 size={20} /></button>
                        <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors cursor-pointer"><Calendar size={20} /></button>
                    </div>

                    {/* SECTION DU BAS : Options + Profil */}
                    <div className="flex flex-col items-center gap-4 w-full">
                        <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors cursor-pointer"><Settings size={20} /></button>
                        <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"><LogOut size={20} /></button>

                        {/* Photo de profil */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm mt-1 cursor-pointer hover:border-gray-400 transition-colors">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </>
            )}
        </aside>
    )
}