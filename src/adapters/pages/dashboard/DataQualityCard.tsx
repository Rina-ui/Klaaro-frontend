// components/dashboard/DataQualityCard.tsx
import { useEffect, useState } from 'react';
import { HttpVulnerabilityRepository, type Vulnerability } from "../../../infrastructure/api/HttpVulnerabilityRepository";
import { useAuth } from "../../../use_cases/hooks/useAuth";
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const vulnRepo = new HttpVulnerabilityRepository();

export default function DataQualityCard() {
    const { user, token } = useAuth();
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id && token) {
            vulnRepo.getVulnerabilitiesByUser(user.id, token)
                .then((data) => setVulnerabilities(data))
                .catch(() => setVulnerabilities([]))
                .finally(() => setLoading(false));
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
        }
    }, [user, token]);

    const criticalCount = vulnerabilities.filter(v => v.niveau === 'critique' || v.niveau === 'eleve').length;

    return (
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 h-[250px] flex flex-col justify-between items-center">
            <h3 className="font-bold text-[11px] uppercase tracking-wide text-gray-400 w-full text-left flex justify-between items-center">
                <span>Sécurité & Vulnérabilités</span>
                {vulnerabilities.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 font-bold rounded text-[9px]">
                        {vulnerabilities.length}
                    </span>
                )}
            </h3>

            {loading ? (
                <div className="animate-pulse text-xs text-gray-400 my-auto">Analyse...</div>
            ) : vulnerabilities.length > 0 ? (
                <div className="w-full flex flex-col items-center my-1 gap-2 overflow-y-auto max-h-[140px] pr-1">
                    {vulnerabilities.map((v, i) => (
                        <div key={i} className="w-full p-2 bg-red-50/60 border border-red-100 rounded-lg text-left">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-[10px] text-red-800 uppercase flex items-center gap-1">
                                    <AlertTriangle size={11} /> {v.type}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                    v.niveau === 'critique' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                                }`}>
                                    {v.niveau}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-tight line-clamp-2">{v.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center my-auto text-center">
                    <ShieldCheck size={32} className="text-emerald-500 mb-1" />
                    <span className="text-xs font-bold text-gray-700">Aucune vulnérabilité</span>
                    <span className="text-[9px] text-gray-400">Vos données sont sécurisées</span>
                </div>
            )}

            <div className="flex gap-3 text-[9px] text-gray-400 font-medium border-t border-gray-50 pt-2 w-full justify-center">
                <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${criticalCount > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {criticalCount > 0 ? `${criticalCount} alerte(s) critique(s)` : 'Système Sain'}
                </div>
            </div>
        </div>
    );
}