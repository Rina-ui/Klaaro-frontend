import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth.ts';
import { HttpRapportRepository } from '../../infrastructure/api/HttpRapportRepository.ts';
import type { RapportEntity, RapportType } from '../../entities/Report.ts';

const rapportRepo = new HttpRapportRepository();

// Liste l'historique des rapports d'un type donné (preprocessing ou prediction)
// pour un utilisateur, du plus récent au plus ancien.
export function useRapportHistory(type: RapportType) {
    const { token, user } = useAuth();
    const [history, setHistory] = useState<RapportEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const refresh = useCallback(async () => {
        if (!token || !user?.id) return;
        setLoading(true);
        try {
            const all = await rapportRepo.getRapportsByUser(token, user.id);
            const filtered = all
                .filter((r) => r.type === type)
                .sort((a, b) => new Date(b.date_generation).getTime() - new Date(a.date_generation).getTime());
            setHistory(filtered);
        } catch (err) {
            console.error(`Impossible de charger l'historique (${type}) :`, err);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id, type]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { history, loading, refresh };
}