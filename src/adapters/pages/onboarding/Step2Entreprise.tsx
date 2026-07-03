import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BusinessSector, CompanySize, HearAboutUs } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import { colors } from "../../../styles/token.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

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
        <PageAnimation>
            // Enveloppe relative et masquage des débordements pour accueillir les vagues artistiques
            <div className="min-h-screen flex flex-col overflow-x-hidden relative select-none bg-[#e2e4e3]">

                {/*background*/}
                <div className="absolute top-[-10%] left-[-15%] w-[850px] h-[650px] bg-[#1e5138]/15 rounded-[200px] rotate-[-8deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[600px] bg-[#1e5138]/20 rounded-[140px] rotate-[15deg] pointer-events-none z-0 mix-blend-multiply" />

                {/* Header */}
                <header className="w-full flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto relative z-10">
                    <span className="text-xl font-black tracking-tight text-[#1e5138]">Klaaro.</span>
                    <button
                        onClick={() => navigate('/welcome')}
                        style={{ color: colors.onSurfaceVariant }}
                        className="hover:text-black transition-colors flex items-center gap-1 text-sm font-bold"
                    >
                        <span className="material-symbols-outlined text-base">close</span>
                        <span className="hidden md:inline">Quitter</span>
                    </button>
                </header>

                {/* Progress Bar */}
                <div className="w-full max-w-xl mx-auto px-10 mt-3 relative z-10">
                    <div className="h-1.5 w-full bg-white/50 backdrop-blur-sm rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500 bg-[#1e5138]" style={{ width: '50%' }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-black text-[#1e5138] uppercase tracking-wider">Étape 2 sur 4</span>
                        <span style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-bold uppercase tracking-wider">Votre entreprise</span>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-6 md:p-10 relative z-10">
                    <section className="w-full max-w-2xl flex flex-col gap-10">

                        {/* Question 1 — Secteur */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col mb-2">
                                <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight mb-1">
                                    Parlez-nous de votre entreprise.
                                </h1>
                                <p className="text-xs font-semibold text-gray-500">
                                    Quel est votre secteur d'activité ?
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {sectors.map(s => {
                                    const isSelected = selectedSector === s.value;
                                    return (
                                        <button
                                            key={s.value}
                                            onClick={() => setSelectedSector(s.value)}
                                            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5
                                            ${isSelected
                                                ? 'bg-white border-[#1e5138] text-[#1e5138] shadow-sm'
                                                : 'bg-white/60 backdrop-blur-md border-transparent text-gray-700 hover:bg-white hover:shadow-sm'
                                            }
                                        `}
                                        >
                                            <span className={`material-symbols-outlined text-2xl transition-colors ${isSelected ? 'text-[#1e5138]' : 'text-gray-400'}`}>{s.icon}</span>
                                            <span className="text-[11px] font-black text-center leading-tight">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Question 2 — Taille */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-sm font-black tracking-tight text-gray-900 uppercase tracking-wider mb-1 pl-1">
                                Combien d'employés ?
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {sizes.map(s => {
                                    const isSelected = selectedSize === s.value;
                                    return (
                                        <button
                                            key={s.value}
                                            onClick={() => setSelectedSize(s.value)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left hover:-translate-y-0.5
                                            ${isSelected
                                                ? 'bg-white border-[#1e5138] shadow-sm'
                                                : 'bg-white/60 backdrop-blur-md border-transparent hover:bg-white hover:shadow-sm'
                                            }
                                        `}
                                        >
                                            <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-[#1e5138]' : 'text-gray-400'}`}>{s.icon}</span>
                                            <span className="font-black text-xs text-gray-800">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Question 3 — Source */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-sm font-black tracking-tight text-gray-900 uppercase tracking-wider mb-1 pl-1">
                                Comment avez-vous entendu parler de Klaaro ?
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {sources.map(s => {
                                    const isSelected = selectedSource === s;
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSource(s)}
                                            className={`px-4 py-2.5 rounded-full border-2 text-xs font-bold transition-all duration-200
                                            ${isSelected
                                                ? 'bg-[#1e5138] border-[#1e5138] text-white shadow-sm'
                                                : 'bg-white/60 backdrop-blur-md border-transparent text-gray-600 hover:bg-white hover:text-black'
                                            }
                                        `}
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-6 mt-2">
                            <button
                                onClick={() => navigate('/onboarding/step1')}
                                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Précédent
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={!isValid}
                                className={`font-bold px-14 py-3.5 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5 text-xs
                                ${isValid
                                    ? 'bg-[#1e5138] text-white hover:bg-[#153a28]'
                                    : 'bg-gray-200/60 text-gray-400'
                                }
                            `}
                            >
                                Continuer
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </PageAnimation>

    )
}