import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserProfile, DataLevel } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import {colors} from "../../../styles/token.ts";


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
                    <span style={{ color: colors.onSurfaceVariant }} className="text-xs">Votre profil</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-10">
                <section className="w-full max-w-2xl flex flex-col gap-10">

                    {/* Question 1 — Profil */}
                    <div className="flex flex-col gap-4">
                        <h1 style={{ color: colors.onSurface }} className="text-3xl font-bold">
                            Qui êtes-vous ?
                        </h1>
                        <p style={{ color: colors.onSurfaceVariant }} className="text-base">
                            Choisissez le profil qui vous correspond le mieux.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {profiles.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => setSelectedProfile(p.value)}
                                    style={{
                                        backgroundColor: selectedProfile === p.value ? colors.primaryFixed : colors.surface,
                                        borderColor: selectedProfile === p.value ? colors.primary : colors.outlineVariant,
                                        color: selectedProfile === p.value ? colors.primary : colors.onSurface
                                    }}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <span className="material-symbols-outlined text-3xl">{p.icon}</span>
                                    <span className="text-sm font-semibold">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 2 — Objectifs */}
                    <div className="flex flex-col gap-4">
                        <h2 style={{ color: colors.onSurface }} className="text-xl font-bold">
                            Que voulez-vous faire avec Klaaro ?
                        </h2>
                        <p style={{ color: colors.onSurfaceVariant }} className="text-sm">
                            Sélectionnez tout ce qui s'applique.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {objectives.map(obj => (
                                <button
                                    key={obj}
                                    onClick={() => toggleObjective(obj)}
                                    style={{
                                        backgroundColor: selectedObjectives.includes(obj) ? colors.primary : colors.surface,
                                        color: selectedObjectives.includes(obj) ? colors.onPrimary : colors.onSurface,
                                        borderColor: selectedObjectives.includes(obj) ? colors.primary : colors.outlineVariant
                                    }}
                                    className="px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200"
                                >
                                    {obj}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 3 — Niveau */}
                    <div className="flex flex-col gap-4">
                        <h2 style={{ color: colors.onSurface }} className="text-xl font-bold">
                            Quel est votre niveau en data science ?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {levels.map(l => (
                                <button
                                    key={l.value}
                                    onClick={() => setSelectedLevel(l.value)}
                                    style={{
                                        backgroundColor: selectedLevel === l.value ? colors.primaryFixed : colors.surface,
                                        borderColor: selectedLevel === l.value ? colors.primary : colors.outlineVariant,
                                    }}
                                    className="flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md"
                                >
                                    <span style={{ color: colors.primary }} className="font-bold text-base">{l.label}</span>
                                    <span style={{ color: colors.onSurfaceVariant }} className="text-sm">{l.description}</span>
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