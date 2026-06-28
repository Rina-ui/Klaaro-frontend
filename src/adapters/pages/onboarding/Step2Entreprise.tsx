import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BusinessSector, CompanySize, HearAboutUs } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import {colors} from "../../../styles/token.ts";

const sectors = [
    { value: BusinessSector.COMMERCE, icon: 'storefront', label: 'Commerce & Distribution' },
    { value: BusinessSector.RESTAURANT, icon: 'restaurant', label: 'Restauration & Food' },
    { value: BusinessSector.TECH, icon: 'devices', label: 'Technologie' },
    { value: BusinessSector.HEALTH, icon: 'health_and_safety', label: 'Santé' },
    { value: BusinessSector.EDUCATION, icon: 'school', label: 'Éducation' },
    { value: BusinessSector.FINANCE, icon: 'account_balance', label: 'Finance' },
    { value: BusinessSector.AGRICULTURE, icon: 'grass', label: 'Agriculture' },
    { value: BusinessSector.OTHER, icon: 'more_horiz', label: 'Autre' },
]

const sizes = [
    { value: CompanySize.SMALL, icon: 'person', label: '1-5 employés' },
    { value: CompanySize.MEDIUM, icon: 'group', label: '6-20 employés' },
    { value: CompanySize.LARGE, icon: 'groups', label: '21-50 employés' },
    { value: CompanySize.XLARGE, icon: 'corporate_fare', label: '50+ employés' },
]

const sources = [
    HearAboutUs.WORD_OF_MOUTH,
    HearAboutUs.SOCIAL_MEDIA,
    HearAboutUs.GOOGLE,
    HearAboutUs.FRIEND,
    HearAboutUs.WHATSAPP,
    HearAboutUs.OTHER,
]

export default function Step2Entreprise() {
    const navigate = useNavigate()
    const { updateOnboarding } = useOnboarding()
    const [selectedSector, setSelectedSector] = useState<BusinessSector | null>(null)
    const [selectedSize, setSelectedSize] = useState<CompanySize | null>(null)
    const [selectedSource, setSelectedSource] = useState<HearAboutUs | null>(null)

    function handleContinue() {
        if (!selectedSector || !selectedSize) return
        updateOnboarding({
            sector: selectedSector,
            company_size: selectedSize,
            hear_about_us: selectedSource ?? undefined
        })
        navigate('/onboarding/step3')
    }

    const isValid = selectedSector && selectedSize

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
                    <div style={{ width: '50%', backgroundColor: colors.primary }} className="h-full rounded-full transition-all duration-500" />
                </div>
                <div className="flex justify-between mt-1">
                    <span style={{ color: colors.primary }} className="text-xs font-bold">Étape 2 sur 4</span>
                    <span style={{ color: colors.onSurfaceVariant }} className="text-xs">Votre entreprise</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-10">
                <section className="w-full max-w-2xl flex flex-col gap-10">

                    {/* Question 1 — Secteur */}
                    <div className="flex flex-col gap-4">
                        <h1 style={{ color: colors.onSurface }} className="text-3xl font-bold">
                            Parlez-nous de votre entreprise.
                        </h1>
                        <p style={{ color: colors.onSurfaceVariant }} className="text-base">
                            Quel est votre secteur d'activité ?
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {sectors.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setSelectedSector(s.value)}
                                    style={{
                                        backgroundColor: selectedSector === s.value ? colors.primaryFixed : colors.surface,
                                        borderColor: selectedSector === s.value ? colors.primary : colors.outlineVariant,
                                        color: selectedSector === s.value ? colors.primary : colors.onSurface
                                    }}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                                    <span className="text-xs font-semibold text-center">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 2 — Taille */}
                    <div className="flex flex-col gap-4">
                        <h2 style={{ color: colors.onSurface }} className="text-xl font-bold">
                            Combien d'employés ?
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {sizes.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setSelectedSize(s.value)}
                                    style={{
                                        backgroundColor: selectedSize === s.value ? colors.primaryFixed : colors.surface,
                                        borderColor: selectedSize === s.value ? colors.primary : colors.outlineVariant,
                                    }}
                                    className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md"
                                >
                                    <span style={{ color: colors.primary }} className="material-symbols-outlined">{s.icon}</span>
                                    <span style={{ color: colors.onSurface }} className="font-semibold text-sm">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 3 — Source */}
                    <div className="flex flex-col gap-4">
                        <h2 style={{ color: colors.onSurface }} className="text-xl font-bold">
                            Comment avez-vous entendu parler de Klaaro ?
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {sources.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSource(s)}
                                    style={{
                                        backgroundColor: selectedSource === s ? colors.primary : colors.surface,
                                        color: selectedSource === s ? colors.onPrimary : colors.onSurface,
                                        borderColor: selectedSource === s ? colors.primary : colors.outlineVariant
                                    }}
                                    className="px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4">
                        <button
                            onClick={() => navigate('/onboarding/step1')}
                            style={{ color: colors.onSurfaceVariant }}
                            className="flex items-center gap-1 font-semibold hover:opacity-80 transition-opacity"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Précédent
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={!isValid}
                            style={{
                                backgroundColor: isValid ? colors.primary : colors.surfaceContainerHigh,
                                color: isValid ? colors.onPrimary : colors.onSurfaceVariant
                            }}
                            className="font-semibold px-16 py-3 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                        >
                            Continuer
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}