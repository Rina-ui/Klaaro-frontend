import type {ActivityItem} from "../../../entities/Dashboard.ts";

interface Props {
    activity: ActivityItem[]
}

export default function RecentActivityCard({ activity }: Props) {
    return (
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col">
            <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400 mb-2 shrink-0">Activité récente</h3>
            <div className="flex-1 overflow-y-auto space-y-2.5 relative before:absolute before:left-2.5 before:top-1 before:bottom-1 before:w-[1px] before:bg-gray-100 pr-0.5">
                {activity.map((act, i) => {
                    const IconComp = act.icon
                    return (
                        <div key={i} className="flex gap-2 relative items-start text-[10px]">
                            <div className={`p-1 rounded-full z-10 shrink-0 ${act.color}`}>
                                <IconComp size={10} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-700 truncate">{act.text}</h4>
                                <p className="text-[9px] text-gray-400 truncate">{act.sub}</p>
                            </div>
                            <span className="text-[8px] text-gray-400 shrink-0">{act.time}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}