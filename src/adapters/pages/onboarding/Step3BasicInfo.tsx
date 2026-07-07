import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountType } from '../../../entities/Onboarding'
import { useOnboarding } from '../../../use_cases/hooks/useOnboarding'
import { colors } from "../../../styles/token.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

export default function Step3BasicInfo() {
    const navigate = useNavigate()
    const { data, updateOnboarding } = useOnboarding()

    // États locaux
    const [form, setForm] = useState({
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    // Sécurité : On initialise avec ce qu'il y a dans le contexte, ou INDIVIDUAL par défaut
    const [accountType, setAccountType] = useState<AccountType>(data.account_type || AccountType.INDIVIDUAL)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    const strengthColors = ['transparent', '#e63946', '#ffb703', '#1e5138']
    const strengthLabels = ['', 'Faible', 'Moyen', 'Fort']
    const strength = getPasswordStrength()

    const isValid = form.firstname && form.lastname && form.email && form.password && form.password === form.confirmPassword && !loading

    async function handleContinue() {
        if (!isValid) return
        setLoading(true)
        setError(null)

        // Détermination de la profession selon le choix actuel sur la page
        const computedProfession = accountType === AccountType.ENTREPRISE
            ? "Gérant / Chef d'entreprise"
            : "Freelance / Particulier";

        try {
            // Appel API direct vers l'endpoint d'inscription FastAPI
            const response = await fetch('http://127.0.0.1:8000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: form.firstname,
                    lastname: form.lastname,
                    email: form.email,
                    password: form.password,
                    phone: form.phone || null,
                    profession: computedProfession,
                    account_type: accountType.toLowerCase(),
                    role: "user"
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.detail && Array.isArray(responseData.detail)) {
                    const firstError = responseData.detail[0];
                    const fieldName = firstError.loc[firstError.loc.length - 1];
                    throw new Error(`Erreur sur le champ '${fieldName}' : ${firstError.msg}`);
                }
                throw new Error(responseData.detail || "Une erreur est survenue lors de l'inscription.");
            }

            console.log("Utilisateur créé avec succès !", responseData);

            // Mise à jour finale du contexte
            updateOnboarding({
                firstname: form.firstname,
                lastname: form.lastname,
                email: form.email,
                password: form.password,
                profession: computedProfession,
                account_type: accountType
            })

            if (accountType === AccountType.ENTREPRISE) {
                navigate('/onboarding/step3.1')
            } else {
                navigate('/onboarding/step4')
            }

        } catch (err: any) {
            setError(err.message || "Impossible de contacter le serveur Klaaro.");
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageAnimation>
            <div className="min-h-screen flex flex-col overflow-x-hidden relative select-none bg-[#e2e4e3]">
                {/* Background */}
                <div className="absolute top-[-20%] left-[-15%] w-[900px] h-[750px] bg-[#1e5138]/15 rounded-[240px] rotate-[-15deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-10%] right-[-12%] w-[800px] h-[600px] bg-[#1e5138]/20 rounded-[180px] rotate-[10deg] pointer-events-none z-0 mix-blend-multiply" />

                {/* Header */}
                <header className="w-full flex items-center justify-between px-10 py-6 max-w-[1280px] mx-auto relative z-10">
                    <span className="text-xl font-black tracking-tight text-[#1e5138]">Klaaro.</span>
                    <button
                        type="button"
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
                        <div className="h-full rounded-full transition-all duration-500 bg-[#1e5138]" style={{ width: '75%' }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-black text-[#1e5138] uppercase tracking-wider">Étape 3 sur 4</span>
                        <span style={{ color: colors.onSurfaceVariant }} className="text-[10px] font-bold uppercase tracking-wider">Vos informations</span>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-6 md:p-10 relative z-10">
                    <section className="w-full max-w-md flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight mb-1">
                                Presque terminé !
                            </h1>
                            <p className="text-xs font-semibold text-gray-500">
                                Créez votre compte personnel pour accéder à Klaaro.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-2xl text-center shadow-sm max-h-24 overflow-y-auto">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {/* Type de compte (Sélecteur de secours pour le Back) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Type de compte</label>
                                <div className="grid grid-cols-2 gap-2 bg-white/40 backdrop-blur-md p-1 rounded-2xl border border-white/40">
                                    <button
                                        type="button"
                                        onClick={() => setAccountType(AccountType.INDIVIDUAL)}
                                        className={`py-2 rounded-xl text-xs font-black transition-all ${accountType === AccountType.INDIVIDUAL ? 'bg-[#1e5138] text-white shadow-sm' : 'text-gray-600 hover:bg-white/40'}`}
                                    >
                                        Individuel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccountType(AccountType.ENTREPRISE)}
                                        className={`py-2 rounded-xl text-xs font-black transition-all ${accountType === AccountType.ENTREPRISE ? 'bg-[#1e5138] text-white shadow-sm' : 'text-gray-600 hover:bg-white/40'}`}
                                    >
                                        Entreprise
                                    </button>
                                </div>
                            </div>

                            {/* Prénom & Nom */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Prénom</label>
                                    <input
                                        name="firstname"
                                        disabled={loading}
                                        value={form.firstname}
                                        onChange={handleChange}
                                        placeholder="Koffi"
                                        className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all disabled:opacity-60"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Nom</label>
                                    <input
                                        name="lastname"
                                        disabled={loading}
                                        value={form.lastname}
                                        onChange={handleChange}
                                        placeholder="Mensah"
                                        className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    disabled={loading}
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="koffi@example.com"
                                    className="px-4 py-3 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#1e5138] transition-all disabled:opacity-60"
                                />
                            </div>

                            {/* Téléphone */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Téléphone <span className="text-[10px] text-gray-400 lowercase">(optionnel)</span></label>
                                <div className="flex items-center rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md overflow-hidden focus-within:bg-white focus-within:border-[#1e5138] transition-all">
                                    <span className="px-4 py-3 text-xs font-black text-gray-600 bg-white/30 border-r border-white/60">🇹🇬 +228</span>
                                    <input
                                        name="phone"
                                        disabled={loading}
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="90 00 00 00"
                                        className="flex-grow px-4 py-3 text-xs font-bold text-gray-900 outline-none bg-transparent disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Mot de passe</label>
                                <div className="flex items-center rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md overflow-hidden focus-within:bg-white focus-within:border-[#1e5138] transition-all">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        disabled={loading}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="flex-grow px-4 py-3 text-xs font-bold text-gray-900 outline-none bg-transparent disabled:opacity-60"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-gray-400 hover:text-black">
                                        <span className="material-symbols-outlined text-base">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>

                                {form.password.length > 0 && (
                                    <div className="flex flex-col gap-1 mt-1 px-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                                                     style={{ backgroundColor: i <= strength ? strengthColors[strength] : 'rgba(0,0,0,0.06)' }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wide mt-0.5" style={{ color: strengthColors[strength] }}>
                                            Force : {strengthLabels[strength]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirmer mot de passe */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500 pl-1">Confirmer le mot de passe</label>
                                <div className={`flex items-center rounded-2xl border bg-white/50 backdrop-blur-md overflow-hidden focus-within:bg-white focus-within:border-[#1e5138] transition-all
                                ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-[#e63946]' : 'border-white/40'}
                            `}>
                                    <input
                                        name="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        disabled={loading}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="flex-grow px-4 py-3 text-xs font-bold text-gray-900 outline-none bg-transparent disabled:opacity-60"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-3 text-gray-400 hover:text-black">
                                        <span className="material-symbols-outlined text-base">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {form.confirmPassword && form.password !== form.confirmPassword && (
                                    <span className="text-[10px] font-bold text-[#e63946] pl-1">Les mots de passe ne correspondent pas</span>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-4 mt-2">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Précédent
                            </button>
                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={!isValid}
                                className={`font-bold px-10 py-3.5 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5 text-xs
                                ${isValid
                                    ? 'bg-[#1e5138] text-white hover:bg-[#153a28]'
                                    : 'bg-gray-200/60 text-gray-400'
                                }
                            `}
                            >
                                {loading ? "Création..." : "Continuer"}
                                {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </PageAnimation>
    )
}