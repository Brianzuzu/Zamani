import { Bell, Search, User, Shield, ChevronDown } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex items-center justify-between mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <Shield size={16} className="text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-sm font-black text-[#0A1F44] tracking-tight">Institutional Clearance: <span className="text-emerald-600 uppercase">Super Admin</span></h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Zamani Authority Node • 001</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Master Search */}
                <div className="relative group hidden lg:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-[#0B3D2E] transition-colors" />
                    <input
                        type="text"
                        placeholder="Trace matrix data..."
                        className="pl-12 py-3 bg-white border-slate-100 rounded-2xl w-72 text-xs font-bold focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center gap-5">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#0A1F44] hover:shadow-lg transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-10 w-px bg-slate-100 mx-2" />

                    <div className="flex items-center gap-4 group cursor-pointer pl-2">
                        <div className="text-right">
                            <p className="text-sm font-black text-[#0A1F44] leading-none mb-1">Brian Zamani</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active Session</p>
                        </div>
                        <div className="relative">
                            <div className="w-11 h-11 bg-[#0A1F44] rounded-2xl flex items-center justify-center text-white font-black shadow-xl group-hover:scale-105 transition-transform">
                                BZ
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white" />
                        </div>
                        <ChevronDown size={14} className="text-slate-300 group-hover:text-[#0A1F44] transition-colors" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
