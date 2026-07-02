import React from 'react';
import { Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function NavigationTabs(): React.JSX.Element {
    // Style de base pour tous les boutons
    const baseStyle = "px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer";

    // Fonction pour appliquer dynamiquement la couleur selon la page active
    const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? `${baseStyle} bg-[#1e5138] text-white shadow-sm`
            : `${baseStyle} text-gray-600 hover:text-gray-900`;

    return (
        <div className="flex justify-between items-center mb-8 w-full">
            <div className="bg-[#f1f3f2] border border-gray-200/40 px-4 py-2 rounded-2xl text-xs font-semibold text-gray-600 flex items-center gap-2 shadow-sm">
                <Calendar size={14} className="text-[#1e5138]" />
                <span>Jan 6</span>
            </div>

            <div className="flex items-center gap-1 bg-[#f1f3f2] border border-gray-200/40 p-1 rounded-full shadow-sm">
                <NavLink to="/dashboard" className={getLinkStyle}>
                    Dashboard
                </NavLink>
                <NavLink to="/upload" className={getLinkStyle}>
                    Uploads
                </NavLink>
                <NavLink to="/prediction" className={getLinkStyle}>
                    Previsions
                </NavLink>
            </div>
        </div>
    );
}