import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountType } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import { colors } from "../../../styles/token.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

export default function Step1AccountType() {
    const navigate = useNavigate()
    // 1. On récupère 'data' du contexte global pour vérifier si un choix a déjà été fait
    const { data, updateOnboarding } = useOnboarding()

    // 2. On initialise le useState avec la valeur existante s'il y en a une !
    const [selected, setSelected] = useState<AccountType | null>(data.account_type || null)

    function handleSelect(type: AccountType) {
        setSelected(type)
    }

    function handleContinue() {
        if (!selected) return
        updateOnboarding({ account_type: selected })
        if (selected === AccountType.INDIVIDUAL) {
            navigate('/onboarding/step2/individual')
        } else {
            navigate('/onboarding/step2/entreprise')
        }
    }

    return (
        <PageAnimation>
            <div className="min-h-screen flex flex-col overflow-x-hidden relative select-none bg-[#e2e4e3]">

                {/*background*/}
                <div className="absolute top-[-15%] right-[-10%] w-[900px] h-[700px] bg-[#1e5138]/15 rounded-[180px] rotate-[-12deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-20%] left-[-12%] w-[850px] h-[600px] bg-[#1e5138]/20 rounded-[140px] rotate-[20deg] pointer-events-none z-0 mix-blend-multiply" />

                {/* Header */}
                <header className="w-full flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto relative z-10">
                    <span className="text-2xl font-black tracking-tight text-[#1e5138]">Klaaro.</span>
                    <button
                        onClick={() => navigate('/welcome')}
                        style={{ color: colors.onSurfaceVariant }}
                        className="hover:text-black transition-colors flex items-center gap-1 text-sm font-bold"
                    >
                        <span className="material-symbols-outlined text-base">close</span>
                        <span>Quitter</span>
                    </button>
                </header>

                {/* Progress Bar */}
                <div className="w-full max-w-xl mx-auto px-10 mt-3 relative z-10">
                    <div className="h-1.5 w-full bg-white/50 backdrop-blur-sm rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500 bg-[#1e5138]" style={{ width: '25%' }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-black text-[#1e5138] uppercase tracking-wider">Étape 1 sur 4</span>
                        <span style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-bold uppercase tracking-wider">Identification</span>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-6 md:p-10 relative z-10">
                    <section className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left Side */}
                        <div className="flex flex-col gap-5">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2 bg-[#1e5138]/10 text-[#1e5138]">
                                <span className="material-symbols-outlined text-2xl font-bold">waving_hand</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">
                                Parlez-nous <br />de vous.
                            </h1>
                            <p style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium max-w-sm leading-relaxed">
                                Agissez-vous en tant qu'individu cherchant à optimiser ses revenus ou pour le compte d'une entreprise en pleine croissance ?
                            </p>

                            <div className="relative w-full h-40 mt-6 rounded-[32px] bg-white/40 backdrop-blur-md border border-white/40 overflow-hidden hidden lg:block">
                                <div className="absolute bottom-5 left-5 right-5">
                                    <div className="p-3.5 bg-white rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
                                        <span className="material-symbols-outlined text-[#1e5138] font-bold">lightbulb</span>
                                        <span className="text-[11px] text-gray-600 font-bold leading-snug">Cela nous permet de configurer et personnaliser vos futurs tableaux de bord.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side — Options de Sélection */}
                        <div className="flex flex-col gap-4">

                            {/* Card Individuel */}
                            <button
                                onClick={() => handleSelect(AccountType.INDIVIDUAL)}
                                className={`flex items-start gap-5 p-6 rounded-[32px] text-left w-full border-2 transition-all duration-300 group hover:-translate-y-0.5
                                ${selected === AccountType.INDIVIDUAL
                                    ? 'bg-white border-[#1e5138] shadow-md'
                                    : 'bg-white/60 backdrop-blur-md border-transparent hover:bg-white hover:shadow-md'
                                }
                            `}
                            >
                                <div className={`p-3.5 rounded-2xl transition-all duration-300 
                                ${selected === AccountType.INDIVIDUAL ? 'bg-[#1e5138] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#1e5138]/10 group-hover:text-[#1e5138]'}
                            `}>
                                    <span className="material-symbols-outlined text-2xl">person</span>
                                </div>
                                <div className="flex-grow pt-1">
                                    <h3 className="text-base font-black text-gray-900 mb-1">Individuel</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Je suis un entrepreneur solo, consultant ou freelance gérant mes propres finances.</p>
                                </div>
                                <div className="mt-2">
                                <span className={`material-symbols-outlined transition-all text-[#1e5138]
                                    ${selected === AccountType.INDIVIDUAL ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-40'}
                                `}>
                                    check_circle
                                </span>
                                </div>
                            </button>

                            {/* Card Entreprise */}
                            <button
                                onClick={() => handleSelect(AccountType.ENTREPRISE)}
                                className={`flex items-start gap-5 p-6 rounded-[32px] text-left w-full border-2 transition-all duration-300 group hover:-translate-y-0.5
                                ${selected === AccountType.ENTREPRISE
                                    ? 'bg-white border-[#1e5138] shadow-md'
                                    : 'bg-white/60 backdrop-blur-md border-transparent hover:bg-white hover:shadow-md'
                                }
                            `}
                            >
                                <div className={`p-3.5 rounded-2xl transition-all duration-300 
                                ${selected === AccountType.ENTREPRISE ? 'bg-[#1e5138] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#1e5138]/10 group-hover:text-[#1e5138]'}
                            `}>
                                    <span className="material-symbols-outlined text-2xl">business</span>
                                </div>
                                <div className="flex-grow pt-1">
                                    <h3 className="text-base font-black text-gray-900 mb-1">Entreprise</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Je représente une PME ou une organisation avec plusieurs collaborateurs et actifs.</p>
                                </div>
                                <div className="mt-2">
                                <span className={`material-symbols-outlined transition-all text-[#1e5138]
                                    ${selected === AccountType.ENTREPRISE ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-40'}
                                `}>
                                    check_circle
                                </span>
                                </div>
                            </button>

                            {/* Actions de Navigation */}
                            <div className="mt-8 flex items-center justify-between pt-4">
                                <button
                                    onClick={() => navigate('/welcome')}
                                    className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Retour
                                </button>
                                <button
                                    onClick={handleContinue}
                                    disabled={!selected}
                                    className={`font-bold px-12 py-3.5 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5 text-xs
                                    ${selected
                                        ? 'bg-[#1e5138] text-white hover:bg-[#153a28]'
                                        : 'bg-gray-200/60 text-gray-400'
                                    }
                                `}
                                >
                                    Continuer
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </PageAnimation>
    )
}