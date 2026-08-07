import { useState, useEffect, useCallback } from 'react'
import { MessageCircle, LogOut, Loader2 } from 'lucide-react'
import { WHATSAPP_BASE_URL } from "../../../config/api.ts"

const WHATSAPP_API = WHATSAPP_BASE_URL || 'http://localhost:5000/whatsapp'

export default function WhatsAppCard() {
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)

    // Fonction de vérification stabilisée avec useCallback
    const checkWhatsAppStatus = useCallback(async () => {
        try {
            const resStatus = await fetch(`${WHATSAPP_API}/status`)
            const dataStatus = await resStatus.json()
            setStatus(dataStatus.status)

            if (dataStatus.status === 'connecting' || dataStatus.status === 'disconnected') {
                const resQr = await fetch(`${WHATSAPP_API}/qr`)
                const dataQr = await resQr.json()
                if (dataQr.qr) {
                    setQrCode(dataQr.qr)
                }
            } else if (dataStatus.status === 'connected') {
                setQrCode(null)
                setShowModal(false)
            }
        } catch (err) {
            console.error('Erreur lors de la connexion au microservice WhatsApp:', err)
            setStatus('disconnected')
        }
    }, [])

    useEffect(() => {
        let isMounted = true

        // Exécution asynchrone différée pour éviter le setState synchrone immédiat dans l'effet
        const initStatus = async () => {
            await Promise.resolve()
            if (isMounted) {
                await checkWhatsAppStatus()
            }
        }

        initStatus()

        const interval = setInterval(() => {
            checkWhatsAppStatus()
        }, 3000)

        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [checkWhatsAppStatus])

    const handleConnectClick = () => {
        setShowModal(true)
        checkWhatsAppStatus()
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await fetch(`${WHATSAPP_API}/logout`, { method: 'POST' })
            await checkWhatsAppStatus()
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="bg-[#e8f5e9] p-5 rounded-xl border border-[#c8e6c9] flex flex-col justify-between items-center text-center shadow-sm">
                <div className="flex flex-col items-center mt-2">
                    <div className="w-12 h-12 bg-white text-[#25D366] rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <MessageCircle size={24} fill="currentColor" />
                    </div>
                    <h3 className="font-bold text-sm tracking-wide text-[#1b5e20]">Alertes WhatsApp</h3>
                    <p className="text-[11px] text-[#2e7d32] mt-1.5 max-w-[210px] leading-relaxed font-medium">
                        {status === 'connected'
                            ? 'Votre compte WhatsApp est actuellement connecté et actif.'
                            : 'Connectez votre compte pour recevoir vos notifications et rapports d\'analyses directement sur votre messagerie.'}
                    </p>
                </div>

                {status === 'connected' ? (
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                        Déconnecter WhatsApp
                    </button>
                ) : (
                    <button
                        onClick={handleConnectClick}
                        className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] mt-4"
                    >
                        Connecter WhatsApp
                    </button>
                )}
            </div>

            {/* Modal d'affichage du QR Code */}
            {showModal && status !== 'connected' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative border border-gray-100">
                        <h4 className="font-bold text-base text-gray-800 mb-1">Scannez le QR Code</h4>
                        <p className="text-xs text-gray-500 mb-4">
                            Ouvrez WhatsApp sur votre téléphone, allez dans <br />
                            <span className="font-semibold text-gray-700">Appareils connectés &gt; Connecter un appareil</span>.
                        </p>

                        <div className="w-64 h-64 border border-gray-200 rounded-xl flex items-center justify-center p-2 bg-gray-50 shadow-inner">
                            {qrCode ? (
                                <img src={qrCode} alt="WhatsApp QR Code" className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400 gap-2">
                                    <Loader2 size={32} className="animate-spin text-[#25D366]" />
                                    <span className="text-xs font-medium">Génération du QR Code...</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 rounded-lg transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}