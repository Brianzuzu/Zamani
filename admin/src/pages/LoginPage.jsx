import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import API_URL from '../config';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Firebase Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // 2. Verify Admin Role with Backend
            const response = await axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.role === 'admin') {
                localStorage.setItem('adminToken', token);
                navigate('/admin');
            } else {
                throw new Error('Access denied: You are not an administrator.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#F5EFE7]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#0A1F44] rounded-full opacity-[0.05] blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90]
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#0B3D2E] rounded-full opacity-[0.05] blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="card-premium p-16 shadow-[0_40px_100px_rgba(10,31,68,0.15)] bg-white/90 backdrop-blur-xl border-white/50">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 1 }}
                            className="w-24 h-24 bg-[#0A1F44] rounded-[32px] flex items-center justify-center shadow-2xl mb-10 transform -rotate-6"
                        >
                            <Sparkles className="text-white w-12 h-12" />
                        </motion.div>
                        <h1 className="text-5xl font-black text-[#0A1F44] tracking-tighter uppercase mb-4">Zamani</h1>
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-slate-200"></div>
                            <p className="text-slate-400 font-extrabold text-[11px] uppercase tracking-[4px]">Executive Terminal</p>
                            <div className="h-px w-8 bg-slate-200"></div>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-10">
                        {error ? (
                            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 mb-6">
                                {error}
                            </div>
                        ) : null}

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-[#0A1F44] uppercase tracking-[2px] ml-5">Security Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-[#0A1F44] transition-colors" />
                                <input
                                    type="email"
                                    className="pl-20 py-6 text-lg border-slate-100 hover:border-slate-200 focus:bg-white shadow-sm font-semibold"
                                    placeholder="admin.hq@zamani.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-[#0A1F44] uppercase tracking-[2px] ml-5">Verification Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-[#0A1F44] transition-colors" />
                                <input
                                    type="password"
                                    className="pl-20 py-6 text-lg border-slate-100 hover:border-slate-200 focus:bg-white shadow-sm font-semibold"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-6 text-lg shadow-[0_20px_40px_rgba(10,31,68,0.2)] group relative overflow-hidden disabled:opacity-70"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'Authenticating...' : 'Initialize Access'}
                                {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>
                    </form>

                    <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-5 py-2 rounded-full">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Biometric-Grade Security Level 4</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold tracking-tight">System v2.4.0 • Authorized Personnel Only</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
