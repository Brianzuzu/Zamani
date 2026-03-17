import { useState } from 'react';
import {
    Wallet, ArrowLeftRight, CreditCard, Landmark,
    ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap,
    Filter, Search, Download, CheckCircle2,
    AlertCircle, Globe, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

const Treasury = () => {
    const [activeTab, setActiveTab] = useState('wallets');

    const transactions = [
        { id: 'FT-9024', user: 'Brian Zamani', amount: 'KSh 150,000', currency: 'KES', method: 'Flutterwave', status: 'Cleared', type: 'Node Inflow' },
        { id: 'MP-1102', user: 'Sarah Kimani', amount: 'KSh 45,000', currency: 'KES', method: 'M-Pesa', status: 'Pending', type: 'Disbursement' },
        { id: 'FT-9023', user: 'James Smith', amount: '$5,000', currency: 'USD', method: 'Flutterwave', status: 'Cleared', type: 'Node Inflow' },
        { id: 'BT-4401', user: 'Equity Trust', amount: 'KSh 1.2M', currency: 'KES', method: 'Bank Transfer', status: 'Flagged', type: 'Venture Deploy' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A1F44] tracking-tighter">Capital Velocity</h1>
                    <p className="text-slate-500 font-medium">Platform-wide multicurrency liquidity and settlement engine.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 bg-white rounded-2xl text-sm font-bold text-[#0A1F44] shadow-sm hover:bg-slate-50 transition-all border border-slate-100">
                        <Download size={18} /> Export Settlement
                    </button>
                    <button className="btn-premium">
                        <Zap size={18} /> Manual Payout
                    </button>
                </div>
            </div>

            {/* Currency Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CurrencyNode
                    label="KES Vault"
                    value="KSh 42.8M"
                    icon={<Landmark className="text-white" size={24} />}
                    bg="bg-[#0A1F44]"
                    status="Operational"
                />
                <CurrencyNode
                    label="USD Vault"
                    value="$310.2K"
                    icon={<Globe className="text-white" size={24} />}
                    bg="bg-[#0B3D2E]"
                    status="Institutional Sync"
                />
                <CurrencyNode
                    label="Strategic Loan Capital"
                    value="KSh 15.4M"
                    icon={<DollarSign className="text-white" size={24} />}
                    bg="bg-[#D4AF37]"
                    status="Managed"
                />
            </div>

            {/* Nav Tabs */}
            <div className="flex gap-3 p-1 bg-slate-100 rounded-2xl w-fit">
                <TabButton label="Wealth Vaults" active={activeTab === 'wallets'} onClick={() => setActiveTab('wallets')} />
                <TabButton label="Payment Engine" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                <TabButton label="Strategic Funding" active={activeTab === 'loans'} onClick={() => setActiveTab('loans')} />
            </div>

            {/* Table Area */}
            <div className="card-premium p-0 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/30 gap-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-black text-[#0A1F44]">Settlement Ledger</h3>
                        <div className="h-6 w-px bg-slate-200 mx-2" />
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Live Flow</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Ref code..."
                                className="pl-10 py-2.5 bg-white border-slate-200 rounded-xl w-48 text-[11px] font-bold"
                            />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#0A1F44] transition-all"><Filter size={18} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log / Source</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#F5EFE7]/20 transition-all cursor-pointer">
                                    <td className="px-10 py-7">
                                        <div>
                                            <p className="text-sm font-black text-[#0A1F44] tracking-tight">{tx.user}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ref: {tx.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <p className="text-xs font-bold text-slate-600">{tx.type}</p>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-sm font-black ${tx.type.includes('Inflow') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {tx.type.includes('Inflow') ? '+' : '-'}{tx.amount}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300">{tx.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{tx.method}</p>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className={`status-badge ${tx.status === 'Cleared' ? 'status-verified' :
                                                tx.status === 'Pending' ? 'status-pending' : 'status-restricted'
                                            }`}>
                                            {tx.status === 'Cleared' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <button className="p-3 text-slate-200 hover:text-[#0A1F44] transition-all"><ArrowUpRight size={22} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CurrencyNode = ({ label, value, icon, bg, status }) => (
    <div className="card-premium relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-slate-100 transition-colors" />
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-3xl ${bg} flex items-center justify-center shadow-xl mb-6`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black text-[#0A1F44] tracking-tight">{value}</h3>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[2px] rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {status}
            </div>
        </div>
    </div>
);

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-[#0A1F44] shadow-md' : 'text-slate-400 hover:text-[#0A1F44] hover:bg-white/50'}`}
    >
        {label}
    </button>
);

export default Treasury;
