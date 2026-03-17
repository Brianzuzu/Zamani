import { useState } from 'react';

const kpis = [
    { label: 'Total Users', value: '14,284', sub: 'Active ecosystem participants', trend: '+12.4%', up: true, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Total Investors', value: '5,120', sub: 'Verified capital allocators', trend: '+8.2%', up: true, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Project Creators', value: '184', sub: 'Approved heritage founders', trend: '+15.0%', up: true, color: '#6366F1', bg: '#F0F0FF' },
    { label: 'Total Transactions', value: '22,410', sub: 'Platform-wide ledger entries', trend: '+24.1%', up: true, color: '#D4AF37', bg: '#FFFBEB' },
    { label: 'Total Funds Raised', value: 'KSh 158.4M', sub: '≈ $1.2M USD', trend: '+18.0%', up: true, color: '#0B3D2E', bg: '#F0FDF4' },
    { label: 'Platform Revenue', value: 'KSh 4.2M', sub: '2.5% Fee Average', trend: '+22.3%', up: true, color: '#0A1F44', bg: '#F0F4FF' },
    { label: 'Pending Withdrawals', value: '12', sub: 'KSh 1.2M Volume', trend: 'Review', up: null, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Failed Transactions', value: '08', sub: 'Last 24 Hours', trend: '-3 vs Prev', up: false, color: '#EF4444', bg: '#FFF1F2' },
];

const weeklyData = [
    { day: 'Mon', count: 142, max: 215 },
    { day: 'Tue', count: 156, max: 215 },
    { day: 'Wed', count: 189, max: 215 },
    { day: 'Thu', count: 174, max: 215 },
    { day: 'Fri', count: 215, max: 215 },
    { day: 'Sat', count: 128, max: 215 },
    { day: 'Sun', count: 110, max: 215 },
];

const monthlyRevenue = [
    { month: 'Jan', value: 450000, max: 820000 },
    { month: 'Feb', value: 520000, max: 820000 },
    { month: 'Mar', value: 480000, max: 820000 },
    { month: 'Apr', value: 610000, max: 820000 },
    { month: 'May', value: 750000, max: 820000 },
    { month: 'Jun', value: 820000, max: 820000 },
];

const growthData = [100, 120, 115, 150, 180, 210, 240];

function trendColor(item) {
    if (item.up === true) return '#10B981';
    if (item.up === false) return '#EF4444';
    return '#F59E0B';
}

const Overview = () => {
    const [activeTab, setActiveTab] = useState('count');

    // Build a simple SVG sparkline for growth
    const maxG = Math.max(...growthData);
    const minG = Math.min(...growthData);
    const svgW = 220, svgH = 80;
    const points = growthData.map((v, i) => {
        const x = (i / (growthData.length - 1)) * svgW;
        const y = svgH - ((v - minG) / (maxG - minG)) * svgH;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 80 }}>

            {/* Page Header */}
            <div style={{
                background: '#fff',
                borderRadius: 28,
                padding: '28px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #F1F5F9',
                boxShadow: '0 4px 24px rgba(10,31,68,0.04)',
                flexWrap: 'wrap',
                gap: 16
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0A1F44', margin: 0, letterSpacing: '-0.5px' }}>
                        Executive Dashboard
                    </h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                        Platform Health &amp; Business Intelligence — Zamani Nodes
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        background: '#ECFDF5',
                        border: '1px solid #BBF7D0',
                        color: '#0B3D2E',
                        borderRadius: 12,
                        padding: '7px 16px',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
                        Live Sync
                    </div>
                    <div style={{
                        background: '#F8FAFC',
                        borderRadius: 12,
                        padding: '7px 16px',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#64748B',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        border: '1px solid #E2E8F0'
                    }}>
                        Feb 26, 2026
                    </div>
                </div>
            </div>

            {/* KPI Grid — Row 1 */}
            <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>
                    📊 Platform KPIs
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {kpis.map((kpi) => (
                        <div key={kpi.label} style={{
                            background: '#fff',
                            borderRadius: 20,
                            padding: '24px 24px',
                            border: '1px solid #F1F5F9',
                            boxShadow: '0 2px 16px rgba(10,31,68,0.04)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            borderLeft: `4px solid ${kpi.color}`,
                            cursor: 'default',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,31,68,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(10,31,68,0.04)'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: kpi.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 20
                                }}>
                                    {kpi.up === true ? '📈' : kpi.up === false ? '⚠️' : '🕐'}
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 800,
                                    color: trendColor(kpi),
                                    background: `${trendColor(kpi)}15`,
                                    padding: '4px 10px',
                                    borderRadius: 8,
                                    letterSpacing: '0.5px'
                                }}>
                                    {kpi.trend}
                                </span>
                            </div>
                            <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px 0' }}>
                                {kpi.label}
                            </p>
                            <h3 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
                                {kpi.value}
                            </h3>
                            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, margin: 0 }}>{kpi.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>
                    📈 Analytics &amp; Charts
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

                    {/* Daily Transactions Chart */}
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 32,
                        border: '1px solid #F1F5F9',
                        boxShadow: '0 2px 16px rgba(10,31,68,0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#0A1F44' }}>Daily Transactions</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>7-day volume throughput</p>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {['count', 'volume'].map(t => (
                                    <button key={t} onClick={() => setActiveTab(t)} style={{
                                        padding: '6px 14px', borderRadius: 10,
                                        border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 800,
                                        textTransform: 'uppercase', letterSpacing: '1px',
                                        background: activeTab === t ? '#0A1F44' : '#F8FAFC',
                                        color: activeTab === t ? '#fff' : '#94A3B8',
                                        transition: 'all 0.2s'
                                    }}>{t}</button>
                                ))}
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, padding: '0 8px' }}>
                            {weeklyData.map((d) => {
                                const pct = (d.count / d.max) * 100;
                                return (
                                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                                        <span style={{ fontSize: 10, fontWeight: 800, color: '#0A1F44' }}>{d.count}</span>
                                        <div style={{
                                            width: '100%',
                                            height: `${pct}%`,
                                            background: d.count === d.max
                                                ? 'linear-gradient(180deg, #0B3D2E, #10B981)'
                                                : 'linear-gradient(180deg, #0A1F44, #1E3A5F)',
                                            borderRadius: '8px 8px 4px 4px',
                                            minHeight: 8,
                                            transition: 'height 0.5s ease',
                                            position: 'relative'
                                        }} />
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>{d.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Diaspora vs Local Chart */}
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 32,
                        border: '1px solid #F1F5F9',
                        boxShadow: '0 2px 16px rgba(10,31,68,0.04)'
                    }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: 17, fontWeight: 900, color: '#0A1F44' }}>Market Source</h3>
                        <p style={{ margin: '0 0 28px 0', fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Diaspora vs Local payments</p>

                        {/* Donut via SVG */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                            <div style={{ position: 'relative', width: 160, height: 160 }}>
                                <svg width="160" height="160" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="62" fill="none" stroke="#F1F5F9" strokeWidth="22" />
                                    {/* Local (KES) - 32% */}
                                    <circle cx="80" cy="80" r="62" fill="none" stroke="#D4AF37" strokeWidth="22"
                                        strokeDasharray={`${(0.32 * 2 * Math.PI * 62).toFixed(1)} ${(2 * Math.PI * 62).toFixed(1)}`}
                                        strokeDashoffset="0"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
                                    />
                                    {/* Diaspora (USD) - 68% */}
                                    <circle cx="80" cy="80" r="62" fill="none" stroke="#0B3D2E" strokeWidth="22"
                                        strokeDasharray={`${(0.68 * 2 * Math.PI * 62).toFixed(1)} ${(2 * Math.PI * 62).toFixed(1)}`}
                                        strokeDashoffset={`${-(0.32 * 2 * Math.PI * 62).toFixed(1)}`}
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0A1F44', lineHeight: 1 }}>68%</div>
                                    <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: '1px', marginTop: 2 }}>USD</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Diaspora (USD)', pct: 68, color: '#0B3D2E' },
                                { label: 'Local (KES)', pct: 32, color: '#D4AF37' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{item.label}</span>
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 900, color: '#0A1F44' }}>{item.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Revenue Chart */}
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 32,
                        border: '1px solid #F1F5F9',
                        boxShadow: '0 2px 16px rgba(10,31,68,0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#0A1F44' }}>Monthly Revenue</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Aggregated fee collections</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160, padding: '0 8px' }}>
                            {monthlyRevenue.map((d) => {
                                const pct = (d.value / d.max) * 100;
                                return (
                                    <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                                        <div style={{
                                            width: '100%',
                                            height: `${pct}%`,
                                            background: 'linear-gradient(180deg, #0B3D2E, #10B981)',
                                            borderRadius: '8px 8px 4px 4px',
                                            minHeight: 8,
                                        }} />
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>{d.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Heritage Growth Card */}
                    <div style={{
                        background: '#0A1F44', borderRadius: 24, padding: 32,
                        boxShadow: '0 8px 40px rgba(10,31,68,0.3)', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: -60, right: -60,
                            width: 200, height: 200, borderRadius: '50%',
                            background: 'rgba(16,185,129,0.08)'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <span style={{ fontSize: 28 }}>📈</span>
                            <h3 style={{ margin: '12px 0 4px', fontSize: 17, fontWeight: 900, color: '#fff' }}>Investment Growth</h3>
                            <p style={{ margin: '0 0 24px', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                Heritage Streak Index
                            </p>

                            {/* SVG Sparkline */}
                            <div style={{ marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '16px 12px' }}>
                                <svg width="100%" height="70" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
                                    <polyline
                                        fill="none"
                                        stroke="#10B981"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={points}
                                    />
                                </svg>
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: 'rgba(255,255,255,0.06)',
                                borderRadius: 16, padding: '16px 20px',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}>
                                <div>
                                    <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>
                                        Current Velocity
                                    </p>
                                    <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>+240%</p>
                                </div>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: '#10B981',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 20
                                }}>↗</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Overview;
