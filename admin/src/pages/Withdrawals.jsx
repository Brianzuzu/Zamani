import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Pending');
    const [selected, setSelected] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null); // { action, item }

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/transactions`);
            // Filter the withdrawals from all transactions
            const wr = res.data.filter(t => t.type === 'Withdrawal');
            setWithdrawals(wr);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            showToast('Error fetching withdrawal requests', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openDrawer = (item) => { setSelected(item); setDrawerOpen(true); };
    const closeDrawer = () => setDrawerOpen(false);

    const filtered = activeTab === 'All' ? withdrawals : withdrawals.filter(w => w.status === activeTab);

    // Summary stats
    const pendingCount = withdrawals.filter(w => w.status === 'Pending').length;
    const pendingVol = 'KSh ' + withdrawals.filter(w => w.status === 'Pending').reduce((acc, w) => acc + w.amount, 0).toLocaleString();
    const completedCount = withdrawals.filter(w => w.status === 'Completed').length;
    const completedVol = 'KSh ' + withdrawals.filter(w => w.status === 'Completed').reduce((acc, w) => acc + w.amount, 0).toLocaleString();
    
    // Total platform commission is not fully tracked here yet, maybe we just show overall from transactions
    const totalCommission = 'KSh ' + (withdrawals.filter(w => w.status === 'Completed').reduce((acc, w) => acc + w.amount, 0) * 0.02).toLocaleString();
    const processingCount = withdrawals.filter(w => w.status === 'Processing').length;

    const handleAction = (action, item) => {
        setConfirmModal({ action, item });
    };

    const confirmAction = async () => {
        const { action, item } = confirmModal;
        setConfirmModal(null);
        
        let newStatus = '';
        if (action === 'approve') newStatus = 'Completed';
        else if (action === 'reject') newStatus = 'Rejected';
        else if (action === 'process') newStatus = 'Processing';

        try {
            await axios.patch(`${API_URL}/transactions/${item._id}/status`, { status: newStatus });
            showToast(action === 'approve' ? `✅ Approved and completed` : action === 'reject' ? `⛔ Rejected` : `⟳ Processing`, action === 'reject' ? 'danger' : 'success');
            closeDrawer();
            fetchWithdrawals(); // Reload
        } catch (error) {
            showToast('Failed to update status', 'danger');
        }
    };

    function statusStyle(s) {
        if (s === 'Pending') return { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', label: '🕐 Pending' };
        if (s === 'Completed') return { bg: '#ECFDF5', color: '#065F46', dot: '#10B981', label: '✓ Completed' };
        if (s === 'Rejected') return { bg: '#FFF1F2', color: '#9F1239', dot: '#EF4444', label: '✕ Rejected' };
        if (s === 'Processing') return { bg: '#EFF6FF', color: '#1E40AF', dot: '#3B82F6', label: '⟳ Processing' };
        return { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8', label: s };
    }

    function methodStyle(m) {
        if (m === 'M-Pesa') return { bg: '#F0FDF4', color: '#166534', icon: '📱' };
        return { bg: '#FFF7ED', color: '#C2410C', icon: '🏦' };
    }

    const TABS = ['Pending', 'Processing', 'Completed', 'Rejected', 'All'];

    const handleAction = (action, item) => {
        setConfirmModal({ action, item });
    };

    const confirmAction = () => {
        const { action, item } = confirmModal;
        setConfirmModal(null);
        closeDrawer();
        if (action === 'approve') showToast(`✅ ${item.id} approved — payout initiated via ${item.method}`);
        else if (action === 'reject') showToast(`⛔ ${item.id} has been rejected and user notified`, 'danger');
        else if (action === 'process') showToast(`⟳ ${item.id} is now being processed via ${item.method}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80, position: 'relative' }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 9999,
                    background: toast.type === 'success' ? '#0B3D2E' : '#9F1239',
                    color: '#fff', borderRadius: 16, padding: '14px 24px',
                    fontSize: 13, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Confirm Modal */}
            {confirmModal && (
                <>
                    <div onClick={() => setConfirmModal(null)} style={{
                        position: 'fixed', inset: 0, background: 'rgba(10,31,68,0.5)', zIndex: 200, backdropFilter: 'blur(4px)'
                    }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                        background: '#fff', borderRadius: 24, padding: '36px 40px', zIndex: 201,
                        width: 420, boxShadow: '0 24px 80px rgba(10,31,68,0.2)'
                    }}>
                        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>
                            {confirmModal.action === 'approve' ? '✅' : confirmModal.action === 'reject' ? '⛔' : '⟳'}
                        </div>
                        <h3 style={{ textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#0A1F44', margin: '0 0 8px' }}>
                            {confirmModal.action === 'approve' ? 'Approve Payout' : confirmModal.action === 'reject' ? 'Reject Withdrawal' : 'Process Payout'}
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', margin: '0 0 8px' }}>
                            {confirmModal.item.user} · {confirmModal.item.amount}
                        </p>
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', margin: '0 0 28px' }}>
                            {confirmModal.action === 'approve'
                                ? `Net payout of ${confirmModal.item.net} will be sent via ${confirmModal.item.method}.`
                                : confirmModal.action === 'reject'
                                    ? 'The user will be notified and funds returned to their wallet.'
                                    : `Payment will be initiated via ${confirmModal.item.method}.`}
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setConfirmModal(null)} style={{
                                flex: 1, background: '#F1F5F9', color: '#475569', border: 'none',
                                borderRadius: 14, padding: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer'
                            }}>Cancel</button>
                            <button onClick={confirmAction} style={{
                                flex: 1, border: 'none', borderRadius: 14, padding: 14, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                                background: confirmModal.action === 'reject' ? '#EF4444' : '#0B3D2E',
                                color: '#fff'
                            }}>Confirm</button>
                        </div>
                    </div>
                </>
            )}

            {/* Header */}
            <div style={{
                background: '#fff', borderRadius: 24, padding: '28px 32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)',
                flexWrap: 'wrap', gap: 16
            }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0 }}>Withdrawal & Payout</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                        Approve, process, and track all platform withdrawal requests.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => showToast('Payout history exported to CSV')} style={{
                        background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0A1F44',
                        borderRadius: 14, padding: '11px 20px', fontSize: 12, fontWeight: 800,
                        cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px'
                    }}>↓ Export</button>
                    <button onClick={() => showToast('Batch processing initiated for all pending requests')} style={{
                        background: '#0B3D2E', color: '#fff', border: 'none', borderRadius: 14,
                        padding: '11px 20px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                        textTransform: 'uppercase', letterSpacing: '1px'
                    }}>⚡ Batch Process</button>
                </div>
            </div>

            {/* Critical Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    {
                        label: 'Pending Withdrawals', value: pendingCount, sub: pendingVol + ' total',
                        icon: '🕐', color: '#92400E', bg: '#FFFBEB', border: '#F59E0B', urgent: true
                    },
                    {
                        label: 'Processing Now', value: processingCount, sub: 'In transit',
                        icon: '⟳', color: '#1E40AF', bg: '#EFF6FF', border: '#3B82F6'
                    },
                    {
                        label: 'Completed Today', value: completedCount, sub: completedVol + ' paid out',
                        icon: '✅', color: '#065F46', bg: '#ECFDF5', border: '#10B981'
                    },
                    {
                        label: 'Platform Commission', value: totalCommission, sub: '2% on all payouts',
                        icon: '💰', color: '#0A1F44', bg: '#F0F4FF', border: '#0A1F44'
                    },
                ].map(s => (
                    <div key={s.label} style={{
                        background: s.bg, borderRadius: 20, padding: '24px',
                        border: `1.5px solid ${s.border}30`,
                        borderLeft: `4px solid ${s.border}`,
                        position: 'relative', overflow: 'hidden'
                    }}>
                        {s.urgent && (
                            <div style={{
                                position: 'absolute', top: 12, right: 12,
                                background: '#EF4444', color: '#fff', borderRadius: 99,
                                fontSize: 9, fontWeight: 900, padding: '3px 8px',
                                textTransform: 'uppercase', letterSpacing: '1px'
                            }}>Action Needed</div>
                        )}
                        <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.label}</p>
                        <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900, color: '#0A1F44' }}>{s.value}</h3>
                        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 4, borderRadius: 16, width: 'fit-content' }}>
                {TABS.map(t => {
                    const count = t === 'All' ? WITHDRAWALS.length : WITHDRAWALS.filter(w => w.status === t).length;
                    return (
                        <button key={t} onClick={() => setActiveTab(t)} style={{
                            padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 800, transition: 'all 0.2s',
                            background: activeTab === t ? '#fff' : 'transparent',
                            color: activeTab === t ? '#0A1F44' : '#94A3B8',
                            boxShadow: activeTab === t ? '0 2px 8px rgba(10,31,68,0.08)' : 'none',
                            display: 'flex', alignItems: 'center', gap: 6
                        }}>
                            {t}
                            <span style={{
                                background: activeTab === t ? (t === 'Pending' ? '#F59E0B' : '#0A1F44') : '#E2E8F0',
                                color: activeTab === t ? '#fff' : '#94A3B8',
                                borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 900
                            }}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Withdrawal Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.length === 0 && (
                    <div style={{ background: '#fff', borderRadius: 20, padding: 48, textAlign: 'center', border: '1px solid #F1F5F9' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>No {activeTab.toLowerCase()} withdrawals</p>
                    </div>
                )}
                {filtered.map(w => {
                    const st = statusStyle(w.status);
                    const mt = methodStyle(w.method);
                    return (
                        <div key={w.id} style={{
                            background: '#fff', borderRadius: 20,
                            border: w.status === 'Pending' ? '1.5px solid #FDE68A' : '1px solid #F1F5F9',
                            boxShadow: w.status === 'Pending' ? '0 4px 20px rgba(245,158,11,0.08)' : '0 2px 12px rgba(10,31,68,0.04)',
                            overflow: 'hidden'
                        }}>
                            {w.status === 'Pending' && (
                                <div style={{
                                    background: 'linear-gradient(90deg, #FFFBEB, #FEF3C7)',
                                    padding: '8px 24px', fontSize: 10, fontWeight: 900,
                                    color: '#92400E', textTransform: 'uppercase', letterSpacing: '1.5px',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    borderBottom: '1px solid #FDE68A'
                                }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                                    Awaiting Admin Approval · Requested {w.requestedAt}
                                </div>
                            )}

                            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                                    background: '#F0F4FF', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#0A1F44'
                                }}>{w.user?.name?.charAt(0) || 'U'}</div>

                                {/* User info */}
                                <div style={{ flex: 1, minWidth: 160 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0A1F44' }}>{w.user?.name || 'Unknown User'}</p>
                                        <span style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{w.reference}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{w.user?.email} · {w.metadata?.country || 'Kenya'}</p>
                                    <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{w.description}</p>
                                </div>

                                {/* Method */}
                                <div style={{ textAlign: 'center', minWidth: 100 }}>
                                    <span style={{
                                        background: mt.bg, color: mt.color, borderRadius: 10,
                                        padding: '6px 12px', fontSize: 11, fontWeight: 800,
                                        display: 'flex', alignItems: 'center', gap: 5
                                    }}>{mt.icon} {w.method}</span>
                                    <p style={{ margin: '6px 0 0', fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{w.metadata?.phoneNumber || w.metadata?.bankDetails || '—'}</p>
                                </div>

                                {/* Amount breakdown */}
                                <div style={{ textAlign: 'right', minWidth: 140 }}>
                                    <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0A1F44' }}>KSh {w.amount.toLocaleString()}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 10, color: '#94A3B8' }}>
                                        Fee (2%): <span style={{ color: '#EF4444', fontWeight: 700 }}>−KSh {(w.amount * 0.02).toLocaleString()}</span>
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 800, color: '#10B981' }}>
                                        Net: KSh {(w.amount * 0.98).toLocaleString()}
                                    </p>
                                </div>

                                {/* Status */}
                                <span style={{
                                    fontSize: 11, fontWeight: 800, color: st.color, background: st.bg,
                                    padding: '7px 14px', borderRadius: 10, whiteSpace: 'nowrap',
                                    display: 'flex', alignItems: 'center', gap: 6
                                }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot }} />
                                    {w.status}
                                </span>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {w.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleAction('approve', w)} style={{
                                                background: '#ECFDF5', color: '#065F46', border: '1.5px solid #A7F3D0',
                                                borderRadius: 12, padding: '9px 16px', fontSize: 12, fontWeight: 800,
                                                cursor: 'pointer', whiteSpace: 'nowrap'
                                            }}>✅ Approve</button>
                                            <button onClick={() => handleAction('reject', w)} style={{
                                                background: '#FFF1F2', color: '#9F1239', border: '1.5px solid #FECDD3',
                                                borderRadius: 12, padding: '9px 16px', fontSize: 12, fontWeight: 800,
                                                cursor: 'pointer', whiteSpace: 'nowrap'
                                            }}>⛔ Reject</button>
                                        </>
                                    )}
                                    {w.status === 'Processing' && (
                                        <button onClick={() => handleAction('process', w)} style={{
                                            background: '#EFF6FF', color: '#1E40AF', border: '1.5px solid #BFDBFE',
                                            borderRadius: 12, padding: '9px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer'
                                        }}>⟳ Process Now</button>
                                    )}
                                    <button onClick={() => openDrawer(w)} style={{
                                        background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0',
                                        borderRadius: 12, padding: '9px 14px', fontSize: 13, fontWeight: 800, cursor: 'pointer'
                                    }}>···</button>
                                </div>
                            </div>

                            {/* Completed/Rejected footer */}
                            {(w.status === 'Completed' || w.status === 'Rejected') && w.processedAt && (
                                <div style={{
                                    background: '#F8FAFC', padding: '10px 24px', borderTop: '1px solid #F1F5F9',
                                    fontSize: 11, color: '#94A3B8', fontWeight: 600,
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <span>Requested: {new Date(w.createdAt).toLocaleString()}</span>
                                    <span>{w.status === 'Completed' ? 'Processed' : 'Rejected'}: {new Date(w.updatedAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Side Drawer */}
            {drawerOpen && selected && (
                <>
                    <div onClick={closeDrawer} style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,68,0.4)', zIndex: 100, backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'fixed', top: 0, right: 0, height: '100vh', width: 460,
                        background: '#fff', zIndex: 101, boxShadow: '-20px 0 60px rgba(10,31,68,0.15)',
                        display: 'flex', flexDirection: 'column', overflowY: 'auto'
                    }}>
                        {/* Drawer Header */}
                        <div style={{ background: '#0A1F44', padding: '28px', position: 'relative' }}>
                            <button onClick={closeDrawer} style={{
                                position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)',
                                border: 'none', color: '#fff', width: 34, height: 34, borderRadius: 10,
                                cursor: 'pointer', fontSize: 16
                            }}>✕</button>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px' }}>Withdrawal Detail</p>
                            <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 900 }}>KSh {selected.amount.toLocaleString()}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', fontSize: 13 }}>{selected.user?.name} · {selected.reference}</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{
                                    background: statusStyle(selected.status).bg, color: statusStyle(selected.status).color,
                                    borderRadius: 8, padding: '5px 12px', fontSize: 10, fontWeight: 800
                                }}>{selected.status}</span>
                                <span style={{ background: methodStyle(selected.method).bg, color: methodStyle(selected.method).color, borderRadius: 8, padding: '5px 12px', fontSize: 10, fontWeight: 800 }}>
                                    {methodStyle(selected.method).icon} {selected.method}
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '28px', flex: 1 }}>
                            {/* Amount Breakdown */}
                            <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '20px', marginBottom: 24, border: '1px solid #F1F5F9' }}>
                                <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Amount Breakdown</p>
                                {[
                                    { label: 'Gross Amount', value: `KSh ${selected.amount.toLocaleString()}`, color: '#0A1F44' },
                                    { label: 'Platform Commission (2%)', value: `−KSh ${(selected.amount * 0.02).toLocaleString()}`, color: '#EF4444' },
                                    { label: 'Net Payout Amount', value: `KSh ${(selected.amount * 0.98).toLocaleString()}`, color: '#10B981' },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{row.label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 900, color: row.color }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0A1F44' }}>Destination</span>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0A1F44' }}>{selected.metadata?.phoneNumber || selected.metadata?.bankDetails}</span>
                                </div>
                            </div>

                            {/* User + Request Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                                {[
                                    { label: 'Request ID', value: selected.reference },
                                    { label: 'Description', value: selected.description },
                                    { label: 'Email', value: selected.user?.email },
                                    { label: 'Country', value: selected.metadata?.country || 'Kenya' },
                                    { label: 'Requested', value: new Date(selected.createdAt).toLocaleString() },
                                    { label: 'Last Updated', value: new Date(selected.updatedAt).toLocaleString() },
                                ].map(d => (
                                    <div key={d.label} style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px 14px', border: '1px solid #F1F5F9' }}>
                                        <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{d.label}</p>
                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#0A1F44' }}>{d.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            {selected.status === 'Pending' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Admin Actions</p>
                                    <button onClick={() => handleAction('approve', selected)} style={{
                                        background: 'linear-gradient(135deg, #0B3D2E, #10B981)', color: '#fff',
                                        border: 'none', borderRadius: 14, padding: '14px', fontSize: 13, fontWeight: 800,
                                        cursor: 'pointer', textAlign: 'center'
                                    }}>✅ Approve & Process {selected.method} Payout</button>
                                    <button onClick={() => handleAction('reject', selected)} style={{
                                        background: '#FFF1F2', color: '#9F1239', border: '1.5px solid #FECDD3',
                                        borderRadius: 14, padding: '14px', fontSize: 13, fontWeight: 800,
                                        cursor: 'pointer', textAlign: 'center'
                                    }}>⛔ Reject & Return Funds to Wallet</button>
                                    <button onClick={() => showToast(`Verification request sent to ${selected.email}`)} style={{
                                        background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0',
                                        borderRadius: 14, padding: '14px', fontSize: 13, fontWeight: 800,
                                        cursor: 'pointer', textAlign: 'center'
                                    }}>📧 Request Additional Verification</button>
                                </div>
                            )}
                            {selected.status === 'Processing' && (
                                <button onClick={() => handleAction('process', selected)} style={{
                                    width: '100%', background: '#EFF6FF', color: '#1E40AF',
                                    border: '1.5px solid #BFDBFE', borderRadius: 14, padding: '14px',
                                    fontSize: 13, fontWeight: 800, cursor: 'pointer'
                                }}>⟳ Force Process Payout Now</button>
                            )}
                            {(selected.status === 'Completed' || selected.status === 'Rejected') && (
                                <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '20px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>{selected.status === 'Completed' ? '✅' : '⛔'}</div>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>
                                        {selected.status === 'Completed' ? 'Payout Completed' : 'Withdrawal Rejected'}
                                    </p>
                                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94A3B8' }}>Processed: {selected.processedAt}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Withdrawals;
