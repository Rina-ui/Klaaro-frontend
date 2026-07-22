import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpEntrepriseRepository } from "../../../infrastructure/api/HttpEntrepriseRepository.ts";
import { useAuth } from "../../../use_cases/hooks/useAuth.ts";
import Sidebar from "../../components/ui/Sidebar.tsx";
import { Download, BarChart2, TrendingUp, Trash2, FileText, Plus } from 'lucide-react';

const entrepriseRepo = new HttpEntrepriseRepository();

interface Collaborator {
    id: string ;
    firstname: string;
    lastname: string;
    email: string;
    profession: string;
    role: string;
    account_type: string;
}

interface CompanyDocument {
    id: string;
    name: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
    url?: string;
}

export default function SettingsPage(): React.JSX.Element {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<'profile' | 'enterprise' | 'members' | 'documents'>('profile');

    const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', profession: '' });
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [documents, setDocuments] = useState<CompanyDocument[]>([
        { id: '1', name: 'Rapport_Ventes_Q2.csv', size: '2.4 MB', uploadedBy: 'Jean Dupont', uploadedAt: '12/07/2026' },
        { id: '2', name: 'Donnees_Stock_2026.xlsx', size: '1.1 MB', uploadedBy: 'Marie Curie', uploadedAt: '15/07/2026' }
    ]);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAdminEnterprise = user?.account_type === 'ENTREPRISE' || user?.role === 'admin' || user?.role === 'ADMIN';

    const fetchMembers = async () => {
        if (!token) return;
        try {
            setLoadingMembers(true);
            const data = await entrepriseRepo.getCollaborators(token);
            setCollaborators(data || []);
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Erreur lors de la récupération des membres:", error.message);
        } finally {
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'members' && token) {
            void fetchMembers();
        }
    }, [activeTab, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            setLoading(true);
            setMessage(null);

            const payload = {
                ...formData,
                role: 'user',
                account_type: user?.account_type || 'ENTREPRISE'
            };

            await entrepriseRepo.addCollaborator(payload, token);
            setMessage({ type: 'success', text: `Le collaborateur ${formData.firstname} a été créé avec succès !` });
            setFormData({ firstname: '', lastname: '', email: '', profession: '' });

            if (activeTab === 'members') void fetchMembers();
        } catch (err: unknown) {
            const error = err as Error;
            setMessage({ type: 'error', text: error.message || "L'API a rejeté l'ajout." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCollaborator = async (collaboratorId: string) => {
        if (!token || !window.confirm("Êtes-vous sûr de vouloir supprimer ce collaborateur ?")) return;
        try {
            await entrepriseRepo.deleteCollaborator(collaboratorId, token);
            // Comparaison stricte en string
            setCollaborators(collaborators.filter(c => String(c.id) !== String(collaboratorId)));
        } catch (err: unknown) {
            const error = err as Error;
            alert(error.message || "Impossible de supprimer ce membre.");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        try {
            setUploadingDoc(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const formattedSize = file.size > 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                : `${(file.size / 1024).toFixed(1)} KB`;

            const newDoc: CompanyDocument = {
                id: Math.random().toString(),
                name: file.name,
                size: formattedSize,
                uploadedBy: `${user?.firstname || 'Moi'} ${user?.lastname || ''}`,
                uploadedAt: new Date().toLocaleDateString('fr-FR')
            };

            setDocuments([newDoc, ...documents]);
        } catch {
            alert("Erreur lors de l'envoi du document");
        } finally {
            setUploadingDoc(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteDocument = (docId: string) => {
        if (!window.confirm("Supprimer ce document de l'espace partagé ?")) return;
        setDocuments(documents.filter(d => d.id !== docId));
    };

    const handleDownloadDocument = (doc: CompanyDocument) => {
        if (doc.url) {
            window.open(doc.url, '_blank');
        } else {
            alert(`Téléchargement de : ${doc.name}`);
        }
    };

    const handleAnalyzeDocument = (doc: CompanyDocument) => {
        navigate(`/analyses?fileId=${doc.id}&fileName=${encodeURIComponent(doc.name)}`);
    };

    const handlePredictDocument = (doc: CompanyDocument) => {
        navigate(`/predictions?fileId=${doc.id}&fileName=${encodeURIComponent(doc.name)}`);
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

            <main className={`flex-1 flex flex-col w-full max-w-[1600px] mx-auto relative z-10 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-24' : 'md:pl-28'}`}>
                <header className="flex justify-between items-center mb-5 w-full">
                    <div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-2 text-sm bg-white px-3 py-1 rounded-md border border-gray-200 font-medium">Menu</button>
                        <h1 className="text-xl font-bold tracking-tight">Paramètres</h1>
                    </div>
                </header>

                <div className="flex border-b border-gray-200/60 mb-6 relative z-10 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <button onClick={() => setActiveTab('profile')} className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'profile' ? 'border-[#1e5138] text-[#1e5138]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                        Mon Profil
                    </button>

                    {isAdminEnterprise && (
                        <>
                            <button onClick={() => setActiveTab('enterprise')} className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'enterprise' ? 'border-[#1e5138] text-[#1e5138]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                                Ajouter un membre
                            </button>
                            <button onClick={() => setActiveTab('members')} className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'members' ? 'border-[#1e5138] text-[#1e5138]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                                Membres de l'équipe
                            </button>
                            <button onClick={() => setActiveTab('documents')} className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'documents' ? 'border-[#1e5138] text-[#1e5138]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                                Documents partagés
                            </button>
                        </>
                    )}
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-gray-100 shadow-sm p-6 w-full max-w-4xl relative z-10">

                    {activeTab === 'profile' && (
                        <div className="max-w-3xl">
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
                        <div className="max-w-xl">
                            <h2 className="text-md font-semibold text-gray-800 mb-1">Ajouter un Collaborateur</h2>
                            <p className="text-xs text-gray-400 mb-6">Créez le compte d'un employé rattaché.</p>
                            {message && <div className={`p-3 rounded-xl mb-5 text-xs ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{message.text}</div>}
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600">Prénom</label>
                                        <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} required className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600">Nom</label>
                                        <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600">Adresse Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600">Profession / Poste</label>
                                    <input type="text" name="profession" placeholder="Ex: Comptable..." value={formData.profession} onChange={handleInputChange} required className="mt-1 block w-full rounded-xl border border-gray-100 bg-white p-2.5 text-xs text-gray-800 focus:outline-none" />
                                </div>
                                <button type="submit" disabled={loading} className="bg-[#1a1a1a] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-black transition-all">
                                    {loading ? 'Création...' : 'Créer le compte'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'members' && isAdminEnterprise && (
                        <div className="w-full">
                            <h2 className="text-md font-semibold text-gray-800 mb-1">Membres enregistrés</h2>
                            <p className="text-xs text-gray-400 mb-6">Liste complète des comptes rattachés.</p>
                            {loadingMembers ? (
                                <p className="text-xs text-gray-400 italic">Chargement...</p>
                            ) : collaborators.length > 0 ? (
                                <div className="w-full overflow-x-auto border border-gray-100 rounded-xl">
                                    <table className="w-full border-collapse text-left text-xs text-gray-600">
                                        <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
                                            <th className="p-3">Collaborateur</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                        {collaborators.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3 font-semibold text-gray-800">{member.firstname} {member.lastname}</td>
                                                <td className="p-3 text-gray-500">{member.email}</td>
                                                <td className="p-3 text-right">
                                                    {member.id !== user?.id && (
                                                        <button onClick={() => handleDeleteCollaborator(member.id)} className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-medium rounded-lg text-[11px] cursor-pointer">Supprimer</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">Aucun collaborateur.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && isAdminEnterprise && (
                        <div className="w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-md font-semibold text-gray-800 mb-1">Documents Partagés</h2>
                                    <p className="text-xs text-gray-400">Accédez, téléchargez ou lancez des analyses et prédictions directes sur vos fichiers.</p>
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingDoc}
                                        className="bg-[#1e5138] hover:bg-[#153a28] text-white px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:bg-gray-300"
                                    >
                                        <Plus size={14} />
                                        {uploadingDoc ? 'Envoi en cours...' : 'Déposer un document'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <div key={doc.id} className="p-4 bg-gray-50/60 hover:bg-gray-50 border border-gray-100/70 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-all">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-xl bg-[#1e5138]/10 text-[#1e5138] flex items-center justify-center flex-shrink-0 font-bold">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{doc.name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        Par {doc.uploadedBy} • {doc.uploadedAt} • {doc.size}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                                                <button
                                                    onClick={() => handleDownloadDocument(doc)}
                                                    className="px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                                                    title="Télécharger le fichier original"
                                                >
                                                    <Download size={13} className="text-gray-500" />
                                                    <span>Télécharger</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAnalyzeDocument(doc)}
                                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                                                    title="Lancer l'analyse du fichier"
                                                >
                                                    <BarChart2 size={13} className="text-emerald-700" />
                                                    <span>Analyser</span>
                                                </button>

                                                <button
                                                    onClick={() => handlePredictDocument(doc)}
                                                    className="px-3 py-1.5 bg-[#1e5138] hover:bg-[#153a28] text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                                                    title="Lancer une prédiction"
                                                >
                                                    <TrendingUp size={13} />
                                                    <span>Prédire</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 transition-colors cursor-pointer"
                                                    title="Supprimer le document"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                                        <p className="text-xs text-gray-400 italic">Aucun document n'a été téléversé pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}