import React from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface UploadActionCardProps {
    title: string;
    description: string;
    buttonText: string;
    icon: LucideIcon;
    onClick: () => void;
    isLarge?: boolean; // Utile pour que la carte fichier prenne 2 colonnes
}

export default function UploadActionCard({ title, description, buttonText, icon: Icon, onClick, isLarge = false }: UploadActionCardProps): React.JSX.Element {
    return (
        <div className={`bg-[#f1f3f2] p-6 rounded-[32px] border border-gray-200/20 flex flex-col justify-between min-h-[220px] shadow-sm group hover:border-emerald-200/50 transition-all ${isLarge ? 'lg:col-span-2' : ''}`}>
            <div>
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#1e5138]" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 tracking-wide">{title}</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-lg leading-relaxed font-medium">
                    {description}
                </p>
            </div>
            <button onClick={onClick} className="flex items-center gap-2 text-xs font-bold text-[#1e5138] w-max mt-4 group cursor-pointer">
                {buttonText}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
        </div>
    );
}