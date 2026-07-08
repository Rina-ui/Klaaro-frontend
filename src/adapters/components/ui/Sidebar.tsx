import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, FileText, BarChart3, Settings, LogOut, Menu, ChevronLeft
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
                transition-all duration-500 ease-in-out select-none overflow-hidden
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
                    {/* SECTION DU HAUT : Redirection au clic sur les icônes */}
                    <div className="flex flex-col items-center gap-4 w-full relative z-10">
                        <button
                            onClick={onToggle}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all border border-gray-100 mb-2 shadow-sm active:scale-95 cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `p-3 rounded-full transition-colors cursor-pointer ${isActive ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <LayoutDashboard size={20} />
                        </NavLink>

                        <NavLink
                            to="/upload"
                            className={({ isActive }) => `p-3 rounded-full transition-colors cursor-pointer ${isActive ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <FileText size={20} />
                        </NavLink>

                        <NavLink
                            to="/prediction"
                            className={({ isActive }) => `p-3 rounded-full transition-colors cursor-pointer ${isActive ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <BarChart3 size={20} />
                        </NavLink>

                    </div>

                    <div className="flex flex-col items-center gap-4 w-full mt-auto pt-8 relative">

                        <div className="absolute bottom-[-20px] left-[-30px] w-40 h-48 bg-[#1e5138]/25 rounded-[50px] rotate-[12deg] pointer-events-none z-0 mix-blend-multiply" />

                        <NavLink
                            to="/setting"
                            className={({ isActive }) => `relative z-10 p-3 rounded-full transition-colors cursor-pointer ${
                                isActive ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-400 hover:text-black hover:bg-gray-50/80 backdrop-blur-sm'
                            }`}
                        >
                            <Settings size={20} />
                        </NavLink>

                        <button className="relative z-10 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer">
                            <LogOut size={20} />
                        </button>

                        <div className="relative z-10 w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm mt-1">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </>
            )}
        </aside>
    )
}