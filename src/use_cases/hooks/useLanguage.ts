import { useState } from 'react';
import {type Language, translations} from "../../infrastructure/locales/translations.ts";

export function useLanguage() {
    const [lang, setLang] = useState<Language>('fr');

    const toggleLanguage = () => {
        setLang((prev) => (prev === 'fr' ? 'en' : 'fr'));
    };

    const t = translations[lang];

    return { lang, toggleLanguage, t };
}