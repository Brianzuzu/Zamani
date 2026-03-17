import { useState } from 'react';
import {
    Package, Plus, MapPin, Globe, Home, Car,
    ShoppingCart, Briefcase, Filter, Search,
    MoreHorizontal, Edit2, Eye, X, Save,
    CheckCircle2, AlertCircle, TrendingUp, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTORS = [
    { id: 'Managed Lands', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'Build or Buy', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'Vehicle Sourcing', icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'Business Opps', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const Ventures = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const projects = [
        {
            id: 1, title: 'Syokimau Prime Plots', category: 'Managed Lands',
            location: 'Nairobi', goal: 'KSh 18M', funded: 'KSh 11.2M',
            milestone: 'Registry Phase', status: 'Funding', ROI: '18%',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
        },
        {
            id: 2, title: 'Rift Valley Macro-Farm', category: 'Business Opps',
            location: 'Nakuru', goal: 'KSh 500k', funded: 'KSh 385k',
            milestone: 'Infrastructure', status: 'Active', ROI: '24%',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
        },
        {
            id: 3, title: 'Lavington Apartments', category: 'Build or Buy',
            location: 'Lavington', goal: 'KSh 45M', funded: 'KSh 6.7M',
            milestone: 'Foundation', status: 'Active', ROI: '12%',
            image: 'https://images.unsplash.com/photo-1460317442991-0ec23939714e?w=400'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A1F44] tracking-tighter">Venture Registry</h1>
                    <p className="text-slate-500 font-medium">Coordinate and scale physical heritage assets.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-premium"
                >
                    <Plus size={18} /> Initialize Venture
                </button>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard label="Live Pools" value="24" icon={<Package className="text-emerald-600" />} />
                <InsightCard label="Total Land Area" value="1,420 Acres" icon={<MapPin className="text-blue-600" />} />
                <InsightCard label="Avg. Portfolio ROI" value="18.4%" icon={<TrendingUp className="text-[#D4AF37]" />} />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search registry by title, region or milestone..."
                        className="pl-12 py-4 bg-white shadow-sm border-none rounded-2xl w-full"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-white rounded-2xl text-sm font-bold text-[#0A1F44] shadow-sm hover:bg-slate-50 transition-all">
                    <Filter size={18} /> Deep Filters
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-premium p-0 overflow-hidden flex flex-col group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 right-4">
                                <span className={`status-badge ${project.status === 'Active' ? 'status-verified' : 'status-pending'}`}>
                                    {project.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                    {project.status}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className="bg-[#0A1F44] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider backdrop-blur-md">ROI: {project.ROI}</span>
                            </div>
                        </div>

                        <div className="p-8 space-y-6 flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 rounded-lg ${SECTORS.find(s => s.id === project.category)?.bg} ${SECTORS.find(s => s.id === project.category)?.color}`}>
                                        {(() => {
                                            const Icon = SECTORS.find(s => s.id === project.category)?.icon || Package;
                                            return <Icon size={14} />;
                                        })()}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.category}</span>
                                </div>
                                <h3 className="text-xl font-extrabold text-[#0A1F44] tracking-tight">{project.title}</h3>
                                <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                                    <MapPin size={14} />
                                    <span className="text-xs font-bold">{project.location} Node</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Funding Progress</p>
                                        <p className="text-sm font-black text-[#0A1F44]">{project.funded} <span className="text-slate-300 font-bold">/ {project.goal}</span></p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600">62%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Landmark size={14} className="text-[#D4AF37]" />
                                    <p className="text-xs font-bold text-slate-600">Milestone: <span className="text-[#0A1F44]">{project.milestone}</span></p>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button className="flex-1 py-3 bg-[#0A1F44] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">Command</button>
                                <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:text-[#0A1F44] transition-all"><Edit2 size={16} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal - Project Creation */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0A1F44]/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-[#0A1F44] tracking-tight">Initialize Venture</h2>
                                    <p className="text-xs font-medium text-slate-400 mt-1">Register a new physical heritage node into the registry.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={24} /></button>
                            </div>

                            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venture Title</label>
                                        <input type="text" placeholder="e.g. Garden City Plot #4" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector Category</label>
                                        <select>
                                            {SECTORS.map(s => <option key={s.id}>{s.id}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region Node</label>
                                        <select>
                                            <option>Nairobi</option>
                                            <option>Mombasa</option>
                                            <option>Kisumu</option>
                                            <option>Nakuru</option>
                                            <option>Diaspora Sourced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funding Goal (KES)</label>
                                        <input type="number" placeholder="5,000,000" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-[#0A1F44] uppercase tracking-[2px] pb-2 border-b border-slate-100">Execution Configuration</h3>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected ROI (%)</label>
                                            <input type="text" placeholder="e.g. 18%" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Milestone</label>
                                            <select>
                                                <option>Planning & Permits</option>
                                                <option>Registry Phase</option>
                                                <option>Foundation</option>
                                                <option>Infrastructure</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button className="px-6 py-4 text-xs font-black text-slate-400 hover:text-[#0A1F44] transition-all">Discard Draft</button>
                                <button className="btn-premium px-10"><Save size={18} /> Deploy Venture</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InsightCard = ({ label, value, icon }) => (
    <div className="card-premium flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-xl font-black text-[#0A1F44] tracking-tight">{value}</h4>
        </div>
    </div>
);

export default Ventures;
