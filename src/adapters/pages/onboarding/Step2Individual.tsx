import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserProfile, DataLevel } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import { colors } from "../../../styles/token.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

const profiles = [
    { value: UserProfile.STUDENT, icon: 'school', label: 'Étudiant' },
    { value: UserProfile.DEVELOPER, icon: 'code', label: 'Développeur' },
    { value: UserProfile.DATA_SCIENTIST, icon: 'analytics', label: 'Data Scientist' },
    { value: UserProfile.FREELANCE, icon: 'laptop_mac', label: 'Freelance' },
    { value: UserProfile.ENTREPRENEUR, icon: 'rocket_launch', label: 'Entrepreneur' },
    { value: UserProfile.OTHER, icon: 'more_horiz', label: 'Autre' },
]

const objectives = [
    'Analyser mes données personnelles',
    'Apprendre la data science',
    'Construire des projets',
    'Gérer mes finances',
    'Prédire des tendances',
    'Autre',
]

const levels = [
    { value: DataLevel.BEGINNER, label: 'Débutant', description: 'Je ne connais rien' },
    { value: DataLevel.INTERMEDIATE, label: 'Intermédiaire', description: 'Je connais les bases' },
    { value: DataLevel.ADVANCED, label: 'Avancé', description: 'Je maîtrise les concepts' },
]

export default function Step2Individual() {
    const navigate = useNavigate()
    const { updateOnboarding } = useOnboarding()
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)
    const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
    const [selectedLevel, setSelectedLevel] = useState<DataLevel | null>(null)

    function toggleObjective(obj: string) {
        setSelectedObjectives(prev =>
            prev.includes(obj) ? prev.filter(o => o !== obj) : [...prev, obj]
        )
    }

    function handleContinue() {
        if (!selectedProfile || !selectedLevel) return
        updateOnboarding({
            profile: selectedProfile,
            objectives: selectedObjectives,
            data_level: selectedLevel
        })
        navigate('/onboarding/step3')
    }

    const isValid = selectedProfile && selectedLevel

    return (
        <PageAnimation>
            <div className="min-h-screen flex flex-col overflow-x-hidden relative select-none bg-[#e2e4e3]">
                {/*background*/}
                <div className="absolute top-[-12%] right-[-15%] w-[850px] h-[650px] bg-[#1e5138]/15 rounded-[220px] rotate-[12deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-18%] left-[-10%] w-[800px] h-[600px] bg-[#1e5138]/20 rounded-[160px] rotate-[-15deg] pointer-events-none z-0 mix-blend-multiply" />

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
                        <span style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-bold uppercase tracking-wider">Votre profil</span>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-6 md:p-10 relative z-10">
                    <section className="w-full max-w-2xl flex flex-col gap-10">

                        {/* Question 1 — Profil */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col mb-1">
                                <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight mb-1">
                                    Qui êtes-vous ?
                                </h1>
                                <p className="text-xs font-semibold text-gray-500">
                                    Choisissez le profil qui vous correspond le mieux.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {profiles.map(p => {
                                    const isSelected = selectedProfile === p.value;
                                    return (
                                        <button
                                            key={p.value}
                                            onClick={() => setSelectedProfile(p.value)}
                                            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5
                                            ${isSelected
                                                ? 'bg-white border-[#1e5138] text-[#1e5138] shadow-sm'
                                                : 'bg-white/60 backdrop-blur-md border-transparent text-gray-700 hover:bg-white hover:shadow-sm'
                                            }
                                        `}
                                        >
                                            <span className={`material-symbols-outlined text-2xl transition-colors ${isSelected ? 'text-[#1e5138]' : 'text-gray-400'}`}>{p.icon}</span>
                                            <span className="text-xs font-black text-center leading-tight">{p.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Question 2 — Objectifs */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col mb-1">
                                <h2 className="text-sm font-black tracking-tight text-gray-900 uppercase tracking-wider mb-1 pl-1">
                                    Que voulez-vous faire avec Klaaro ?
                                </h2>
                                <p className="text-[11px] font-medium text-gray-500 pl-1">
                                    Sélectionnez tout ce qui s'applique.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {objectives.map(obj => {
                                    const isSelected = selectedObjectives.includes(obj);
                                    return (
                                        <button
                                            key={obj}
                                            onClick={() => toggleObjective(obj)}
                                            className={`px-4 py-2.5 rounded-full border-2 text-xs font-bold transition-all duration-200
                                            ${isSelected
                                                ? 'bg-[#1e5138] border-[#1e5138] text-white shadow-sm'
                                                : 'bg-white/60 backdrop-blur-md border-transparent text-gray-600 hover:bg-white hover:text-black'
                                            }
                                        `}
                                        >
                                            {obj}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Question 3 — Niveau */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-sm font-black tracking-tight text-gray-900 uppercase tracking-wider mb-1 pl-1">
                                Quel est votre niveau en data science ?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {levels.map(l => {
                                    const isSelected = selectedLevel === l.value;
                                    return (
                                        <button
                                            key={l.value}
                                            onClick={() => setSelectedLevel(l.value)}
                                            className={`flex flex-col items-start gap-1 p-4 rounded-2xl border-2 transition-all duration-200 text-left hover:-translate-y-0.5
                                            ${isSelected
                                                ? 'bg-white border-[#1e5138] shadow-sm'
                                                : 'bg-white/60 backdrop-blur-md border-transparent hover:bg-white hover:shadow-sm'
                                            }
                                        `}
                                        >
                                            <span className={`font-black text-xs ${isSelected ? 'text-[#1e5138]' : 'text-gray-800'}`}>{l.label}</span>
                                            <span className="text-[11px] text-gray-400 font-medium leading-snug">{l.description}</span>
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