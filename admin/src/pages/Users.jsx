import { useState } from 'react';

const MOCK_USERS = [
    {
        id: 'ZM-0001', name: 'Brian Mwangi', email: 'brian@zamani.com', phone: '+254712345678',
        country: 'Kenya', role: 'Super Admin', kyc: 'Approved', invested: 'KSh 12.4M',
        balance: 'KSh 2.1M', status: 'Active', joined: 'Jan 2024',
    },
    {
        id: 'ZM-0042', name: 'Sarah Kimani', email: 'sarah@mail.com', phone: '+254798001234',
        country: 'Kenya', role: 'Verified Investor', kyc: 'Approved', invested: 'KSh 4.2M',
        balance: 'KSh 480K', status: 'Active', joined: 'Mar 2024',
    },
    {
        id: 'ZM-0089', name: 'James Ochieng', email: 'james@outlook.com', phone: '+447911123456',
        country: 'UK', role: 'Investor', kyc: 'In Review', invested: 'KSh 800K',
        balance: 'KSh 120K', status: 'Pending', joined: 'Jun 2024',
    },
    {
        id: 'ZM-0101', name: 'Amira Hassan', email: 'amira@gmail.com', phone: '+12128001234',
        country: 'USA', role: 'Investor', kyc: 'Approved', invested: 'KSh 6.8M',
        balance: 'KSh 940K', status: 'Active', joined: 'Feb 2024',
    },
    {
        id: 'ZM-0145', name: 'Mark Kamau', email: 'mark@africa.com', phone: '+254720991234',
        country: 'Kenya', role: 'Project Owner', kyc: 'Flagged', invested: 'KSh 0',
        balance: 'KSh 320K', status: 'Suspended', joined: 'Aug 2024',
    },
    {
        id: 'ZM-0178', name: 'Grace Wanjiku', email: 'grace@wanjiku.co.ke', phone: '+254733441234',
        country: 'Kenya', role: 'Project Owner', kyc: 'Approved', invested: 'KSh 1.1M',
        balance: 'KSh 210K', status: 'Active', joined: 'Oct 2024',
    },
    {
        id: 'ZM-0203', name: 'David Mensah', email: 'david@ghana.com', phone: '+233240001234',
        country: 'Ghana', role: 'Investor', kyc: 'Pending', invested: 'KSh 0',
        balance: 'KSh 50K', status: 'Pending', joined: 'Nov 2024',
    },
    {
        id: 'ZM-0214', name: 'Fatima Omar', email: 'fatima@dubai.ae', phone: '+97150001234',
        country: 'UAE', role: 'Verified Investor', kyc: 'Approved', invested: 'KSh 9.2M',
        balance: 'KSh 3.4M', status: 'Active', joined: 'Dec 2023',
    },
];

const ROLES = ['All Roles', 'Investor', 'Verified Investor', 'Project Owner', 'Super Admin'];
const STATUSES = ['All', 'Active', 'Pending', 'Suspended', 'Banned'];

function kycColor(kyc) {
    if (kyc === 'Approved') return { bg: '#ECFDF5', color: '#065F46', dot: '#10B981' };
    if (kyc === 'In Review') return { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' };
    if (kyc === 'Flagged') return { bg: '#FFF1F2', color: '#9F1239', dot: '#EF4444' };
    return { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' };
}

function statusColor(s) {
    if (s === 'Active') return { bg: '#ECFDF5', color: '#065F46' };
    if (s === 'Pending') return { bg: '#FFFBEB', color: '#92400E' };
    if (s === 'Suspended') return { bg: '#FFF1F2', color: '#9F1239' };
    if (s === 'Banned') return { bg: '#1F2937', color: '#F87171' };
    return { bg: '#F1F5F9', color: '#475569' };
}

const Users = () => {
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('name');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filtered = MOCK_USERS.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (searchField === 'name' && u.name.toLowerCase().includes(q)) ||
            (searchField === 'email' && u.email.toLowerCase().includes(q)) ||
            (searchField === 'phone' && u.phone.includes(q)) ||
            (searchField === 'country' && u.country.toLowerCase().includes(q));
        const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const openDrawer = (user) => { setSelectedUser(user); setDrawerOpen(true); };
    const closeDrawer = () => setDrawerOpen(false);

    // Stats
    const total = MOCK_USERS.length;
    const active = MOCK_USERS.filter(u => u.status === 'Active').length;
    const kycApproved = MOCK_USERS.filter(u => u.kyc === 'Approved').length;
    const flagged = MOCK_USERS.filter(u => u.kyc === 'Flagged' || u.status === 'Suspended').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80, position: 'relative' }}>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 9999,
                    background: toast.type === 'success' ? '#0B3D2E' : '#9F1239',
                    color: '#fff', borderRadius: 16, padding: '14px 24px',
                    fontSize: 13, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    animation: 'slideIn 0.3s ease'
                }}>
                    <span>{toast.type === 'success' ? '✓' : '⚠'}</span> {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div style={{
                background: '#fff', borderRadius: 24, padding: '28px 32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)',
                flexWrap: 'wrap', gap: 16
            }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0, letterSpacing: '-0.5px' }}>
                        Member Directory
                    </h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                        Search, manage, and control all platform users.
                    </p>
                </div>
                <button
                    style={{
                        background: '#0B3D2E', color: '#fff', border: 'none', borderRadius: 14,
                        padding: '12px 24px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                        textTransform: 'uppercase', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: 8
                    }}
                    onClick={() => showToast('Provision flow coming soon')}
                >
                    ＋ Provision Member
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Members', value: total, icon: '👥', color: '#0A1F44', bg: '#EFF6FF' },
                    { label: 'Active Users', value: active, icon: '✅', color: '#065F46', bg: '#ECFDF5' },
                    { label: 'KYC Approved', value: kycApproved, icon: '🛡️', color: '#1D4ED8', bg: '#EFF6FF' },
                    { label: 'Risk Flagged', value: flagged, icon: '⚠️', color: '#9F1239', bg: '#FFF1F2' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 20, padding: '22px 24px',
                        border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(10,31,68,0.04)',
                        borderLeft: `4px solid ${s.color}`
                    }}>
                        <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px' }}>{s.label}</p>
                        <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0A1F44', margin: 0 }}>{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div style={{
                background: '#fff', borderRadius: 20, padding: '20px 24px',
                border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(10,31,68,0.04)',
                display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'
            }}>
                {/* Search field selector */}
                <select
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    style={{
                        border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '10px 16px',
                        fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none',
                        cursor: 'pointer', background: '#F8FAFC', width: 140
                    }}
                >
                    <option value="name">Search by Name</option>
                    <option value="email">Search by Email</option>
                    <option value="phone">Search by Phone</option>
                    <option value="country">Search by Country</option>
                </select>

                {/* Search input */}
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: 16 }}>🔍</span>
                    <input
                        type="text"
                        placeholder={`Search by ${searchField}...`}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 12,
                            padding: '10px 16px 10px 40px', fontSize: 13, fontWeight: 500,
                            color: '#0A1F44', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Role filter */}
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{
                        border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '10px 16px',
                        fontSize: 12, fontWeight: 700, color: '#0A1F44', outline: 'none',
                        cursor: 'pointer', background: '#F8FAFC', width: 160
                    }}
                >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {/* Status filter */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            style={{
                                padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                                background: statusFilter === s ? '#0A1F44' : '#F1F5F9',
                                color: statusFilter === s ? '#fff' : '#94A3B8',
                                transition: 'all 0.2s'
                            }}
                        >{s}</button>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>
                    {filtered.length} results
                </div>
            </div>

            {/* User Table */}
            <div style={{
                background: '#fff', borderRadius: 24,
                border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)',
                overflow: 'hidden'
            }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 100px 110px 110px 100px 110px 130px',
                    padding: '14px 24px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #F1F5F9'
                }}>
                    {['User ID', 'Member', 'Role', 'KYC Status', 'Invested', 'Balance', 'Country', 'Actions'].map(h => (
                        <span key={h} style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{h}</span>
                    ))}
                </div>

                {/* Table Rows */}
                {filtered.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8', fontWeight: 600 }}>
                        No members match your search criteria.
                    </div>
                ) : filtered.map((user, idx) => {
                    const kyc = kycColor(user.kyc);
                    const st = statusColor(user.status);
                    return (
                        <div
                            key={user.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr 100px 110px 110px 100px 110px 130px',
                                padding: '18px 24px',
                                borderBottom: idx < filtered.length - 1 ? '1px solid #F8FAFC' : 'none',
                                alignItems: 'center',
                                transition: 'background 0.15s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            onClick={() => openDrawer(user)}
                        >
                            {/* User ID */}
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace' }}>{user.id}</span>

                            {/* Member */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                    background: `hsl(${user.id.slice(-3) * 1.2}deg 40% 92%)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 900, color: '#0A1F44'
                                }}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>{user.name}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{user.email}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <span style={{
                                fontSize: 10, fontWeight: 800, color: '#0A1F44',
                                background: '#F1F5F9', borderRadius: 8, padding: '5px 10px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block'
                            }}>
                                {user.role}
                            </span>

                            {/* KYC Status */}
                            <span style={{
                                fontSize: 10, fontWeight: 800, color: kyc.color,
                                background: kyc.bg, borderRadius: 8, padding: '5px 10px',
                                display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content'
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: kyc.dot, flexShrink: 0 }} />
                                {user.kyc}
                            </span>

                            {/* Invested */}
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#0A1F44' }}>{user.invested}</span>

                            {/* Balance */}
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{user.balance}</span>

                            {/* Country */}
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{user.country}</span>

                            {/* Quick actions */}
                            <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => openDrawer(user)}
                                    style={{
                                        background: '#0A1F44', color: '#fff', border: 'none', borderRadius: 10,
                                        padding: '7px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                                    }}
                                >View</button>
                                <button
                                    onClick={() => showToast(`${user.name} suspended`, 'danger')}
                                    style={{
                                        background: '#FFF1F2', color: '#9F1239', border: '1px solid #FECDD3',
                                        borderRadius: 10, padding: '7px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                                    }}
                                >⛔</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Side Drawer */}
            {drawerOpen && selectedUser && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={closeDrawer}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(10,31,68,0.4)',
                            zIndex: 100, backdropFilter: 'blur(4px)'
                        }}
                    />
                    {/* Drawer Panel */}
                    <div style={{
                        position: 'fixed', top: 0, right: 0, height: '100vh',
                        width: 440, background: '#fff', zIndex: 101,
                        boxShadow: '-20px 0 60px rgba(10,31,68,0.15)',
                        display: 'flex', flexDirection: 'column', overflowY: 'auto'
                    }}>
                        {/* Drawer Header */}
                        <div style={{ background: '#0A1F44', padding: '32px 32px 28px', position: 'relative' }}>
                            <button onClick={closeDrawer} style={{
                                position: 'absolute', top: 20, right: 20,
                                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                                width: 36, height: 36, borderRadius: 10, cursor: 'pointer', fontSize: 16,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>✕</button>

                            <div style={{
                                width: 64, height: 64, borderRadius: 20,
                                background: `hsl(${selectedUser.id.slice(-3) * 1.2}deg 40% 85%)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28, fontWeight: 900, color: '#0A1F44', marginBottom: 16
                            }}>
                                {selectedUser.name.charAt(0)}
                            </div>
                            <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 20, fontWeight: 900 }}>{selectedUser.name}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', fontSize: 13 }}>{selectedUser.email}</p>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{
                                    background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
                                    borderRadius: 8, padding: '5px 12px', fontSize: 10,
                                    fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
                                }}>{selectedUser.role}</span>
                                <span style={{
                                    background: kycColor(selectedUser.kyc).bg, color: kycColor(selectedUser.kyc).color,
                                    borderRadius: 8, padding: '5px 12px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
                                }}>{selectedUser.kyc}</span>
                            </div>
                        </div>

                        {/* Drawer Body */}
                        <div style={{ padding: '28px 32px', flex: 1 }}>
                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                                {[
                                    { label: 'User ID', value: selectedUser.id },
                                    { label: 'Phone', value: selectedUser.phone },
                                    { label: 'Country', value: selectedUser.country },
                                    { label: 'Joined', value: selectedUser.joined },
                                    { label: 'Total Invested', value: selectedUser.invested },
                                    { label: 'Account Balance', value: selectedUser.balance },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        background: '#F8FAFC', borderRadius: 14, padding: '14px 16px',
                                        border: '1px solid #F1F5F9'
                                    }}>
                                        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{item.label}</p>
                                        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0A1F44' }}>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Account Status */}
                            <div style={{ marginBottom: 28 }}>
                                <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Account Status</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {STATUSES.filter(s => s !== 'All').map(s => {
                                        const sc = statusColor(s);
                                        const isActive = selectedUser.status === s;
                                        return (
                                            <button key={s} style={{
                                                padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: 800,
                                                border: isActive ? 'none' : '1.5px solid #E2E8F0',
                                                background: isActive ? sc.bg : '#fff',
                                                color: isActive ? sc.color : '#94A3B8',
                                                textTransform: 'uppercase', letterSpacing: '0.5px'
                                            }}
                                                onClick={() => showToast(`Status change to "${s}" — API integration pending`)}
                                            >{s}</button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Role Upgrade */}
                            <div style={{ marginBottom: 28 }}>
                                <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Role Management</p>
                                <div style={{
                                    background: '#F8FAFC', borderRadius: 14, padding: '16px',
                                    border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 800, color: '#0A1F44' }}>Current: {selectedUser.role}</p>
                                        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Upgrade to Verified Investor</p>
                                    </div>
                                    <button
                                        onClick={() => showToast(`Role upgrade initiated for ${selectedUser.name}`)}
                                        style={{
                                            background: 'linear-gradient(135deg, #0B3D2E, #10B981)',
                                            color: '#fff', border: 'none', borderRadius: 10,
                                            padding: '9px 16px', fontSize: 11, fontWeight: 800,
                                            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px'
                                        }}
                                    >Upgrade ↑</button>
                                </div>
                            </div>

                            {/* Admin Actions */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Admin Actions</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <ActionButton
                                        label="🔑 Reset Password"
                                        color="#0A1F44"
                                        bg="#EFF6FF"
                                        onClick={() => showToast(`Password reset email sent to ${selectedUser.email}`)}
                                    />
                                    <ActionButton
                                        label="⛔ Suspend Account"
                                        color="#92400E"
                                        bg="#FFFBEB"
                                        onClick={() => showToast(`${selectedUser.name}'s account has been suspended`, 'danger')}
                                    />
                                    <ActionButton
                                        label="🚫 Ban Account"
                                        color="#9F1239"
                                        bg="#FFF1F2"
                                        onClick={() => showToast(`${selectedUser.name} has been banned`, 'danger')}
                                    />
                                    <ActionButton
                                        label="📄 View KYC Documents"
                                        color="#1E40AF"
                                        bg="#EFF6FF"
                                        onClick={() => showToast('KYC document viewer coming in next module')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const ActionButton = ({ label, color, bg, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: bg, color, border: `1px solid ${color}25`,
            borderRadius: 12, padding: '13px 18px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 8
        }}
        onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = color; }}
    >
        {label}
    </button>
);

export default Users;
