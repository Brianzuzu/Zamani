import { useState } from 'react';

const TRANSACTIONS = [
    { id: 'FW-88421', user: 'Amira Hassan', email: 'amira@gmail.com', amount: 'KSh 250,000', usd: '$1,923', method: 'Flutterwave', type: 'Investment', status: 'Successful', country: 'USA', date: '2026-02-26', ref: 'ZM-INV-009' },
    { id: 'MP-33101', user: 'Brian Mwangi', email: 'brian@zamani.com', amount: 'KSh 80,000', usd: '$615', method: 'M-Pesa', type: 'Deposit', status: 'Successful', country: 'Kenya', date: '2026-02-26', ref: 'ZM-DEP-041' },
    { id: 'FW-88419', user: 'Fatima Omar', email: 'fatima@dubai.ae', amount: 'KSh 420,000', usd: '$3,230', method: 'Flutterwave', type: 'Investment', status: 'Pending', country: 'UAE', date: '2026-02-25', ref: 'ZM-INV-008' },
    { id: 'MP-33098', user: 'Sarah Kimani', email: 'sarah@mail.com', amount: 'KSh 45,000', usd: '$346', method: 'M-Pesa', type: 'Withdrawal', status: 'Failed', country: 'Kenya', date: '2026-02-25', ref: 'ZM-WD-012' },
    { id: 'FW-88410', user: 'James Ochieng', email: 'james@outlook.com', amount: 'KSh 120,000', usd: '$923', method: 'Flutterwave', type: 'Investment', status: 'Refunded', country: 'UK', date: '2026-02-24', ref: 'ZM-INV-007' },
    { id: 'MP-33090', user: 'Grace Wanjiku', email: 'grace@wanjiku.co.ke', amount: 'KSh 32,000', usd: '$246', method: 'M-Pesa', type: 'Deposit', status: 'Successful', country: 'Kenya', date: '2026-02-24', ref: 'ZM-DEP-040' },
    { id: 'FW-88405', user: 'David Mensah', email: 'david@ghana.com', amount: 'KSh 60,000', usd: '$461', method: 'Flutterwave', type: 'Investment', status: 'Pending', country: 'Ghana', date: '2026-02-23', ref: 'ZM-INV-006' },
    { id: 'MP-33080', user: 'Mark Kamau', email: 'mark@africa.com', amount: 'KSh 15,000', usd: '$115', method: 'M-Pesa', type: 'Withdrawal', status: 'Failed', country: 'Kenya', date: '2026-02-22', ref: 'ZM-WD-011' },
];

function statusStyle(s) {
    if (s === 'Successful') return { bg: '#ECFDF5', color: '#065F46', dot: '#10B981' };
    if (s === 'Pending') return { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' };
    if (s === 'Failed') return { bg: '#FFF1F2', color: '#9F1239', dot: '#EF4444' };
    if (s === 'Refunded') return { bg: '#F0F4FF', color: '#1E40AF', dot: '#3B82F6' };
    return {};
}

function methodStyle(m) {
    if (m === 'Flutterwave') return { bg: '#FFF7ED', color: '#C2410C', icon: '🌊' };
    return { bg: '#F0FDF4', color: '#166534', icon: '📱' };
}

const STATUSES = ['All', 'Successful', 'Pending', 'Failed', 'Refunded'];
const METHODS = ['All Methods', 'Flutterwave', 'M-Pesa'];
const COUNTRIES = ['All Countries', 'Kenya', 'USA', 'UAE', 'UK', 'Ghana'];

const Payments = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [methodFilter, setMethodFilter] = useState('All Methods');
    const [countryFilter, setCountryFilter] = useState('All Countries');
    const [dateFilter, setDateFilter] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filtered = TRANSACTIONS.filter(t => {
        const matchStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchMethod = methodFilter === 'All Methods' || t.method === methodFilter;
        const matchCountry = countryFilter === 'All Countries' || t.country === countryFilter;
        const matchDate = !dateFilter || t.date === dateFilter;
        return matchStatus && matchMethod && matchCountry && matchDate;
    });

    // Summary stats
    const successful = TRANSACTIONS.filter(t => t.status === 'Successful').length;
    const pending = TRANSACTIONS.filter(t => t.status === 'Pending').length;
    const failed = TRANSACTIONS.filter(t => t.status === 'Failed').length;
    const refunded = TRANSACTIONS.filter(t => t.status === 'Refunded').length;

    const exportCSV = () => {
        const headers = ['ID', 'User', 'Amount', 'Method', 'Type', 'Status', 'Country', 'Date', 'Ref'];
        const rows = filtered.map(t => [t.id, t.user, t.amount, t.method, t.type, t.status, t.country, t.date, t.ref]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'zamani_transactions.csv'; a.click();
        showToast('CSV exported successfully');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80 }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 9999,
                    background: toast.type === 'success' ? '#0B3D2E' : '#9F1239',
                    color: '#fff', borderRadius: 16, padding: '14px 24px',
                    fontSize: 13, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                }}>{toast.type === 'success' ? '✓' : '⚠'} {toast.msg}</div>
            )}

            {/* Header */}
            <div style={{
                background: '#fff', borderRadius: 24, padding: '28px 32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)',
                flexWrap: 'wrap', gap: 16
            }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0 }}>Payment Engine</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                        Flutterwave · M-Pesa Daraja · Multi-currency settlement ledger
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => showToast('Reconciliation initiated — processing 8 transactions')}
                        style={{
                            background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 14,
                            padding: '11px 20px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                            color: '#0A1F44', textTransform: 'uppercase', letterSpacing: '1px'
                        }}>⚖ Reconcile</button>
                    <button onClick={exportCSV}
                        style={{
                            background: '#0B3D2E', color: '#fff', border: 'none', borderRadius: 14,
                            padding: '11px 20px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                            textTransform: 'uppercase', letterSpacing: '1px'
                        }}>↓ Export CSV</button>
                </div>
            </div>

            {/* Gateway Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ background: '#FFF7ED', borderRadius: 20, padding: '22px 24px', borderLeft: '4px solid #F97316', border: '1px solid #FED7AA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '1.5px' }}>🌊 Flutterwave</p>
                            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0A1F44' }}>KSh 850K</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94A3B8' }}>5 transactions · 3 successful</p>
                        </div>
                        <div style={{ background: '#ECFDF5', color: '#065F46', borderRadius: 8, padding: '5px 10px', fontSize: 10, fontWeight: 800 }}>● LIVE</div>
                    </div>
                </div>
                <div style={{ background: '#F0FDF4', borderRadius: 20, padding: '22px 24px', borderLeft: '4px solid #22C55E', border: '1px solid #BBF7D0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '1.5px' }}>📱 M-Pesa Daraja</p>
                            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0A1F44' }}>KSh 172K</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94A3B8' }}>4 transactions · 2 successful</p>
                        </div>
                        <div style={{ background: '#ECFDF5', color: '#065F46', borderRadius: 8, padding: '5px 10px', fontSize: 10, fontWeight: 800 }}>● LIVE</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                        { label: 'Successful', count: successful, color: '#10B981', bg: '#ECFDF5' },
                        { label: 'Pending', count: pending, color: '#F59E0B', bg: '#FFFBEB' },
                        { label: 'Failed', count: failed, color: '#EF4444', bg: '#FFF1F2' },
                        { label: 'Refunded', count: refunded, color: '#3B82F6', bg: '#EFF6FF' },
                    ].map(s => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '12px 14px' }}>
                            <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                            <h4 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#0A1F44' }}>{s.count}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div style={{
                background: '#fff', borderRadius: 20, padding: '18px 24px',
                border: '1px solid #F1F5F9', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'
            }}>
                {/* Status tabs */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} style={{
                            padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                            background: statusFilter === s ? '#0A1F44' : '#F1F5F9',
                            color: statusFilter === s ? '#fff' : '#94A3B8', transition: 'all 0.2s'
                        }}>{s}</button>
                    ))}
                </div>

                <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />

                <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{
                    border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '9px 14px',
                    fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none', background: '#F8FAFC', cursor: 'pointer'
                }}>
                    {METHODS.map(m => <option key={m}>{m}</option>)}
                </select>

                <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={{
                    border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '9px 14px',
                    fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none', background: '#F8FAFC', cursor: 'pointer'
                }}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>

                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{
                    border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '9px 14px',
                    fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none', background: '#F8FAFC', cursor: 'pointer'
                }} />

                {(statusFilter !== 'All' || methodFilter !== 'All Methods' || countryFilter !== 'All Countries' || dateFilter) && (
                    <button onClick={() => { setStatusFilter('All'); setMethodFilter('All Methods'); setCountryFilter('All Countries'); setDateFilter(''); }} style={{
                        background: '#FFF1F2', color: '#9F1239', border: 'none', borderRadius: 10,
                        padding: '8px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer'
                    }}>✕ Clear Filters</button>
                )}

                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>{filtered.length} records</span>
            </div>

            {/* Transaction Table */}
            <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 80px 110px 100px 110px 90px 120px', padding: '14px 24px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    {['Tx ID', 'User', 'Method', 'Amount', 'Type', 'Status', 'Country', 'Actions'].map(h => (
                        <span key={h} style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{h}</span>
                    ))}
                </div>

                {filtered.map((tx, idx) => {
                    const st = statusStyle(tx.status);
                    const mt = methodStyle(tx.method);
                    return (
                        <div key={tx.id} style={{
                            display: 'grid', gridTemplateColumns: '110px 1fr 80px 110px 100px 110px 90px 120px',
                            padding: '18px 24px', borderBottom: idx < filtered.length - 1 ? '1px solid #F8FAFC' : 'none',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace' }}>{tx.id}</span>

                            <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>{tx.user}</p>
                                <p style={{ margin: 0, fontSize: 10, color: '#94A3B8' }}>{tx.ref}</p>
                            </div>

                            <span style={{ fontSize: 10, fontWeight: 800, color: mt.color, background: mt.bg, padding: '4px 8px', borderRadius: 8, width: 'fit-content' }}>
                                {mt.icon} {tx.method === 'M-Pesa' ? 'MPesa' : 'FW'}
                            </span>

                            <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>{tx.amount}</p>
                                <p style={{ margin: 0, fontSize: 10, color: '#94A3B8' }}>{tx.usd}</p>
                            </div>

                            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{tx.type}</span>

                            <span style={{
                                fontSize: 10, fontWeight: 800, color: st.color, background: st.bg,
                                padding: '5px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content'
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
                                {tx.status}
                            </span>

                            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{tx.country}</span>

                            <div style={{ display: 'flex', gap: 6 }}>
                                {tx.status === 'Failed' || tx.status === 'Successful' ? (
                                    <button onClick={() => showToast(`Refund initiated for ${tx.id}`, tx.status === 'Failed' ? 'danger' : 'success')} style={{
                                        background: '#F0F4FF', color: '#1E40AF', border: 'none', borderRadius: 8,
                                        padding: '6px 10px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
                                    }}>↩ Refund</button>
                                ) : null}
                                <button onClick={() => showToast(`Viewing details for ${tx.id}`)} style={{
                                    background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8,
                                    padding: '6px 10px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
                                }}>···</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Payments;
