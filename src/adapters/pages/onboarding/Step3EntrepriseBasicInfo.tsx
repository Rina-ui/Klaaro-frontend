import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../use_cases/hooks/useAuth'
import PageAnimation from "../../components/ui/PageAnimation.tsx";

export interface EnterprisePayload {
    name: string;
    email: string;
    number: string;
    location: string;
}

export default function Step3EnterpriseInfo() {
    const navigate = useNavigate()
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [form, setForm] = useState<EnterprisePayload>({
        name: '',
        email: '',
        number: '',
        location: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const isValid = form.name && form.email && form.number && form.location

    async function handleContinue() {
        if (!isValid) return
        setIsLoading(true)
        setErrorMessage(null)

        try {
            // VERIFICATION : Utilisation du token du contexte global (avec fallback localStorage au cas où)
            const activeToken = token || localStorage.getItem('klaaro_token');

            if (!activeToken) {
                throw new Error("Session expirée ou utilisateur non authentifié. Veuillez vous reconnecter.");
            }

            // Envoi de la requête au backend avec le header Authorization
            const response = await fetch('http://127.0.0.1:8000/enterprise/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}` // Injection sécurisée du JWT
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    number: `+228${form.number}`, // Format international pour le Togo
                    location: form.location
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Gestion fine des erreurs renvoyées par ton FastAPI
                if (responseData.detail && Array.isArray(responseData.detail)) {
                    const firstError = responseData.detail[0];
                    const fieldName = firstError.loc[firstError.loc.length - 1];
                    throw new Error(`Erreur sur le champ '${fieldName}' : ${firstError.msg}`);
                }
                throw new Error(responseData.detail || "Impossible de configurer l'entreprise.");
            }

            console.log("Entreprise créée avec succès !", responseData);

            // Redirection vers la dernière étape du parcours d'onboarding
            navigate('/onboarding/step4')
        } catch (error: any) {
            setErrorMessage(error.message || "Une erreur est survenue lors de la création.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageAnimation>
            <div className="min-h-screen flex flex-col overflow-x-hidden relative select-none bg-[#e2e4e3]">

                {/* Background Artistique Organique */}
                <div className="absolute top-[-15%] right-[-10%] w-[850px] h-[650px] bg-[#1e5138]/15 rounded-[220px] rotate-[35deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[-15%] w-[800px] h-[600px] bg-[#1e5138]/20 rounded-[160px] rotate-[-20deg] pointer-events-none z-0 mix-blend-multiply" />

                {/* Header */}
                <header className="w-full flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto relative z-10">
                    <span className="text-xl font-black tracking-tight text-[#1e5138]">Klaaro.</span>
                </header>

                {/* Progress Bar */}
                <div className="w-full max-w-xl mx-auto px-10 mt-3 relative z-10">
                    <div className="h-1.5 w-full bg-white/50 backdrop-blur-sm rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#1e5138] transition-all duration-500" style={{ width: '88%' }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-black text-[#1e5138] uppercase tracking-wider">Étape 3.5 sur 4</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Votre Organisation</span>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-6 md:p-10 relative z-10">
                    <section className="w-full max-w-md flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight mb-1">
                                Votre Entreprise
                            </h1>
                            <p className="text-xs font-semibold text-gray-500">
                                Configurez l'espace partagé de votre équipe. Vous en serez l'administrateur.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-xs font-bold p-3.5 rounded-xl text-center shadow-sm max-h-24 overflow-y-auto">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {/* Nom de l'entreprise */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Nom de l'entreprise</label>
                                <input
                                    name="name"
                                    disabled={isLoading}
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Klaaro S.A."
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all disabled:opacity-60"
                                />
                            </div>

                            {/* Email Pro */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Email de l'entreprise</label>
                                <input
                                    name="email"
                                    type="email"
                                    disabled={isLoading}
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="contact@entreprise.com"
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all disabled:opacity-60"
                                />
                            </div>

                            {/* Numéro de téléphone */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Numéro de téléphone de l'entreprise</label>
                                <div className="flex items-center rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md overflow-hidden focus-within:bg-white focus-within:border-[#1e5138] transition-all">
                                    <span className="px-4 py-3 text-xs font-black text-gray-600 bg-white/30 border-r border-white/60">🇹🇬 +228</span>
                                    <input
                                        name="number"
                                        disabled={isLoading}
                                        value={form.number}
                                        onChange={handleChange}
                                        placeholder="90 00 00 00"
                                        className="flex-grow px-4 py-3 text-xs font-bold text-gray-900 outline-none bg-transparent disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* Siège social / Ville */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Siège social / Ville</label>
                                <input
                                    name="location"
                                    disabled={isLoading}
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Ex: Lomé, Togo"
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Bouton de validation */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={!isValid || isLoading}
                                className={`w-full font-bold py-4 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider
                                    ${isValid && !isLoading
                                    ? 'bg-[#1e5138] text-white hover:bg-[#153a28]'
                                    : 'bg-gray-200/60 text-gray-400'
                                }
                                `}
                            >
                                {isLoading ? 'Configuration de l\'espace...' : 'Créer l\'organisation'}
                                {!isLoading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </PageAnimation>
    )
}