import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountType } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import {colors} from "../../../styles/token.ts";

export default function Step1AccountType() {
    const navigate = useNavigate()
    const { updateOnboarding } = useOnboarding()
    const [selected, setSelected] = useState<AccountType | null>(null)

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
        <div style={{ backgroundColor: colors.background }} className="min-h-screen flex flex-col overflow-x-hidden">
            {/* Header */}
            <header className="w-full flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto">
                <span style={{ color: colors.primary }} className="text-2xl font-bold">Klaaro</span>
                <button style={{ color: colors.onSurfaceVariant }} className="hover:opacity-80 transition-opacity flex items-center gap-1 text-lg font-semibold">
                    <span className="material-symbols-outlined">close</span>
                    <span className="hidden md:inline">Quitter</span>
                </button>
            </header>

            {/* Progress Bar */}
            <div className="w-full max-w-xl mx-auto px-10 mt-3">
                <div style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-2 w-full rounded-full overflow-hidden">
                    <div style={{ width: '25%', backgroundColor: colors.primary }} className="h-full rounded-full transition-all duration-500" />
                </div>
                <div className="flex justify-between mt-1">
                    <span style={{ color: colors.primary }} className="text-xs font-bold">Étape 1 sur 4</span>
                    <span style={{ color: colors.onSurfaceVariant }} className="text-xs">Identification</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-10">
                <section className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side */}
                    <div className="flex flex-col gap-6">
                        <div style={{ backgroundColor: colors.primaryFixed, color: colors.onPrimaryFixed }} className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3">
                            <span className="material-symbols-outlined text-3xl">waving_hand</span>
                        </div>
                        <h1 style={{ color: colors.onSurface }} className="text-4xl font-bold leading-tight">
                            Parlez-nous de vous.
                        </h1>
                        <p style={{ color: colors.onSurfaceVariant }} className="text-lg max-w-md">
                            Agissez-vous en tant qu'individu cherchant à optimiser ses revenus ou pour le compte d'une entreprise en pleine croissance ?
                        </p>

                        {/* Decorative Card */}
                        <div style={{ backgroundColor: colors.surfaceContainerLow }} className="relative w-full h-48 mt-10 rounded-xl overflow-hidden hidden lg:block">
                            <div className="absolute bottom-4 left-4 right-4">
                                <div style={{ backgroundColor: colors.surface, boxShadow: '0px 2px 8px rgba(27, 67, 50, 0.08)' }} className="p-3 rounded-lg flex items-center gap-3">
                                    <span style={{ color: colors.primary, fontVariationSettings: "'FILL' 1" }} className="material-symbols-outlined">lightbulb</span>
                                    <span style={{ color: colors.onSurface }} className="text-xs">Cela nous permet de personnaliser vos tableaux de bord.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side — Cards */}
                    <div className="flex flex-col gap-4">

                        {/* Card Individuel */}
                        <button
                            onClick={() => handleSelect(AccountType.INDIVIDUAL)}
                            style={{
                                backgroundColor: selected === AccountType.INDIVIDUAL ? colors.surfaceContainerLow : colors.surface,
                                borderColor: selected === AccountType.INDIVIDUAL ? colors.primary : 'transparent',
                                boxShadow: selected === AccountType.INDIVIDUAL ? '0px 8px 24px rgba(27, 67, 50, 0.12)' : 'none'
                            }}
                            className="flex items-start gap-6 p-6 rounded-xl text-left w-full border-2 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div style={{ backgroundColor: selected === AccountType.INDIVIDUAL ? colors.primaryFixed : colors.surfaceContainer }} className="p-3 rounded-lg transition-colors group-hover:bg-[#D8F3DC]">
                                <span style={{ color: selected === AccountType.INDIVIDUAL ? colors.primary : colors.onSurfaceVariant }} className="material-symbols-outlined text-3xl">person</span>
                            </div>
                            <div className="flex-grow">
                                <h3 style={{ color: colors.onSurface }} className="text-lg font-semibold mb-1">Individuel</h3>
                                <p style={{ color: colors.onSurfaceVariant }} className="text-base">Je suis un entrepreneur solo, consultant ou freelance gérant ses propres finances.</p>
                            </div>
                            <div className="mt-1">
                                <span style={{ color: colors.primary, fontVariationSettings: "'FILL' 1" }}
                                      className={`material-symbols-outlined transition-opacity ${selected === AccountType.INDIVIDUAL ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    check_circle
                                </span>
                            </div>
                        </button>

                        {/* Card Entreprise */}
                        <button
                            onClick={() => handleSelect(AccountType.ENTREPRISE)}
                            style={{
                                backgroundColor: selected === AccountType.ENTREPRISE ? colors.surfaceContainerLow : colors.surface,
                                borderColor: selected === AccountType.ENTREPRISE ? colors.primary : 'transparent',
                                boxShadow: selected === AccountType.ENTREPRISE ? '0px 8px 24px rgba(27, 67, 50, 0.12)' : 'none'
                            }}
                            className="flex items-start gap-6 p-6 rounded-xl text-left w-full border-2 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div style={{ backgroundColor: selected === AccountType.ENTREPRISE ? colors.primaryFixed : colors.surfaceContainer }} className="p-3 rounded-lg transition-colors group-hover:bg-[#D8F3DC]">
                                <span style={{ color: selected === AccountType.ENTREPRISE ? colors.primary : colors.onSurfaceVariant }} className="material-symbols-outlined text-3xl">business</span>
                            </div>
                            <div className="flex-grow">
                                <h3 style={{ color: colors.onSurface }} className="text-lg font-semibold mb-1">Entreprise</h3>
                                <p style={{ color: colors.onSurfaceVariant }} className="text-base">Je représente une PME ou une organisation avec plusieurs collaborateurs et actifs.</p>
                            </div>
                            <div className="mt-1">
                                <span style={{ color: colors.primary, fontVariationSettings: "'FILL' 1" }}
                                      className={`material-symbols-outlined transition-opacity ${selected === AccountType.ENTREPRISE ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    check_circle
                                </span>
                            </div>
                        </button>

                        {/* Navigation */}
                        <div className="mt-10 flex items-center justify-between pt-4">
                            <button style={{ color: colors.onSurfaceVariant }} className="flex items-center gap-1 font-semibold hover:opacity-80 transition-opacity">
                                <span className="material-symbols-outlined">arrow_back</span>
                                Précédent
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={!selected}
                                style={{
                                    backgroundColor: selected ? colors.primary : colors.surfaceContainerHigh,
                                    color: selected ? colors.onPrimary : colors.onSurfaceVariant
                                }}
                                className="font-semibold px-16 py-3 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                            >
                                Continuer
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Background decoration */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] opacity-10 blur-3xl pointer-events-none">
                <div style={{ backgroundColor: colors.primary }} className="w-full h-full rounded-full animate-pulse"/>
            </div>
        </div>
    )
}