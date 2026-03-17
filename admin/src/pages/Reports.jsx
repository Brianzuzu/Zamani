import { useState } from 'react';

const COUNTRY_DATA = [
    { country: 'Kenya', investors: 6420, volume: 'KSh 48.2M', pct: 55, flag: '🇰🇪', type: 'Local' },
    { country: 'USA', investors: 2180, volume: 'KSh 38.6M', pct: 26, flag: '🇺🇸', type: 'Diaspora' },
    { country: 'UK', investors: 840, volume: 'KSh 18.4M', pct: 10, flag: '🇬🇧', type: 'Diaspora' },
    { country: 'UAE', investors: 420, volume: 'KSh 12.1M', pct: 5, flag: '🇦🇪', type: 'Diaspora' },
    { country: 'Canada', investors: 180, volume: 'KSh 6.8M', pct: 2, flag: '🇨🇦', type: 'Diaspora' },
    { country: 'Ghana', investors: 240, volume: 'KSh 3.2M', pct: 2, flag: '🇬🇭', type: 'Local' },
];

const REPORTS = [
    {
        id: 'RPT-USERS', title: 'Users Report', desc: 'All registered users with KYC status, roles, investment totals, and account balances.',
        icon: '👥', color: '#1E40AF', bg: '#EFF6FF', rows: '14,284', size: '4.2 MB', lastGen: 'Feb 26, 2026',
        fields: ['User ID', 'Name', 'Email', 'Phone', 'Country', 'Role', 'KYC Status', 'Invested', 'Balance', 'Joined']
    },
    {
        id: 'RPT-TX', title: 'Transaction Report', desc: 'Full ledger of all platform transactions including Flutterwave and M-Pesa.',
        icon: '💳', color: '#065F46', bg: '#ECFDF5', rows: '22,410', size: '9.8 MB', lastGen: 'Feb 26, 2026',
        fields: ['Tx ID', 'User', 'Amount', 'Currency', 'Method', 'Status', 'Date', 'Reference']
    },
    {
        id: 'RPT-REV', title: 'Revenue Report', desc: 'Platform commission and fee earnings broken down by month, gateway, and category.',
        icon: '📈', color: '#92400E', bg: '#FFFBEB', rows: '6 months', size: '1.1 MB', lastGen: 'Feb 25, 2026',
        fields: ['Month', 'Gross Volume', 'Platform Fee', 'Net Commission', 'Gateway', 'Category']
    },
    {
        id: 'RPT-COUNTRY', title: 'Country Investment Distribution', desc: 'Investment breakdown by country — volume, investor count, and percentage share.',
        icon: '🌍', color: '#6D28D9', bg: '#F5F3FF', rows: '6 countries', size: '0.5 MB', lastGen: 'Feb 24, 2026',
        fields: ['Country', 'Investors', 'Volume (KES)', 'Volume (USD)', 'Share %', 'Type']
    },
    {
        id: 'RPT-DIASPORA', title: 'Diaspora Country Breakdown', desc: 'Diaspora investor analysis showing inflows by origin country and FX split.',
        icon: '✈️', color: '#0B3D2E', bg: '#F0FDF4', rows: '4 countries', size: '0.3 MB', lastGen: 'Feb 23, 2026',
        fields: ['Country', 'Investors', 'USD Inflow', 'KES Equivalent', 'Gateway Used', 'Avg Investment']
    },
];

const MONTHLY_REV = [
    { month: 'Jan', revenue: 450000, max: 820000 },
    { month: 'Feb', revenue: 520000, max: 820000 },
    { month: 'Mar', revenue: 480000, max: 820000 },
    { month: 'Apr', revenue: 610000, max: 820000 },
    { month: 'May', revenue: 750000, max: 820000 },
    { month: 'Jun', revenue: 820000, max: 820000 },
];

const Reports = () => {
    const [generating, setGenerating] = useState(null);
    const [toast, setToast] = useState(null);
    const [dateRange, setDateRange] = useState({ from: '2026-01-01', to: '2026-02-26' });
    const [format, setFormat] = useState('CSV');

    const toast_ = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const generateReport = (rpt) => {
        setGenerating(rpt.id);
        setTimeout(() => {
            setGenerating(null);
            // Simulate CSV download
            const csv = [rpt.fields.join(','), `Sample data row for ${rpt.title}`].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zamani_${rpt.id.toLowerCase()}_${dateRange.from}_${dateRange.to}.${format.toLowerCase()}`;
            a.click();
            toast_(`✓ ${rpt.title} exported as ${format}`);
        }, 1500);
    };

    const diaspora = COUNTRY_DATA.filter(c => c.type === 'Diaspora');
    const totalDiasporaPct = diaspora.reduce((a, c) => a + c.pct, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80 }}>
            {toast && (
                <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'success' ? '#0B3D2E' : '#9F1239', color: '#fff', borderRadius: 16, padding: '14px 24px', fontSize: 13, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 24, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0 }}>Reports & Analytics</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                        Export platform data · Users · Transactions · Revenue · Country distribution
                    </p>
                </div>
                <button onClick={() => { REPORTS.forEach((r, i) => setTimeout(() => generateReport(r), i * 400)); }} style={{ background: '#0B3D2E', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                    ↓ Export All Reports
                </button>
            </div>

            {/* Filter Bar */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '18px 24px', border: '1px solid #F1F5F9', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>From</span>
                    <input type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} style={{ border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '9px 12px', fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none', background: '#F8FAFC' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>To</span>
                    <input type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} style={{ border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '9px 12px', fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none', background: '#F8FAFC' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['CSV', 'JSON', 'PDF'].map(f => (
                        <button key={f} onClick={() => setFormat(f)} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, background: format === f ? '#0A1F44' : '#F1F5F9', color: format === f ? '#fff' : '#94A3B8' }}>{f}</button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '8px 14px', fontSize: 11, fontWeight: 700, color: '#065F46' }}>
                    ● All systems operational
                </div>
            </div>

            {/* Summary KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Users', value: '14,284', trend: '+12.4%', color: '#1E40AF', bg: '#EFF6FF', icon: '👥' },
                    { label: 'Total Transactions', value: '22,410', trend: '+24.1%', color: '#065F46', bg: '#ECFDF5', icon: '💳' },
                    { label: 'Total Revenue', value: 'KSh 4.2M', trend: '+22.3%', color: '#92400E', bg: '#FFFBEB', icon: '💰' },
                    { label: 'Diaspora Inflow', value: 'KSh 75.9M', trend: '+30.1%', color: '#6D28D9', bg: '#F5F3FF', icon: '✈️' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 20, padding: '22px 24px', borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
                        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.label}</p>
                        <h3 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: '#0A1F44' }}>{s.value}</h3>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981' }}>↑ {s.trend}</span>
                    </div>
                ))}
            </div>

            {/* Report Export Cards */}
            <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>Available Reports</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                    {REPORTS.map(rpt => (
                        <div key={rpt.id} style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(10,31,68,0.04)', borderTop: `4px solid ${rpt.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: rpt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{rpt.icon}</div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Last generated</p>
                                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#0A1F44' }}>{rpt.lastGen}</p>
                                </div>
                            </div>
                            <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 900, color: '#0A1F44' }}>{rpt.title}</h3>
                            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>{rpt.desc}</p>

                            {/* Fields preview */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                                {rpt.fields.map(f => (
                                    <span key={f} style={{ background: '#F8FAFC', color: '#64748B', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>{f}</span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <span style={{ fontSize: 11, color: '#94A3B8' }}>📊 {rpt.rows} rows</span>
                                    <span style={{ fontSize: 11, color: '#94A3B8' }}>📁 {rpt.size}</span>
                                </div>
                                <button
                                    onClick={() => generateReport(rpt)}
                                    disabled={!!generating}
                                    style={{
                                        background: generating === rpt.id ? '#F1F5F9' : `linear-gradient(135deg, ${rpt.color}, ${rpt.color}CC)`,
                                        color: generating === rpt.id ? '#94A3B8' : '#fff',
                                        border: 'none', borderRadius: 12, padding: '10px 18px',
                                        fontSize: 12, fontWeight: 800, cursor: generating ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 6, minWidth: 120, justifyContent: 'center'
                                    }}>
                                    {generating === rpt.id ? (
                                        <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #94A3B8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
                                    ) : `↓ Export ${format}`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Country Distribution Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Country Table */}
                <div style={{ background: '#fff', borderRadius: 24, padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 900, color: '#0A1F44' }}>🌍 Country Investment Distribution</h3>
                    <p style={{ margin: '0 0 24px', fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>All-time investment by country</p>
                    {COUNTRY_DATA.map((c, i) => (
                        <div key={c.country} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 20 }}>{c.flag}</span>
                                    <div>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>{c.country}</span>
                                        <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 800, color: c.type === 'Diaspora' ? '#6D28D9' : '#065F46', background: c.type === 'Diaspora' ? '#F5F3FF' : '#ECFDF5', padding: '2px 6px', borderRadius: 6 }}>{c.type}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: 12, fontWeight: 900, color: '#0A1F44' }}>{c.volume}</span>
                                    <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 6 }}>({c.pct}%)</span>
                                </div>
                            </div>
                            <div style={{ height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${c.pct * 1.8}%`, background: c.type === 'Diaspora' ? 'linear-gradient(90deg, #6D28D9, #A78BFA)' : 'linear-gradient(90deg, #0A1F44, #3B82F6)', borderRadius: 99 }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Diaspora Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: '#0A1F44', borderRadius: 24, padding: '28px', flex: 1 }}>
                        <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 900, color: '#fff' }}>✈️ Diaspora Breakdown</h3>
                        <p style={{ margin: '0 0 24px', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{totalDiasporaPct}% of total inflow is diaspora</p>
                        {diaspora.map(d => (
                            <div key={d.country} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 18 }}>{d.flag}</span>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{d.country}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: 12, fontWeight: 900, color: '#10B981' }}>{d.volume}</span>
                                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>↑ {d.pct}%</span>
                                    </div>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                                    <div style={{ height: '100%', width: `${(d.pct / totalDiasporaPct) * 100}%`, background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: 99 }} />
                                </div>
                                <p style={{ margin: '4px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{d.investors.toLocaleString()} investors</p>
                            </div>
                        ))}
                    </div>

                    {/* Monthly Revenue */}
                    <div style={{ background: '#fff', borderRadius: 24, padding: '24px', border: '1px solid #F1F5F9' }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 900, color: '#0A1F44' }}>📈 Monthly Revenue</h3>
                        <p style={{ margin: '0 0 20px', fontSize: 11, color: '#94A3B8' }}>Platform commission (Jan–Jun 2026)</p>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
                            {MONTHLY_REV.map(d => (
                                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '100%', height: `${(d.revenue / d.max) * 100}%`, background: 'linear-gradient(180deg, #0A1F44, #3B82F6)', borderRadius: '6px 6px 3px 3px', minHeight: 6 }} />
                                    <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8' }}>{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Reports;
