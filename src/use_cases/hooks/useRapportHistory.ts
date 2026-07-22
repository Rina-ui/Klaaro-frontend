import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth.ts';
import { HttpRapportRepository } from '../../infrastructure/api/HttpRapportRepository.ts';
import type { RapportEntity, RapportType } from '../../entities/Report.ts';

const rapportRepo = new HttpRapportRepository();

// Ré-export du type pour l'utiliser proprement dans d'autres composants
export type { RapportEntity, RapportType };

export function useRapportHistory(type: RapportType) {
    const { token, user } = useAuth();
    const [history, setHistory] = useState<RapportEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const refresh = useCallback(async () => {
        if (!token || !user?.id) return;
        setLoading(true);
        try {
            const all: RapportEntity[] = await rapportRepo.getRapportsByUser(token, user.id);
            const filtered = all
                .filter((r: RapportEntity) => r.type === type)
                .sort((a: RapportEntity, b: RapportEntity) =>
                    new Date(b.date_generation).getTime() - new Date(a.date_generation).getTime()
                );
            setHistory(filtered);
        } catch (err) {
            console.error(`Impossible de charger l'historique (${type}) :`, err);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id, type]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { history, loading, refresh };
}