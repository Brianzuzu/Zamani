import axios from 'axios';
import { useEffect, useState } from 'react';
import API_URL from '../config';

const STATUSES = ['All', 'Active', 'Completed', 'Cancelled'];

function statusStyle(s) {
    if (s === 'Active') return { bg: '#ECFDF5', color: '#065F46', dot: '#10B981' };
    if (s === 'Completed') return { bg: '#E0F2FE', color: '#075985', dot: '#38BDF8' };
    if (s === 'Cancelled') return { bg: '#FEF2F2', color: '#991B1B', dot: '#F87171' };
    return { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' };
}

const Savings = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [view, setView] = useState('grid');
    const [toast, setToast] = useState(null);
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const toast_ = (msg, type = 'success') => { 
        setToast({ msg, type }); 
        setTimeout(() => setToast(null), 3000); 
    };

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await axios.get(`${API_URL}/savings/all`);
                setGoals(res.data);
            } catch (err) {
                console.error('Error fetching savings goals:', err);
                toast_('Failed to fetch savings goals', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const filtered = goals.filter(g => statusFilter === 'All' || g.status === statusFilter);

    if (isLoading) {
        return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Loading savings monitoring...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80, position: 'relative' }}>
            {toast && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'success' ? '#0B3D2E' : '#9F1239', color: '#fff', borderRadius: 16, padding: '14px 24px', fontSize: 13, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>{toast.msg}</div>}

            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 24, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0 }}>Savings Monitor</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>Track member saving goals and capital accumulation progress.</p>
                </div>
                <div style={{ display: 'flex', background: '#F8FAFC', borderRadius: 12, padding: 4, gap: 4 }}>
                    {['grid', 'table'].map(v => (
                        <button key={v} onClick={() => setView(v)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: view === v ? '#fff' : 'transparent', color: view === v ? '#0A1F44' : '#94A3B8', fontWeight: 800, fontSize: 12, boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{v === 'grid' ? '⊞ Grid' : '☰ Table'}</button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '16px 24px', border: '1px solid #F1F5F9', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Status:</span>
                {STATUSES.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, background: statusFilter === s ? '#0A1F44' : '#F1F5F9', color: statusFilter === s ? '#fff' : '#94A3B8' }}>{s}</button>
                ))}
            </div>

            {/* Grid View */}
            {view === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {filtered.map(g => {
                        const st = statusStyle(g.status);
                        const pct = Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
                        return (
                            <div key={g._id} style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${g.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                        {g.icon === 'wallet' ? '💰' : '🎯'}
                                    </div>
                                    <span style={{ background: st.bg, color: st.color, borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800 }}>{g.status}</span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0A1F44', margin: '0 0 4px' }}>{g.title}</h3>
                                    <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, margin: 0 }}>Member: {g.user?.name || 'Unknown'}</p>
                                </div>
                                <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <p style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Saved</p>
                                            <p style={{ fontSize: 14, fontWeight: 900, color: '#0A1F44', margin: 0 }}>{g.currencySymbol} {g.currentAmount.toLocaleString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Target</p>
                                            <p style={{ fontSize: 14, fontWeight: 900, color: '#0A1F44', margin: 0 }}>{g.currencySymbol} {g.targetAmount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div style={{ height: 8, background: '#E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: g.color || '#0B3D2E', borderRadius: 10 }} />
                                    </div>
                                    <p style={{ textAlign: 'right', fontSize: 10, fontWeight: 900, color: '#0A1F44', marginTop: 6 }}>{pct}% Complete</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Table View */}
            {view === 'table' && (
                <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Goal</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Member</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Progress</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Amount</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(g => {
                                const st = statusStyle(g.status);
                                const pct = Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
                                return (
                                    <tr key={g._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1F44' }}>{g.title}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>{g.user?.name || 'Unknown'}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', width: 200 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: g.color || '#10B981' }} />
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 800, color: '#0A1F44' }}>{pct}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>{g.currencySymbol}{g.currentAmount.toLocaleString()} / {g.targetAmount.toLocaleString()}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ background: st.bg, color: st.color, borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800 }}>{g.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Savings;
