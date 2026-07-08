import React, { useState } from 'react';
import {HttpEntrepriseRepository} from "../../../infrastructure/api/HttpEntrepriseRepository.ts";
import {useAuth} from "../../../use_cases/hooks/useAuth.ts";
import Sidebar from "../../components/ui/Sidebar.tsx";


const entrepriseRepo = new HttpEntrepriseRepository();

export default function SettingsPage() {
    const { user, token } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<'profile' | 'enterprise'>('profile');

    const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', profession: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const isAdminEnterprise = user?.account_type === 'ENTREPRISE' || user?.role === 'admin';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            setLoading(true);
            setMessage(null);
            await entrepriseRepo.addCollaborator(formData, token);
            setMessage({ type: 'success', text: `Le collaborateur ${formData.firstname} a été créé ! Mot de passe initial : Password123!` });
            setFormData({ firstname: '', lastname: '', email: '', profession: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Impossible de créer ce collaborateur." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans flex p-4 md:p-6 gap-0 overflow-hidden relative items-start">

            <div className="absolute top-[-25%] right-[-15%] w-[900px] h-[600px] bg-[#1e5138]/20 rounded-[120px] rotate-[-12deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute top-[-12%] right-[-5%] w-[550px] h-[450px] bg-[#1e5138]/40 rounded-[90px] rotate-[-22deg] pointer-events-none z-0 mix-blend-multiply" />
            <div className="absolute bottom-[-10%] left-[-8%] w-[650px] h-[450px] bg-[#1e5138]/20 rounded-[140px] rotate-[28deg] pointer-events-none z-0 mix-blend-multiply" />

            <div className="relative z-20">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden" />
            )}

            {/* Conteneur principal qui s'écarte selon l'état de la Sidebar */}
            <main className={`flex-1 flex flex-col w-full max-w-[1600px] mx-auto relative z-10 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-24' : 'md:pl-28'}`}>

                <header className="flex justify-between items-center mb-5 w-full">
                    <div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-2 text-sm bg-white px-3 py-1 rounded-md border border-gray-200 font-medium">Menu</button>
                        <h1 className="text-xl font-bold tracking-tight">Paramètres</h1>
                    </div>
                </header>

                {/* Sélecteur d'onglets au look minimaliste */}
                <div className="flex border-b border-gray-200/60 mb-6 relative z-10">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                            activeTab === 'profile' ? 'border-[#1e5138] text-[#1e5138]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        Mon Profil
                    </button>

                    {isAdminEnterprise && (
                        <button
                            onClick={() => setActiveTab('enterprise')}
                            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'enterprise' ? 'border-[#1e5138] text-[#1e5138]' : 'border-transparent text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            Mon Entreprise
                        </button>
                    )}
                </div>

                {/* Boîte de paramètres blanche, floutée ou propre */}
                <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-gray-100 shadow-sm p-6 max-w-3xl relative z-10">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-md font-semibold text-gray-800 mb-4">Informations Personnelles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Prénom</label>
                                    <input type="text" disabled defaultValue={user?.firstname || ""} className="mt-1 block w-full rounded-xl border-gray-100 bg-gray-50/50 p-2.5 text-xs text-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Nom</label>
                                    <input type="text" disabled defaultValue={user?.lastname || ""} className="mt-1 block w-full rounded-xl border-gray-100 bg-gray-50/50 p-2.5 text-xs text-gray-700" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500">Adresse Email</label>
                                    <input type="email" disabled defaultValue={user?.email || ""} className="mt-1 block w-full rounded-xl border-gray-100 bg-gray-50/50 p-2.5 text-xs text-gray-700" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'enterprise' && isAdminEnterprise && (
                        <div>
                            <h2 className="text-md font-semibold text-gray-800 mb-1">Ajouter un Collaborateur</h2>
                            <p className="text-xs text-gray-400 mb-6">
                                Créez le compte d'un employé. Le mot de passe par défaut est <span className="font-semibold text-gray-600">Password123!</span>.
                            </p>

                            {message && (
                                <div className={`p-3 rounded-xl mb-5 text-xs ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleAddUser} className="space-y-4 max-w-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600">Prénom</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none focus:border-gray-300 shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600">Nom</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none focus:border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600">Adresse Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none focus:border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600">Profession / Poste</label>
                                    <input
                                        type="text"
                                        name="profession"
                                        placeholder="Ex: Comptable, Analyste..."
                                        value={formData.profession}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none focus:border-gray-300 shadow-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#1a1a1a] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-black transition-all shadow-md active:scale-95 disabled:bg-gray-400 cursor-pointer"
                                >
                                    {loading ? 'Création...' : 'Créer le compte'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}