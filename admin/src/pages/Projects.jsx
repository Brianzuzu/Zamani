import axios from 'axios';
import { useEffect, useState } from 'react';
import API_URL from '../config';

const CATEGORIES = ['All', 'Managed Lands', 'Build or Buy a House', 'Vehicle Sourcing', 'Utilities and Products', 'Business Opps'];
const STATUSES = ['All', 'Active', 'Completed', 'Draft', 'Closed'];

function statusStyle(s) {
    if (s === 'Active') return { bg: '#ECFDF5', color: '#065F46', dot: '#10B981' };
    if (s === 'Completed') return { bg: '#E0F2FE', color: '#075985', dot: '#38BDF8' };
    if (s === 'Closed') return { bg: '#FEF2F2', color: '#991B1B', dot: '#F87171' };
    return { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' };
}

function categoryIcon(c) {
    if (c === 'Managed Lands') return '🗺️';
    if (c === 'Build or Buy a House') return '🏢';
    if (c === 'Vehicle Sourcing') return '🚙';
    if (c === 'Utilities and Products') return '📦';
    if (c === 'Business Opps') return '💡';
    return '📁';
}

function categoryColor(c) {
    if (c === 'Managed Lands') return { bg: '#F0FDF4', color: '#166534' };
    if (c === 'Build or Buy a House') return { bg: '#EFF6FF', color: '#1E40AF' };
    if (c === 'Vehicle Sourcing') return { bg: '#FFFBEB', color: '#92400E' };
    if (c === 'Utilities and Products') return { bg: '#F5F3FF', color: '#6D28D9' };
    if (c === 'Business Opps') return { bg: '#FFF1F2', color: '#9F1239' };
    return { bg: '#F8FAFC', color: '#475569' };
}

const Projects = () => {
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [view, setView] = useState('grid');
    const [toast, setToast] = useState(null);
    const [projects, setProjects] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${API_URL}/projects`);
                const formatted = res.data.map(p => ({
                    id: p._id,
                    title: p.title,
                    category: p.category,
                    location: p.location,
                    region: p.region,
                    area: p.area,
                    roi: p.roi || p.metadata?.roi || p.metadata?.rentalYield || '-',
                    raised: p.metadata?.raised || 'KSh 0',
                    goal: p.price || (p.targetAmount ? `KSh ${p.targetAmount.toLocaleString()}` : '0'),
                    status: p.status || 'Active',
                    investors: p.investors || 0,
                    image: p.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
                    images: p.images || [],
                    description: p.description,
                    isHotDeal: p.isHotDeal,
                    metadata: p.metadata
                }));
                setProjects(formatted);
            } catch (err) {
                console.error('Error fetching projects:', err);
                toast_('Failed to fetch projects from backend', 'error');
            }
        };
        fetchProjects();
    }, []);

    // Add Form State
    const [formCat, setFormCat] = useState('Managed Lands');
    const [formData, setFormData] = useState({});
    const [editId, setEditId] = useState(null);

    const toast_ = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const filtered = projects.filter(p => (categoryFilter === 'All' || p.category === categoryFilter) && (statusFilter === 'All' || p.status === statusFilter));

    const handleInput = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

    const openEditModal = (p) => {
        setEditId(p.id);
        setFormCat(p.category);
        setFormData({
            title: p.title,
            location: p.location,
            region: p.region,
            area: p.area,
            priceNum: p.goal || p.price || p.targetAmount,
            goal: p.goal || p.price,
            images: p.images || (p.image ? [p.image] : []),
            isHotDeal: p.isHotDeal || false,
            ...p.metadata
        });
        setShowAddModal(true);
    };

    const submitProject = async () => {
        try {
            const projectPayload = {
                title: formData.title || 'Untitled',
                category: formCat,
                location: formData.location || (formCat === 'Business Opps' ? '' : 'N/A'),
                region: formData.region || (formCat === 'Business Opps' ? '' : 'Nairobi'),
                area: formData.area || '',
                description: formData.description || '',
                price: formData.goal || formData.price || formData.priceNum || '0',
                targetAmount: formData.priceNum || 0,
                roi: formData.roi || '-',
                image: (formData.images && formData.images.length > 0) ? formData.images[0] : '',
                images: formData.images || [],
                isHotDeal: formData.isHotDeal || false,
                status: 'Active',
                partner: {
                    name: formData.partner || 'Sema Real Estate Group',
                    logo: formData.images?.[0] || ''
                },
                metadata: {
                    ...formData,
                    partner: formData.partner || '',
                    phone: formData.phone || '',
                    email: formData.email || '',
                }
            };

            let res;
            if (editId) {
                // Determine token if available
                res = await axios.put(`${API_URL}/projects/${editId}`, projectPayload);
                toast_(`Successfully updated: ${res.data.title}`);
                setShowAddModal(false);
                setProjects(p => p.map(item => item.id === editId ? { ...item, ...res.data, id: editId } : item));
            } else {
                res = await axios.post(`${API_URL}/projects`, projectPayload);
                toast_(`Successfully created: ${res.data.title}`);
                setShowAddModal(false);
                setProjects(p => [{
                    id: res.data._id,
                    title: res.data.title,
                    category: res.data.category,
                    location: res.data.location,
                    region: res.data.region,
                    roi: res.data.roi || '-',
                    raised: 'KSh 0',
                    goal: res.data.price,
                    status: 'Funding',
                    investors: 0
                }, ...p]);
            }
            setFormData({});
            setEditId(null);
        } catch (err) {
            console.error('Error saving project to backend:', err);
            toast_('Failed to save project', 'error');

            // Fallback for visual continuity if backend fails testing
            setShowAddModal(false);
            if (editId) {
                setProjects(p => p.map(item => item.id === editId ? { ...item, title: formData.title || item.title, category: formCat, image: formData.image || item.image, goal: formData.goal || item.goal } : item));
            } else {
                setProjects(p => [{ id: `PRJ-${Math.floor(Math.random() * 1000)}`, title: formData.title || 'Untitled', category: formCat, location: formData.location || 'N/A', region: formData.region || 'Nairobi', roi: formData.roi || '-', raised: 'KSh 0', goal: formData.goal || '0', status: 'Funding', investors: 0 }, ...p]);
            }
            setFormData({});
            setEditId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        try {
            await axios.delete(`${API_URL}/projects/${id}`);
            toast_('Project deleted successfully');
            setProjects(p => p.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting project:', err);
            toast_('Failed to delete project', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80, position: 'relative' }}>
            {toast && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'success' ? '#0B3D2E' : '#9F1239', color: '#fff', borderRadius: 16, padding: '14px 24px', fontSize: 13, fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>{toast.msg}</div>}

            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 24, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0 }}>Venture Registry</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>Approve, manage, and track all investment projects on the platform.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', background: '#F8FAFC', borderRadius: 12, padding: 4, gap: 4 }}>
                        {['grid', 'table'].map(v => (
                            <button key={v} onClick={() => setView(v)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: view === v ? '#fff' : 'transparent', color: view === v ? '#0A1F44' : '#94A3B8', fontWeight: 800, fontSize: 12, boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{v === 'grid' ? '⊞ Grid' : '☰ Table'}</button>
                        ))}
                    </div>
                    <button onClick={() => { setEditId(null); setFormData({}); setFormCat('Managed Lands'); setShowAddModal(true); }} style={{ background: '#0B3D2E', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>＋ New Project</button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '16px 24px', border: '1px solid #F1F5F9', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Cat:</span>
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategoryFilter(c)} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, background: categoryFilter === c ? '#0A1F44' : '#F1F5F9', color: categoryFilter === c ? '#fff' : '#94A3B8' }}>{c === 'All' ? 'All' : `${categoryIcon(c)} ${c.split(' ')[0]}`}</button>
                ))}
                <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Status:</span>
                {STATUSES.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, background: statusFilter === s ? '#0A1F44' : '#F1F5F9', color: statusFilter === s ? '#fff' : '#94A3B8' }}>{s}</button>
                ))}
            </div>

            {/* Grid View */}
            {view === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                    {filtered.map(p => {
                        const st = statusStyle(p.status);
                        const cc = categoryColor(p.category);
                        return (
                            <div key={p.id} style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 2px 16px rgba(10,31,68,0.04)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    height: 180,
                                    background: `linear-gradient(rgba(10,31,68,0.3), rgba(10,31,68,0.8)), url(${p.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: 32 }}>{categoryIcon(p.category)}</span>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => openEditModal(p)} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={{ background: 'rgba(255,10,68,0.4)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>Delete</button>
                                            <span style={{ background: st.bg, color: st.color, borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800, height: 'fit-content' }}>{p.status}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 18, fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{p.title}</h3>
                                        <span style={{ background: cc.bg, color: cc.color, borderRadius: 6, padding: '4px 10px', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.category}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                                        {[{ l: 'Location', v: p.location }, { l: 'ROI', v: p.roi }, { l: 'Raised', v: p.raised }, { l: 'Goal', v: p.goal }].map(m => (
                                            <div key={m.l} style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px' }}>
                                                <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{m.l}</p>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#0A1F44' }}>{m.v}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Progress Bar */}
                                    {(() => {
                                        const raisedNum = parseFloat(p.raised.replace(/[^\d.]/g, '')) || 0;
                                        const goalNum = parseFloat(p.goal.replace(/[^\d.]/g, '')) || 1;
                                        const pct = Math.min(Math.round((raisedNum / goalNum) * 100), 100);
                                        return (
                                            <div style={{ marginTop: 8 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Funding Progress</span>
                                                    <span style={{ fontSize: 10, fontWeight: 900, color: '#0B3D2E' }}>{pct}%</span>
                                                </div>
                                                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #0B3D2E, #10B981)', borderRadius: 10 }} />
                                                </div>
                                            </div>
                                        );
                                    })()}
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
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', width: '35%' }}>Project</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Location</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>ROI</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Goal</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Progress</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => {
                                const st = statusStyle(p.status);
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                                                    <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1F44' }}>{p.title}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>{categoryIcon(p.category)} {p.category.split(' ')[0]}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 13, color: '#64748B' }}>{p.location}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>{p.roi}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: '#0A1F44' }}>{p.goal}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', width: 120 }}>
                                            {(() => {
                                                const raisedNum = parseFloat(p.raised.replace(/[^\d.]/g, '')) || 0;
                                                const goalNum = parseFloat(p.goal.replace(/[^\d.]/g, '')) || 1;
                                                const pct = Math.min(Math.round((raisedNum / goalNum) * 100), 100);
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${pct}%`, background: '#10B981' }} />
                                                        </div>
                                                        <span style={{ fontSize: 10, fontWeight: 800, color: '#0A1F44' }}>{pct}%</span>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ background: st.bg, color: st.color, borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800 }}>{p.status}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button onClick={() => openEditModal(p)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 800, color: '#0A1F44', cursor: 'pointer', transition: 'all 0.2s' }}>Edit</button>
                                                <button onClick={() => handleDelete(p.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 800, color: '#991B1B', cursor: 'pointer', transition: 'all 0.2s' }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8', fontSize: 14, fontWeight: 500 }}>No projects found matching these filters.</div>
                    )}
                </div>
            )}

            {/* ADD PROJECT MULTI-SECTOR MODAL */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={() => setShowAddModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,31,68,0.7)', backdropFilter: 'blur(8px)' }} />
                    <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 880, height: '90vh', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,0.3)' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A1F44', color: '#fff' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{editId ? 'Edit Listing' : 'Create New Listing'}</h2>
                                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{editId ? 'Update project details and settings' : 'Select a sector to view dynamic inputs'}</p>
                            </div>
                            <button onClick={() => { setShowAddModal(false); setEditId(null); setFormData({}); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', fontSize: 18 }}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                            {/* Left Side: Category Picker */}
                            <div style={{ width: 260, background: '#F8FAFC', borderRight: '1px solid #E2E8F0', padding: 20, overflowY: 'auto' }}>
                                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px' }}>Project Sector</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                                        <button key={c} onClick={() => { setFormCat(c); setFormData({}); }} style={{
                                            padding: '14px 16px', borderRadius: 14, border: formCat === c ? '1.5px solid #0A1F44' : '1px solid transparent',
                                            background: formCat === c ? '#fff' : 'transparent', color: formCat === c ? '#0A1F44' : '#64748B',
                                            fontSize: 13, fontWeight: 800, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                                            boxShadow: formCat === c ? '0 4px 12px rgba(10,31,68,0.06)' : 'none', cursor: 'pointer', transition: 'all 0.2s'
                                        }}>
                                            <span style={{ fontSize: 20 }}>{categoryIcon(c)}</span>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Dynamic Form */}
                            <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', background: '#fff' }}>
                                {/* Common Core Fields */}
                                <div style={{ marginBottom: 32 }}>
                                    <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 900, color: '#0A1F44', borderBottom: '1.5px solid #F1F5F9', paddingBottom: 8 }}>Core Details</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                        <InputGroup
                                            label={formCat === 'Business Opps' ? "Business Title" : "Project / Item Title"}
                                            val={formData.title}
                                            onChange={v => handleInput('title', v)}
                                            placeholder={formCat === 'Business Opps' ? "e.g. Car Wash Business" : "e.g. Syokimau Prime Plots"}
                                        />
                                        {formCat !== 'Business Opps' && (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                                <InputGroup label="Location" val={formData.location} onChange={v => handleInput('location', v)} placeholder="Town/City" />
                                                <div>
                                                    <label style={lbl}>Region</label>
                                                    <select style={inp} value={formData.region || ''} onChange={e => handleInput('region', e.target.value)}>
                                                        <option>Nairobi</option><option>Coast</option><option>Rift Valley</option><option>Central</option><option>Eastern</option><option>All Regions</option>
                                                    </select>
                                                </div>
                                                <InputGroup label="Specific Area" val={formData.area} onChange={v => handleInput('area', v)} placeholder="e.g. Karen" />
                                            </div>
                                        )}
                                        <ImageUploadGroup label="Project Images (Up to 3, Upload via Cloudinary)" vals={formData.images || []} onChange={v => handleInput('images', v)} toast={toast_} />
                                        <div style={{ display: 'grid', gridTemplateColumns: formCat === 'Business Opps' ? '1fr 1fr' : '1fr 1fr 1fr', gap: 16 }}>
                                            {formCat !== 'Business Opps' && (
                                                <InputGroup label="Numeric Price (KSh)" val={formData.priceNum} onChange={v => handleInput('priceNum', v)} placeholder="e.g. 5000000" type="number" />
                                            )}
                                            <InputGroup label="Display Goal / Price" val={formData.goal} onChange={v => handleInput('goal', v)} placeholder="e.g. KSh 5M" />
                                            <InputGroup label="Display Raised" val={formData.raised} onChange={v => handleInput('raised', v)} placeholder="e.g. KSh 1M" />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
                                            <InputGroup label="Public Tag / Badge" val={formData.tag} onChange={v => handleInput('tag', v)} placeholder="e.g. PRIME LOCATION, BEST SELLER" />
                                            <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingBottom: 10 }}>
                                                <Checkbox label="Mark as Hot Deal 🔥" val={formData.isHotDeal} onChange={v => handleInput('isHotDeal', v)} />
                                            </div>
                                        </div>
                                        <TextAreaGroup
                                            label={formCat === 'Business Opps' ? "Detailed Business Description" : "Project Description (About this Land/Sector)"}
                                            val={formData.description}
                                            onChange={v => handleInput('description', v)}
                                            placeholder="Enter details..."
                                        />

                                        <div style={{ marginTop: 8 }}>
                                            <h5 style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Developer / Contact Details</h5>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                                <InputGroup label="Company Name" val={formData.partner} onChange={v => handleInput('partner', v)} placeholder="e.g. Sema Real Estate" />
                                                <InputGroup label="Contact Phone" val={formData.phone} onChange={v => handleInput('phone', v)} placeholder="e.g. +254..." />
                                                <InputGroup label="Contact Email" val={formData.email} onChange={v => handleInput('email', v)} placeholder="info@company.co.ke" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Sector-Specific Fields */}
                                <div>
                                    <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 900, color: '#0A1F44', borderBottom: '1.5px solid #F1F5F9', paddingBottom: 8 }}>
                                        Sector Properties: {formCat}
                                    </h4>

                                    {formCat === 'Managed Lands' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                                                <h5 style={{ margin: 0, fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Land Details</h5>
                                            </div>
                                            <InputGroup label="County" val={formData.county} onChange={v => handleInput('county', v)} placeholder="e.g. Machakos" />
                                            <InputGroup label="Size" val={formData.plotSize} onChange={v => handleInput('plotSize', v)} placeholder="e.g. 50x100 (1/8 Acre)" />
                                            <InputGroup label="Title Deed Info" val={formData.titleType} onChange={v => handleInput('titleType', v)} placeholder="e.g. Ready Freehold Title" />
                                            <InputGroup label="Nearest Town" val={formData.nearestTown} onChange={v => handleInput('nearestTown', v)} placeholder="e.g. Athi River (10 Mins)" />
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <InputGroup label="Utilities & Infrastructure (Description)" val={formData.utilities} onChange={v => handleInput('utilities', v)} placeholder="e.g. Water, Electricity, Near Schools, Hospitals & Tarmac Road" />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 24, background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                                <Checkbox label="Serviced Plot" val={formData.isServiced} onChange={v => handleInput('isServiced', v)} />
                                                <Checkbox label="Near Tarmac" val={formData.isNearTarmac} onChange={v => handleInput('isNearTarmac', v)} />
                                                <Checkbox label="Water/Electricity" val={formData.hasUtilities} onChange={v => handleInput('hasUtilities', v)} />
                                            </div>
                                            <InputGroup label="Est. Monthly Revenue (Optional)" val={formData.income} onChange={v => handleInput('income', v)} placeholder="e.g. KSh 25,000" />

                                            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8, marginTop: 16 }}>
                                                <h5 style={{ margin: 0, fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Developer / Company Details</h5>
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <InputGroup label="Company Name" val={formData.partner} onChange={v => handleInput('partner', v)} placeholder="e.g. Sema Real Estate Group" />
                                            </div>
                                            <InputGroup label="Contact Phone" val={formData.phone} onChange={v => handleInput('phone', v)} placeholder="e.g. +254 712 345 678" />
                                            <InputGroup label="Contact Email" val={formData.email} onChange={v => handleInput('email', v)} placeholder="e.g. info@semarealestate.co.ke" />
                                        </div>
                                    )}

                                    {formCat === 'Build or Buy a House' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div>
                                                <label style={lbl}>Property Type</label>
                                                <select style={inp} value={formData.propertyType || ''} onChange={e => handleInput('propertyType', e.target.value)}>
                                                    <option>Apartments</option><option>Rental Units</option><option>Residential Houses</option><option>Commercial Properties</option>
                                                </select>
                                            </div>
                                            <InputGroup label="ROI / Rental Yield Text" val={formData.roi} onChange={v => handleInput('roi', v)} placeholder="e.g. 7.5% Yield or KSh 125K/mo" />
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                                <InputGroup label="Bedrooms" val={formData.bedrooms} onChange={v => handleInput('bedrooms', v)} type="number" />
                                                <InputGroup label="Bathrooms" val={formData.bathrooms} onChange={v => handleInput('bathrooms', v)} type="number" />
                                                <InputGroup label="Total Units" val={formData.units} onChange={v => handleInput('units', v)} type="number" />
                                            </div>
                                            <InputGroup label="Completion Date (if off-plan)" val={formData.completionDate} onChange={v => handleInput('completionDate', v)} type="month" />
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 24, background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                                <Checkbox label="Verified Property" val={formData.verified} onChange={v => handleInput('verified', v)} />
                                                <Checkbox label="Off-Plan Project" val={formData.offPlan} onChange={v => handleInput('offPlan', v)} />
                                                <Checkbox label="Hotel/Hospitality" val={formData.hotel} onChange={v => handleInput('hotel', v)} />
                                                <Checkbox label="Office Space" val={formData.office} onChange={v => handleInput('office', v)} />
                                                <Checkbox label="Retail/Mall" val={formData.retail} onChange={v => handleInput('retail', v)} />
                                            </div>
                                        </div>
                                    )}

                                    {formCat === 'Vehicle Sourcing' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div>
                                                <label style={lbl}>Vehicle Type</label>
                                                <select style={inp} value={formData.type || ''} onChange={e => handleInput('type', e.target.value)}>
                                                    <option>SUVs</option><option>Sedans</option><option>Motorbikes</option><option>Pickups</option><option>Electric</option><option>Luxury</option><option>Buses</option>
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <InputGroup label="Make (Brand)" val={formData.make} onChange={v => handleInput('make', v)} placeholder="e.g. Toyota" />
                                                <InputGroup label="Model" val={formData.model} onChange={v => handleInput('model', v)} placeholder="e.g. Prado" />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, gridColumn: '1 / -1' }}>
                                                <InputGroup label="Year" val={formData.year} onChange={v => handleInput('year', v)} type="number" />
                                                <InputGroup label="Mileage" val={formData.mileage} onChange={v => handleInput('mileage', v)} placeholder="e.g. 45,000 km" />
                                                <InputGroup label="Engine CC" val={formData.engine} onChange={v => handleInput('engine', v)} placeholder="e.g. 2800cc" />
                                            </div>
                                            <div>
                                                <label style={lbl}>Transmission</label>
                                                <select style={inp} value={formData.transmission || ''} onChange={e => handleInput('transmission', e.target.value)}><option>Automatic</option><option>Manual</option></select>
                                            </div>
                                            <div>
                                                <label style={lbl}>Condition</label>
                                                <select style={inp} value={formData.condition || ''} onChange={e => handleInput('condition', e.target.value)}><option>Used</option><option>New</option></select>
                                            </div>
                                            <div>
                                                <label style={lbl}>Fuel Type</label>
                                                <select style={inp} value={formData.fuel || ''} onChange={e => handleInput('fuel', e.target.value)}>
                                                    <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={lbl}>Sourcing Route</label>
                                                <select style={inp} value={formData.source || ''} onChange={e => handleInput('source', e.target.value)}><option>Local</option><option>Import</option></select>
                                            </div>
                                            <InputGroup label="Partner / Dealer" val={formData.partner} onChange={v => handleInput('partner', v)} placeholder="e.g. SBT Japan, Toyota Kenya" />

                                            {/* Import summary fields */}
                                            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1px dashed #CBD5E1' }}>
                                                <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: '#0A1F44' }}>Import Breakdown (If Import Route)</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                                                    <InputGroup label="FOB ($)" val={formData.fob} onChange={v => handleInput('fob', v)} />
                                                    <InputGroup label="Shipping ($)" val={formData.ship} onChange={v => handleInput('ship', v)} />
                                                    <InputGroup label="Duty ($)" val={formData.duty} onChange={v => handleInput('duty', v)} />
                                                    <InputGroup label="Clearing ($)" val={formData.clear} onChange={v => handleInput('clear', v)} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formCat === 'Utilities and Products' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div>
                                                <label style={lbl}>Sub Category</label>
                                                <select style={inp} value={formData.subCategory || ''} onChange={e => handleInput('subCategory', e.target.value)}>
                                                    <option>Furniture</option><option>Home Appliances</option><option>Farming Utilities</option><option>Building Utilities</option><option>Others</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={lbl}>Availability Status</label>
                                                <select style={inp} value={formData.status || ''} onChange={e => handleInput('status', e.target.value)}>
                                                    <option>In Stock</option><option>Available</option><option>Available Now</option>
                                                </select>
                                            </div>
                                            <InputGroup label="Retail Price Text" val={formData.price} onChange={v => handleInput('price', v)} placeholder="e.g. KSh 65,000" />
                                            <InputGroup label="Partner / Brand" val={formData.partner} onChange={v => handleInput('partner', v)} placeholder="e.g. EcoPower Ltd" />
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <TextAreaGroup label="Full Description" val={formData.description} onChange={v => handleInput('description', v)} placeholder="Product description..." />
                                            </div>
                                        </div>
                                    )}

                                    {formCat === 'Business Opps' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={lbl}>Business Category</label>
                                                <select style={inp} value={formData.subCategory || ''} onChange={e => handleInput('subCategory', e.target.value)}>
                                                    <option>Agriculture & Agribusiness</option><option>Real Estate & Rental Business</option><option>Retail & Trade Businesses</option><option>Transport & Logistics</option><option>Manufacturing & Value Addition</option>
                                                </select>
                                            </div>

                                            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginBottom: 4 }}>
                                                <h5 style={{ margin: 0, fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>Opportunity Snapshot</h5>
                                            </div>
                                            <InputGroup label="Startup Capital (KSh)" val={formData.capitalRequired} onChange={v => handleInput('capitalRequired', v)} placeholder="e.g. KSh 80,000" />
                                            <InputGroup label="Est. Monthly Revenue (KSh)" val={formData.revenueProjection} onChange={v => handleInput('revenueProjection', v)} placeholder="e.g. KSh 50,000" />
                                            <InputGroup label="Monthly Profit (KSh)" val={formData.monthlyProfit} onChange={v => handleInput('monthlyProfit', v)} placeholder="e.g. KSh 20K – 30K" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '20px 32px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button onClick={() => { setShowAddModal(false); setEditId(null); setFormData({}); }} style={{ background: '#fff', border: '1.5px solid #E2E8F0', color: '#64748B', borderRadius: 12, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={submitProject} style={{ background: '#0B3D2E', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>{editId ? `✓ Save ${formCat}` : `✓ Publish ${formCat} Listing`}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Form Helpers
const lbl = { display: 'block', margin: '0 0 6px', fontSize: 10, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' };
const inp = { width: '100%', boxSizing: 'border-box', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#0A1F44', outline: 'none', background: '#fff' };

const InputGroup = ({ label, val, onChange, placeholder, type = 'text' }) => (
    <div>
        <label style={lbl}>{label}</label>
        <input type={type} value={val || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />
    </div>
);

const TextAreaGroup = ({ label, val, onChange, placeholder }) => (
    <div>
        <label style={lbl}>{label}</label>
        <textarea value={val || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inp, minHeight: 80, resize: 'vertical' }} />
    </div>
);

const Checkbox = ({ label, onChange, val }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#0A1F44', cursor: 'pointer' }}>
        <input type="checkbox" checked={!!val} onChange={e => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#0B3D2E' }} />
        {label}
    </label>
);

const ImageUploadGroup = ({ label, vals = [], onChange, toast }) => {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fb = new FormData();
        fb.append('image', file);

        try {
            const res = await axios.post(`${API_URL}/upload/upload`, fb);
            if (res.data && res.data.imageUrl) {
                if (vals.length < 3) {
                    onChange([...vals, res.data.imageUrl]);
                } else {
                    onChange([vals[0], vals[1], res.data.imageUrl]);
                }
                toast('Image uploaded to Cloudinary!', 'success');
            }
        } catch (error) {
            console.error(error);
            toast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    return (
        <div>
            <label style={lbl}>{label} ({vals.length}/3)</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        style={{ ...inp, cursor: 'pointer' }}
                        disabled={uploading || vals.length >= 3}
                    />
                    {uploading && (
                        <div style={{ position: 'absolute', right: 14, top: 10, fontSize: 12, fontWeight: 700, color: '#0A1F44' }}>
                            Uploading...
                        </div>
                    )}
                </div>
                {vals.map((url, i) => (
                    <div key={i} style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', flexShrink: 0, position: 'relative' }}>
                        <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => onChange(vals.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
