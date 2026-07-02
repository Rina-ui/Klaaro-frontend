import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../components/ui/Sidebar";

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#e2e4e3] flex items-start relative overflow-x-hidden">
            {/* La Sidebar reste fixe et globale */}
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Le contenu de la page active s'affiche ici à droite */}
            <main className={`flex-1 w-full transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-24' : 'md:pl-28'}`}>
                <Outlet />
            </main>
        </div>
    );
}