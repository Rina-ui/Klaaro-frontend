import React, { createContext, useContext, useState, useEffect } from 'react';
import {type Language, translations} from "../../infrastructure/locales/translations.ts";

interface AppContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    lang: Language;
    toggleLanguage: () => void;
    t: typeof translations['fr'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [lang, setLang] = useState<Language>('fr');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLanguage = () => setLang(prev => prev === 'fr' ? 'en' : 'fr');
    const t = translations[lang];

    return (
        <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLanguage, t }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp doit être utilisé dans un AppProvider");
    return context;
}