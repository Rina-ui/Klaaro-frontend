import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import {LOGIN_CONTENT} from "../../../entities/loginContent.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

export default function LoginPage(): React.JSX.Element {
    const { title, subtitle, fields, forgotPassword, submitBtn, noAccount, registerLink } = LOGIN_CONTENT;

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, password });
    };

    return (
        <PageAnimation>
            <div className="min-h-screen bg-[#e2e4e3] text-[#1a1a1a] font-sans antialiased relative overflow-hidden flex items-center justify-center px-4 select-none">

                <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[650px] bg-[#1e5138]/15 rounded-[180px] rotate-[12deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[850px] h-[600px] bg-[#1e5138]/25 rounded-[140px] rotate-[-15deg] pointer-events-none z-0 mix-blend-multiply" />

                <div className="absolute w-[500px] h-[500px] bg-[#1e5138]/5 rounded-full blur-[120px] pointer-events-none z-0" />

                <div className="w-full max-w-[460px] bg-white/70 backdrop-blur-xl border border-white/50 p-8 md:p-10 rounded-[40px] shadow-xl relative z-10 flex flex-col transition-all duration-300">

                    {/* LOGO & TITRE */}
                    <div className="mb-8 text-center sm:text-left">
                        <span className="text-xl font-black tracking-tight text-[#1e5138] block mb-4">Klaaro.</span>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight mb-2">{title}</h1>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">{subtitle}</p>
                    </div>

                    {/* FORMULAIRE */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* CHAMP EMAIL */}
                        <div className="flex flex-col">
                            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-2 pl-1">
                                {fields.email.label}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={fields.email.placeholder}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-gray-100 rounded-2xl text-xs font-medium focus:outline-none focus:border-gray-300 text-gray-900 shadow-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* CHAMP MOT DE PASSE */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                                    {fields.password.label}
                                </label>
                                <a href="#forgot" className="text-[11px] font-bold text-[#1e5138] hover:underline">
                                    {forgotPassword}
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={fields.password.placeholder}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/90 border border-gray-100 rounded-2xl text-xs font-medium focus:outline-none focus:border-gray-300 text-gray-900 shadow-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* BOUTON DE VALIDATION */}
                        <button
                            type="submit"
                            className="w-full bg-[#1e5138] text-white text-xs font-bold py-4 rounded-2xl hover:bg-[#153a28] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer"
                        >
                            {submitBtn} <ArrowRight size={14} />
                        </button>
                    </form>

                    {/* BAS DE PAGE */}
                    <div className="mt-8 pt-6 border-t border-gray-200/40 text-center">
                        <p className="text-xs text-gray-500 font-semibold">
                            {noAccount}{' '}
                            <a href="/onboarding/step1" className="text-[#1e5138] font-black hover:underline ml-1">
                                {registerLink}
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </PageAnimation>

);
}