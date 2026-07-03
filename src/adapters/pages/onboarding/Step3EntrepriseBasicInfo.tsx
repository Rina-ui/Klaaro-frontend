import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {createEnterprise, type EnterprisePayload} from "../../../infrastructure/api/authApi.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

export default function Step3EnterpriseInfo() {
    const navigate = useNavigate()
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
            // On appelle ton API avec le token JWT déjà présent dans le localStorage
            await createEnterprise(form)

            // Tout est bon ! L'organisation est créée, on l'envoie sur l'écran de bienvenue final
            navigate('/onboarding/step4')
        } catch (error: unknown) {
            // @ts-ignore
            setErrorMessage(error.message || "Impossible de configurer l'entreprise.")
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

                {/* Progress Bar (Étape intermédiaire avant la fin) */}
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
                            <div className="bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-xs font-bold p-3.5 rounded-xl">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {/* Nom de l'entreprise */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Nom de l'entreprise</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Klaaro S.A."
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all"
                                />
                            </div>

                            {/* Email Pro */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Email de l'entreprise</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="contact@entreprise.com"
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all"
                                />
                            </div>

                            {/* Numéro IFU / Registre */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Numéro d'identification (IFU / RCCM)</label>
                                <input
                                    name="number"
                                    value={form.number}
                                    onChange={handleChange}
                                    placeholder="Ex: 123456789"
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all"
                                />
                            </div>

                            {/* Siège social / Localisation */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Siège social / Ville</label>
                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Ex: Lomé, Togo"
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all"
                                />
                            </div>
                        </div>

                        {/* Bouton de Soumission */}
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
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </PageAnimation>
    )
}