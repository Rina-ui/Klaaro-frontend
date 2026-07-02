import React from 'react';
import { Calendar } from 'lucide-react';

export default function NavigationTabs(): React.JSX.Element {
    return (
        <div className="flex justify-between items-center mb-8 w-full">
            <div className="bg-[#f1f3f2] border border-gray-200/40 px-4 py-2 rounded-2xl text-xs font-semibold text-gray-600 flex items-center gap-2 shadow-sm">
                <Calendar size={14} className="text-[#1e5138]" />
                <span>Jan 6</span>
            </div>

            <div className="flex items-center gap-1 bg-[#f1f3f2] border border-gray-200/40 p-1 rounded-full text-xs font-semibold text-gray-400 shadow-sm">
                <button className="px-5 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Dashboard</button>
                <button className="px-5 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Uploads</button>
                <button className="bg-[#1e5138] text-white px-5 py-2 rounded-full shadow-sm cursor-pointer">Predictions</button>
            </div>
        </div>
    );
}