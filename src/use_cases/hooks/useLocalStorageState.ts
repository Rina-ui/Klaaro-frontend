import { useState, useEffect } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored !== null ? (JSON.parse(stored) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            if (state === null || state === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (err) {
            console.error(`Impossible de sauvegarder "${key}" dans localStorage`, err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, state]);

    return [state, setState] as const;
}
