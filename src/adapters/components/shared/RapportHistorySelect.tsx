import React from 'react';
import { History } from 'lucide-react';
import type { RapportEntity } from '../../../entities/Report.ts';
import { formatRelativeDate } from '../../../use_cases/utils/formatRelativeDate.ts';

interface Props {
    history: RapportEntity[];
    loading: boolean;
    onSelect: (rapport: RapportEntity) => void;
    label?: string;
}

export default function RapportHistorySelect({ history, loading, onSelect, label = "Revoir un résultat précédent..." }: Props): React.JSX.Element | null {
    if (loading || history.length === 0) return null;

    return (
        <div className="flex items-center gap-2 mb-4">
            <History className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
                onChange={(e) => {
                    const selected = history.find((h) => h.id === e.target.value);
                    if (selected) onSelect(selected);
                }}
                defaultValue=""
                className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1e5138] max-w-[260px]"
            >
                <option value="" disabled>{label}</option>
                {history.map((r) => (
                    <option key={r.id} value={r.id}>{formatRelativeDate(r.date_generation)}</option>
                ))}
            </select>
        </div>
    );
}