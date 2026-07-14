import type {StatCard} from "../../../entities/Dashboard.ts";

interface Props {
    stats: StatCard[]
}

export default function TopStatsCards({ stats }: Props) {
    if (stats.length === 0) {
        return (
            <div className="mb-5 bg-white p-3.5 rounded-xl border border-gray-100 text-[11px] text-gray-400 font-semibold">
                Aucune statistique disponible pour le moment.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[75px]">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                    <h3 className="text-lg font-bold mt-0.5">{stat.value}</h3>
                </div>
            ))}
        </div>
    )
}
