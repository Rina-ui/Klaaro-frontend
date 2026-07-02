import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import {LANDING_CONTENT} from "../../../entities/landingContent.ts";
import {StatCard} from "./StatCard.tsx";


export default function LandingPage(): React.JSX.Element {
    const { hero, features, stats } = LANDING_CONTENT;

    return (
        <div className="min-h-screen bg-[#e2e4e3] text-[#1a1a1a] font-sans antialiased relative overflow-x-hidden flex flex-col items-center select-none">

            <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[800px] bg-[#1e5138]/15 rounded-[200px] rotate-[-15deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-[15%] right-[5%] w-[600px] h-[500px] bg-[#1e5138]/25 rounded-[120px] rotate-[25deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-[60%] left-[-15%] w-[800px] h-[600px] bg-[#1e5138]/10 rounded-[160px] rotate-[12deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="w-full max-w-[1300px] px-6 md:px-8 relative z-10 flex flex-col">

                {/* ─── HEADER BAR ─── */}
                <header className="w-full py-6 flex justify-between items-center mb-12">
                    <div className="text-xl font-black tracking-tight text-[#1e5138]">Klaaro.</div>
                    <button className="bg-[#1a1a1a] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-sm active:scale-95">
                        {hero.ctaPrimary}
                    </button>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pt-4">
                    <div className="lg:col-span-7 flex flex-col items-start">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.05] mb-6 pt-4">
                            {hero.titleMain} <br />
                            <span className="text-[#1e5138]">{hero.titleAccent}</span>
                        </h1>
                        <p className="text-sm text-gray-600 font-medium max-w-[520px] leading-relaxed mb-8">
                            {hero.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <button className="bg-[#1e5138] text-white text-xs font-bold px-6 py-3.5 rounded-full hover:bg-[#153a28] transition-all shadow-md active:scale-95 flex items-center gap-2">
                                {hero.ctaPrimary} <ArrowRight size={14} />
                            </button>
                            <button className="bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-800 text-xs font-bold px-6 py-3.5 rounded-full hover:bg-white transition-all shadow-sm active:scale-95 flex items-center gap-2">
                                <Play size={12} fill="currentColor" /> {hero.ctaSecondary}
                            </button>
                        </div>
                    </div>

                    {/*  Mockup Flottant */}
                    <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                        <div className="relative bg-white/80 p-4 rounded-[40px] shadow-xl border border-white max-w-[420px] transition-transform duration-500 hover:rotate-1">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
                                alt="Dashboard Preview"
                                className="rounded-[28px] w-full object-cover shadow-inner"
                            />
                            <div className="absolute bottom-8 left-[-20px] bg-white border border-gray-100 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black">IA Growth Insight</span>
                                    <span className="text-[9px] text-gray-400 font-bold">Ventes prévues +12% ce mois</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION LES TROIS STATS MAJEURES */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">
                    {stats.map((stat, i) => (
                        <StatCard key={i} value={stat.value} label={stat.label} />
                    ))}
                </section>

                {/* SECTION COMMENT ÇA MARCHE  */}
                <section className="flex flex-col items-center text-center mb-20">
                    <h2 className="text-3xl font-black tracking-tight mb-2 text-gray-900">{features.title}</h2>
                    <p className="text-xs text-gray-500 font-semibold mb-12">{features.subtitle}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
                        {features.steps.map((step) => (
                            <div key={step.id} className="bg-white/60 backdrop-blur-md border border-white/40 p-6 rounded-[32px] shadow-sm flex flex-col justify-between group hover:bg-white transition-all duration-300">
                                <div>
                                    <span className="text-xs font-black text-[#1e5138]/40 mb-4 block">0{step.id}</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                                <span className="text-[11px] font-bold text-[#1e5138] mt-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    En savoir plus <ArrowRight size={12} />
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}