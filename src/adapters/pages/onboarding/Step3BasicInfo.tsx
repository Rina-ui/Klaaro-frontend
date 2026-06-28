import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import {colors} from "../../../styles/token.ts";

export default function Step3BasicInfo() {
    const navigate = useNavigate()
    const { data, updateOnboarding } = useOnboarding()
    const [form, setForm] = useState({
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function getPasswordStrength() {
        const p = form.password
        if (p.length === 0) return 0
        if (p.length < 6) return 1
        if (p.length < 10) return 2
        return 3
    }

    const strengthColors = ['transparent', colors.error, colors.warning, colors.accent]
    const strengthLabels = ['', 'Faible', 'Moyen', 'Fort']
    const strength = getPasswordStrength()

    const isValid = form.firstname && form.lastname && form.email && form.password && form.password === form.confirmPassword

    function handleContinue() {
        if (!isValid) return
        updateOnboarding({
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            password: form.password
        })
        navigate('/onboarding/step4')
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
                    <div style={{ width: '75%', backgroundColor: colors.primary }} className="h-full rounded-full transition-all duration-500" />
                </div>
                <div className="flex justify-between mt-1">
                    <span style={{ color: colors.primary }} className="text-xs font-bold">Étape 3 sur 4</span>
                    <span style={{ color: colors.onSurfaceVariant }} className="text-xs">Vos informations</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-10">
                <section className="w-full max-w-md flex flex-col gap-8">
                    <div>
                        <h1 style={{ color: colors.onSurface }} className="text-3xl font-bold mb-2">
                            Presque terminé !
                        </h1>
                        <p style={{ color: colors.onSurfaceVariant }} className="text-base">
                            Créez votre compte pour accéder à Klaaro.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Nom et Prénom */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Prénom</label>
                                <input
                                    name="firstname"
                                    value={form.firstname}
                                    onChange={handleChange}
                                    placeholder="Koffi"
                                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface, color: colors.onSurface }}
                                    className="px-4 py-3 rounded-lg border-2 text-base outline-none focus:border-[#2D6A4F] transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Nom</label>
                                <input
                                    name="lastname"
                                    value={form.lastname}
                                    onChange={handleChange}
                                    placeholder="Mensah"
                                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface, color: colors.onSurface }}
                                    className="px-4 py-3 rounded-lg border-2 text-base outline-none focus:border-[#2D6A4F] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="koffi@example.com"
                                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface, color: colors.onSurface }}
                                className="px-4 py-3 rounded-lg border-2 text-base outline-none focus:border-[#2D6A4F] transition-colors"
                            />
                        </div>

                        {/* Téléphone */}
                        <div className="flex flex-col gap-1">
                            <label style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Téléphone (optionnel)</label>
                            <div style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }} className="flex items-center rounded-lg border-2 focus-within:border-[#2D6A4F] transition-colors">
                                <span style={{ color: colors.onSurfaceVariant }} className="px-3 text-sm font-medium border-r border-[#B7CFBF]">🇹🇬 +228</span>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="90 00 00 00"
                                    style={{ color: colors.onSurface }}
                                    className="flex-grow px-4 py-3 text-base outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="flex flex-col gap-1">
                            <label style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Mot de passe</label>
                            <div style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }} className="flex items-center rounded-lg border-2 focus-within:border-[#2D6A4F] transition-colors">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{ color: colors.onSurface }}
                                    className="flex-grow px-4 py-3 text-base outline-none bg-transparent"
                                />
                                <button onClick={() => setShowPassword(!showPassword)} style={{ color: colors.onSurfaceVariant }} className="px-3">
                                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {/* Indicateur de force */}
                            {form.password.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ backgroundColor: i <= strength ? strengthColors[strength] : colors.surfaceContainerHighest }} className="h-1 flex-1 rounded-full transition-all" />
                                    ))}
                                    <span style={{ color: strengthColors[strength] }} className="text-xs font-medium ml-2">{strengthLabels[strength]}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirmer mot de passe */}
                        <div className="flex flex-col gap-1">
                            <label style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Confirmer le mot de passe</label>
                            <div style={{ borderColor: form.confirmPassword && form.password !== form.confirmPassword ? colors.error : colors.outlineVariant, backgroundColor: colors.surface }} className="flex items-center rounded-lg border-2 focus-within:border-[#2D6A4F] transition-colors">
                                <input
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{ color: colors.onSurface }}
                                    className="flex-grow px-4 py-3 text-base outline-none bg-transparent"
                                />
                                <button onClick={() => setShowConfirm(!showConfirm)} style={{ color: colors.onSurfaceVariant }} className="px-3">
                                    <span className="material-symbols-outlined text-xl">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                                <span style={{ color: colors.error }} className="text-xs">Les mots de passe ne correspondent pas</span>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            onClick={() => navigate(-1)}
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
                            Créer mon compte
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}