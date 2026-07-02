import { MessageCircle } from 'lucide-react'

export default function WhatsAppCard() {
    return (
        <div className="bg-[#e8f5e9] p-5 rounded-xl border border-[#c8e6c9] flex flex-col justify-between items-center text-center shadow-sm">
            <div className="flex flex-col items-center mt-2">
                <div className="w-12 h-12 bg-white text-[#25D366] rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <MessageCircle size={24} fill="currentColor" />
                </div>
                <h3 className="font-bold text-sm tracking-wide text-[#1b5e20]">Alertes WhatsApp</h3>
                <p className="text-[11px] text-[#2e7d32] mt-1.5 max-w-[210px] leading-relaxed font-medium">
                    Connectez votre compte pour recevoir vos notifications et rapports d'analyses directement sur votre messagerie.
                </p>
            </div>
            <button className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] mt-4">
                Connecter WhatsApp
            </button>
        </div>
    )
}