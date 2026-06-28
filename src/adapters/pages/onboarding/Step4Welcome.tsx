import { useNavigate } from 'react-router-dom'
import {colors} from "../../../styles/token.ts";

export default function Step4Welcome() {
    const navigate = useNavigate()

    return (
        <div style={{ backgroundColor: colors.background }} className="min-h-screen flex flex-col items-center justify-center p-10">

            {/* Animation cercle */}
            <div className="relative flex items-center justify-center mb-8">
                <div style={{ backgroundColor: colors.primaryFixed }} className="w-32 h-32 rounded-full flex items-center justify-center animate-pulse">
                    <span style={{ color: colors.primary, fontVariationSettings: "'FILL' 1" }} className="material-symbols-outlined text-6xl">
                        check_circle
                    </span>
                </div>
            </div>

            {/* Texte */}
            <h1 style={{ color: colors.onSurface }} className="text-4xl font-bold text-center mb-4">
                Bienvenue sur Klaaro !
            </h1>
            <p style={{ color: colors.onSurfaceVariant }} className="text-lg text-center max-w-md mb-10">
                Votre business vous parle enfin. Commencez par connecter vos premières données.
            </p>

            {/* CTA */}
            <button
                onClick={() => navigate('/dashboard')}
                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                className="font-semibold px-12 py-4 rounded-xl text-lg transition-all active:scale-95 shadow-md flex items-center gap-3 hover:opacity-90"
            >
                <span className="material-symbols-outlined">upload_file</span>
                Connecter mes premières données
            </button>

            {/* Confettis décoratifs */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            backgroundColor: i % 2 === 0 ? colors.primary : colors.accent,
                            left: `${10 + i * 12}%`,
                            // eslint-disable-next-line react-hooks/purity
                            top: `${Math.random() * 30}%`,
                            width: '8px',
                            height: '8px',
                            borderRadius: '2px',
                            opacity: 0.3,
                            transform: `rotate(${i * 45}deg)`
                        }}
                        className="absolute animate-bounce"
                    />
                ))}
            </div>
        </div>
    )
}