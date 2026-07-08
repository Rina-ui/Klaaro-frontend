import React, { useState } from 'react';
import { X, Database, Loader2 } from 'lucide-react';
import { useConnectDatabase } from '../../../use_cases/hooks/useConnectDatabase.ts';
import type {DatabaseConnectionData, DBType} from "../../../domain/repositories/DatabaseRepository.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ConnectDatabaseModal({ isOpen, onClose, onSuccess }: Props) {
    const { handleConnect, isLoading, error, successMessage } = useConnectDatabase();

    const [form, setForm] = useState<DatabaseConnectionData>({
        name: '',
        dbType: 'postgresql',
        host: '',
        port: 5432,
        username: '',
        password: '',
        databaseName: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'port' ? Number(value) : value
        }));
    };

    const handleTypeChange = (type: DBType) => {
        setForm(prev => ({
            ...prev,
            dbType: type,
            port: type === 'postgresql' ? 5432 : 3306
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await handleConnect(form);
        if (ok) {
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#e2e4e3] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-white/40 flex flex-col relative animate-in fade-in zoom-in-95 duration-200 select-none">

                <header className="px-6 pt-6 pb-4 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
                    <div className="flex items-center gap-2">
                        <Database size={16} className="text-[#1e5138]" />
                        <h3 className="font-black text-xs uppercase tracking-wider text-gray-900">Connecter une Base</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/60 rounded-full transition-colors text-gray-500"><X size={16} /></button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                    {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold rounded-2xl text-center">{error}</div>}
                    {successMessage && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-bold rounded-2xl text-center">{successMessage}</div>}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Type de base de données</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['postgresql', 'mysql'] as DBType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleTypeChange(type)}
                                    className={`py-2.5 rounded-xl font-bold text-xs transition-all uppercase tracking-wider ${form.dbType === type ? 'bg-[#1e5138] text-white' : 'bg-white/50 text-gray-600 hover:bg-white'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Nom de la configuration</label>
                        <input name="name" required value={form.name} onChange={handleChange} placeholder="Ex: Base Prod AsiNuku" className="px-4 py-2.5 rounded-2xl border border-white/40 bg-white/50 text-xs font-bold outline-none focus:bg-white focus:border-[#1e5138]" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Hôte / IP</label>
                            <input name="host" required value={form.host} onChange={handleChange} placeholder="localhost" className="px-4 py-2.5 rounded-2xl border border-white/40 bg-white/50 text-xs font-bold outline-none focus:bg-white" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Port</label>
                            <input name="port" type="number" required value={form.port} onChange={handleChange} className="px-4 py-2.5 rounded-2xl border border-white/40 bg-white/50 text-xs font-bold outline-none focus:bg-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Utilisateur</label>
                            <input name="username" required value={form.username} onChange={handleChange} placeholder="postgres" className="px-4 py-2.5 rounded-2xl border border-white/40 bg-white/50 text-xs font-bold outline-none focus:bg-white" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Mot de passe</label>
                            <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" className="px-4 py-2.5 rounded-2xl border border-white/40 bg-white/50 text-xs font-bold outline-none focus:bg-white" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 pl-1">Nom de la Base</label>
                        <input name="databaseName" required value={form.databaseName} onChange={handleChange} placeholder="my_db" className="px-4 py-2.5 rounded-2xl border border-white/40 bg-white/50 text-xs font-bold outline-none focus:bg-white focus:border-[#1e5138]" />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full font-bold py-3.5 mt-2 bg-[#1e5138] text-white hover:bg-[#153a28] rounded-2xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                    >
                        {isLoading ? (<><Loader2 size={14} className="animate-spin" /> Test et connexion...</>) : 'Valider la connexion'}
                    </button>
                </form>
            </div>
        </div>
    );
}