import { useNavigate } from 'react-router-dom'
import { colors } from "../../../styles/token.ts";
import PageAnimation from "../../components/ui/PageAnimation.tsx";

export default function Step4Welcome() {
    const navigate = useNavigate()

    return (
        <PageAnimation>
            <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden select-none bg-[#e2e4e3]">

                {/*background*/}
                <div className="absolute top-[-25%] left-[-20%] w-[1000px] h-[800px] bg-[#1e5138]/15 rounded-[300px] rotate-[-20deg] pointer-events-none z-0 mix-blend-multiply" />
                <div className="absolute bottom-[-20%] right-[-15%] w-[900px] h-[750px] bg-[#1e5138]/20 rounded-[220px] rotate-[25deg] pointer-events-none z-0 mix-blend-multiply" />

                {/* Conteneur principal surélevé en z-10 */}
                <div className="flex flex-col items-center max-w-md relative z-10">

                    {/* Titre & Textes de bienvenue */}
                    <h1 className="text-4xl font-black tracking-tight text-center text-gray-900 leading-tight mb-4">
                        Bienvenue sur Klaaro.
                    </h1>

                    <p style={{ color: colors.onSurfaceVariant }} className="text-xs font-semibold text-center max-w-sm leading-relaxed mb-10 px-4">
                        Votre business vous parle enfin. Commencez par connecter vos premières données pour donner vie à vos tableaux de bord.
                    </p>

                    {/* Bouton d'Action Principal (Pilule signature) */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full md:w-auto font-bold px-10 py-4 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 bg-[#1e5138] text-white hover:bg-[#153a28] shadow-[#1e5138]/20"
                    >
                        <span className="material-symbols-outlined text-base">upload_file</span>
                        Connecter mes premières données
                    </button>
                </div>
            </div>
        </PageAnimation>

    )
}