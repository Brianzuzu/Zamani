import { useState } from 'react';

const ANNOUNCEMENTS = [
    { id: 'ANN-001', title: 'Platform Maintenance — Feb 28', body: 'Scheduled maintenance from 2AM–4AM EAT. All services resume after this window.', audience: 'All Users', status: 'Published', date: '2026-02-25', type: 'System' },
    { id: 'ANN-002', title: 'New Investment Pool: Westlands Tech Offices', body: 'Premium office investment pool is now live. Min stake KSh 50,000 with projected 20% ROI.', audience: 'Investors', status: 'Published', date: '2026-02-24', type: 'Investment' },
    { id: 'ANN-003', title: 'KYC Reminder for Unverified Accounts', body: 'Complete identity verification to unlock full platform features and higher investment limits.', audience: 'Unverified', status: 'Draft', date: '2026-02-23', type: 'Compliance' },
];

const FAQS_INIT = [
    { id: 1, question: 'How do I invest in a project?', answer: 'Browse Projects, select one, and click "Invest Now". Fund via M-Pesa or card.', category: 'Investing', status: 'Published' },
    { id: 2, question: 'What is the minimum investment?', answer: 'KSh 5,000 for local users, $50 USD for diaspora investors.', category: 'Investing', status: 'Published' },
    { id: 3, question: 'How long does a withdrawal take?', answer: 'M-Pesa withdrawals are instant. Bank transfers take 1–3 business days.', category: 'Payments', status: 'Published' },
    { id: 4, question: 'Is my investment insured?', answer: 'Zamani follows CMA regulatory compliance. All projects are vetted before listing.', category: 'Security', status: 'Draft' },
];

const FEATURED_INIT = [
    { id: 'PRJ-001', title: 'Kilimani Residential Towers', category: 'Real Estate', roi: '18%', raised: '70%', featured: true },
    { id: 'PRJ-005', title: 'Westlands Tech Offices', category: 'Commercial', roi: '20%', raised: '82%', featured: true },
    { id: 'PRJ-002', title: 'Rift Valley Maize Pool', category: 'Agriculture', roi: '22%', raised: '100%', featured: false },
    { id: 'PRJ-003', title: 'Mombasa Retail Hub', category: 'Commercial', roi: '15%', raised: '22%', featured: false },
];

const labelStyle = { display: 'block', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6 };
const inputBase = { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#0A1F44', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };

const Badge = ({ text, color, bg }) => (
    <span style={{ fontSize: 10, fontWeight: 800, color, background: bg, borderRadius: 8, padding: '3px 10px' }}>{text}</span>
);

const Marketing = () => {
    const [tab, setTab] = useState('announcements');
    const [faqs, setFaqs] = useState(FAQS_INIT);
    const [featured, setFeatured] = useState(FEATURED_INIT);
    const [toast, setToast] = useState(null);
    const [showAnnForm, setShowAnnForm] = useState(false);
    const [showFaqForm, setShowFaqForm] = useState(false);
    const [annForm, setAnnForm] = useState({ title: '', body: '', audience: 'All Users', type: 'System' });
    const [pushForm, setPushForm] = useState({ title: '', message: '', audience: 'All Users' });
    const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'Investing' });

    const toast_ = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const tabs = [
        { id: 'announcements', label: '📢 Announcements' },
        { id: 'push', label: '🔔 Push Notifications' },
        { id: 'faqs', label: '❓ FAQs' },
        { id: 'featured', label: '⭐ Featured' },
    ];

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
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A1F44', margin: 0 }}>Content & Marketing</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>Announcements · Push Notifications · FAQs · Featured Projects</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {tab === 'announcements' && <button onClick={() => setShowAnnForm(true)} style={{ background: '#0A1F44', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>＋ New Announcement</button>}
                    {tab === 'faqs' && <button onClick={() => setShowFaqForm(true)} style={{ background: '#0A1F44', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>＋ Add FAQ</button>}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 4, borderRadius: 16, width: 'fit-content' }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#0A1F44' : '#94A3B8', boxShadow: tab === t.id ? '0 2px 8px rgba(10,31,68,0.08)' : 'none' }}>{t.label}</button>
                ))}
            </div>

            {/* ── ANNOUNCEMENTS ── */}
            {tab === 'announcements' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {showAnnForm && (
                        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '2px solid #0A1F44' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0A1F44' }}>New Announcement</h3>
                                <button onClick={() => setShowAnnForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94A3B8' }}>✕</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div><label style={labelStyle}>Title</label><input value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title..." style={inputBase} /></div>
                                <div><label style={labelStyle}>Message</label><textarea value={annForm.body} onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))} rows={4} placeholder="Announcement body..." style={{ ...inputBase, resize: 'vertical', fontFamily: 'inherit' }} /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div><label style={labelStyle}>Audience</label>
                                        <select value={annForm.audience} onChange={e => setAnnForm(p => ({ ...p, audience: e.target.value }))} style={inputBase}>
                                            {['All Users', 'Investors', 'Verified Investors', 'Project Owners', 'Unverified', 'Diaspora'].map(a => <option key={a}>{a}</option>)}
                                        </select>
                                    </div>
                                    <div><label style={labelStyle}>Type</label>
                                        <select value={annForm.type} onChange={e => setAnnForm(p => ({ ...p, type: e.target.value }))} style={inputBase}>
                                            {['System', 'Investment', 'Compliance', 'Marketing'].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => { toast_('Announcement published to ' + annForm.audience); setShowAnnForm(false); }} style={{ background: '#0A1F44', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>📢 Publish</button>
                                    <button onClick={() => toast_('Saved as draft')} style={{ background: '#F8FAFC', color: '#0A1F44', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save Draft</button>
                                    <button onClick={() => setShowAnnForm(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 13, padding: '12px' }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {ANNOUNCEMENTS.map(ann => (
                        <div key={ann.id} style={{ background: '#fff', borderRadius: 20, padding: '22px 26px', border: '1px solid #F1F5F9', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                            <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ann.type === 'System' ? '#EFF6FF' : ann.type === 'Investment' ? '#ECFDF5' : '#FFFBEB' }}>
                                {ann.type === 'System' ? '⚙️' : ann.type === 'Investment' ? '💰' : '🛡️'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Badge text={ann.type} color="#1E40AF" bg="#EFF6FF" />
                                        <Badge text={ann.audience} color="#166534" bg="#ECFDF5" />
                                        <Badge text={ann.status} color={ann.status === 'Published' ? '#065F46' : '#92400E'} bg={ann.status === 'Published' ? '#ECFDF5' : '#FFFBEB'} />
                                    </div>
                                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{ann.date}</span>
                                </div>
                                <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 900, color: '#0A1F44' }}>{ann.title}</h3>
                                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{ann.body}</p>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[['✏️ Edit', '#0A1F44', '#EFF6FF'], ['🗑 Delete', '#9F1239', '#FFF1F2']].map(([l, c, b]) => (
                                        <button key={l} onClick={() => toast_(l.includes('Delete') ? `${ann.title} deleted` : `${ann.title} opened for editing`, l.includes('Delete') ? 'danger' : 'success')} style={{ background: b, color: c, border: `1px solid ${c}20`, borderRadius: 10, padding: '7px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── PUSH NOTIFICATIONS ── */}
            {tab === 'push' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #F1F5F9' }}>
                        <h3 style={{ margin: '0 0 22px', fontSize: 16, fontWeight: 900, color: '#0A1F44' }}>🔔 Compose Notification</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div><label style={labelStyle}>Title</label><input value={pushForm.title} onChange={e => setPushForm(p => ({ ...p, title: e.target.value }))} placeholder="Notification title..." style={inputBase} /></div>
                            <div><label style={labelStyle}>Message</label><textarea value={pushForm.message} onChange={e => setPushForm(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Message body..." style={{ ...inputBase, resize: 'vertical', fontFamily: 'inherit' }} /></div>
                            <div>
                                <label style={labelStyle}>Target Audience</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                                    {['All Users', 'Investors', 'Verified Investors', 'Project Owners', 'Diaspora'].map(a => (
                                        <button key={a} onClick={() => setPushForm(p => ({ ...p, audience: a }))} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: pushForm.audience === a ? '#0A1F44' : '#F1F5F9', color: pushForm.audience === a ? '#fff' : '#64748B' }}>{a}</button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => toast_(`📲 Notification sent to ${pushForm.audience}`)} style={{ background: '#0A1F44', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 800, cursor: 'pointer', marginTop: 4 }}>🚀 Send Notification</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: '#0A1F44', borderRadius: 20, padding: 24 }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>Live Preview</p>
                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0B3D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏛</div>
                                    <div><p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: '#fff' }}>Zamani</p><p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>now</p></div>
                                </div>
                                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: '#fff' }}>{pushForm.title || 'Notification Title'}</p>
                                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{pushForm.message || 'Your message will appear here...'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: '#fff' }}>14.2K</p>
                                    <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Recipients</p>
                                </div>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: '#10B981' }}>72%</p>
                                    <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Open Rate</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #F1F5F9' }}>
                            <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 900, color: '#0A1F44' }}>Recently Sent</h4>
                            {[{ title: 'New Agriculture Pool Live', audience: 'Investors', time: '2h ago', opens: '68%' }, { title: 'KYC Reminder', audience: 'Unverified', time: '1d ago', opens: '54%' }, { title: 'Payout Processed', audience: 'All Users', time: '2d ago', opens: '81%' }].map((n, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                                    <div><p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#0A1F44' }}>{n.title}</p><p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>→ {n.audience} · {n.time}</p></div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0B3D2E', background: '#ECFDF5', padding: '4px 10px', borderRadius: 8 }}>{n.opens}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── FAQs ── */}
            {tab === 'faqs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {showFaqForm && (
                        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '2px solid #0A1F44' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0A1F44' }}>Add New FAQ</h3>
                                <button onClick={() => setShowFaqForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94A3B8' }}>✕</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div><label style={labelStyle}>Question</label><input value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))} placeholder="What is the question?" style={inputBase} /></div>
                                <div><label style={labelStyle}>Answer</label><textarea value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} rows={3} placeholder="Write the answer..." style={{ ...inputBase, resize: 'vertical', fontFamily: 'inherit' }} /></div>
                                <div><label style={labelStyle}>Category</label>
                                    <select value={faqForm.category} onChange={e => setFaqForm(p => ({ ...p, category: e.target.value }))} style={inputBase}>
                                        {['Investing', 'Payments', 'Security', 'Account', 'General'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => { setFaqs(p => [...p, { id: p.length + 1, ...faqForm, status: 'Published' }]); toast_('FAQ added'); setShowFaqForm(false); setFaqForm({ question: '', answer: '', category: 'Investing' }); }} style={{ background: '#0A1F44', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Save & Publish</button>
                                    <button onClick={() => setShowFaqForm(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {faqs.map(faq => (
                        <div key={faq.id} style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <Badge text={faq.category} color="#1E40AF" bg="#EFF6FF" />
                                <Badge text={faq.status} color={faq.status === 'Published' ? '#065F46' : '#92400E'} bg={faq.status === 'Published' ? '#ECFDF5' : '#FFFBEB'} />
                            </div>
                            <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 900, color: '#0A1F44' }}>Q: {faq.question}</h4>
                            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>A: {faq.answer}</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => toast_('FAQ opened for editing')} style={{ background: '#EFF6FF', color: '#1E40AF', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>✏️ Edit</button>
                                <button onClick={() => { setFaqs(p => p.filter(f => f.id !== faq.id)); toast_('FAQ deleted', 'danger'); }} style={{ background: '#FFF1F2', color: '#9F1239', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>🗑 Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── FEATURED PROJECTS ── */}
            {tab === 'featured' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '14px 20px', fontSize: 13, color: '#92400E', fontWeight: 600 }}>
                        ⭐ Featured projects appear at the top of the investment marketplace. Max 3 featured at a time.
                    </div>
                    {featured.map(p => (
                        <div key={p.id} style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: p.featured ? '1.5px solid #D4AF37' : '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: p.featured ? 'linear-gradient(135deg, #D4AF37, #F59E0B)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                {p.category === 'Real Estate' ? '🏗️' : p.category === 'Agriculture' ? '🌾' : '🏢'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0A1F44' }}>{p.title}</h3>
                                    {p.featured && <span>⭐</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Badge text={p.category} color="#1E40AF" bg="#EFF6FF" />
                                    <Badge text={`ROI ${p.roi}`} color="#065F46" bg="#ECFDF5" />
                                    <Badge text={`${p.raised} raised`} color="#6D28D9" bg="#F5F3FF" />
                                </div>
                            </div>
                            <button onClick={() => { setFeatured(prev => prev.map(x => x.id === p.id ? { ...x, featured: !x.featured } : x)); toast_(p.featured ? `${p.title} removed from featured` : `${p.title} is now featured`); }} style={{ padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, background: p.featured ? '#FFF1F2' : 'linear-gradient(135deg, #D4AF37, #F59E0B)', color: p.featured ? '#9F1239' : '#fff' }}>
                                {p.featured ? '✕ Remove' : '⭐ Feature'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketing;
