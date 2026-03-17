import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, Package, CreditCard,
    ShieldCheck, Wallet, ArrowLeftRight,
    Settings, LogOut, Crown, Activity, FolderKanban, ArrowDownToLine,
    Megaphone, BarChart3, Target
} from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 36 }}>
                <div style={{
                    width: 44, height: 44, background: '#fff', borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)', flexShrink: 0
                }}>
                    <Crown size={22} color="#0A1F44" />
                </div>
                <div>
                    <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>Zamani</h1>
                    <p style={{ color: '#10B981', fontSize: 9, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Master Console</p>
                </div>
            </div>

            {/* Nav */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <NavSection label="Wealth Command">
                    <MenuLink to="/admin" icon={<LayoutDashboard size={18} />} label="Overview" end />
                    <MenuLink to="/admin/reports" icon={<BarChart3 size={18} />} label="Reports & Analytics" />
                    <MenuLink to="/admin/savings" icon={<Target size={18} />} label="Savings Monitor" />
                </NavSection>

                <NavSection label="Venture Registry">
                    <MenuLink to="/admin/projects" icon={<FolderKanban size={18} />} label="Project Registry" />
                    <MenuLink to="/admin/ventures" icon={<Package size={18} />} label="Asset Registry" />
                </NavSection>

                <NavSection label="Capital Velocity">
                    <MenuLink to="/admin/treasury" icon={<Wallet size={18} />} label="Wealth Vault" />
                    <MenuLink to="/admin/payments" icon={<ArrowLeftRight size={18} />} label="Payment Engine" />
                    <MenuLink to="/admin/withdrawals" icon={<ArrowDownToLine size={18} />} label="Withdrawals" />
                    <MenuLink to="/admin/loans" icon={<CreditCard size={18} />} label="Strategic Funding" />
                </NavSection>

                <NavSection label="Governance">
                    <MenuLink to="/admin/users" icon={<Users size={18} />} label="Member Directory" />
                    <MenuLink to="/admin/kyc" icon={<ShieldCheck size={18} />} label="Compliance & KYC" />
                    <MenuLink to="/admin/marketing" icon={<Megaphone size={18} />} label="Content & Marketing" />
                </NavSection>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <MenuLink to="/admin/settings" icon={<Settings size={18} />} label="System Settings" />
                <button style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)',
                    borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    transition: 'all 0.2s'
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#FCA5A5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                >
                    <LogOut size={18} /> Terminate Session
                </button>
            </div>
        </aside>
    );
};

const NavSection = ({ label, children }) => (
    <div>
        <p style={{
            fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase', letterSpacing: '2.5px',
            padding: '0 14px', marginBottom: 6
        }}>{label}</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {children}
        </nav>
    </div>
);

const MenuLink = ({ to, icon, label, end }) => (
    <NavLink
        to={to}
        end={end}
        style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
            borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 700 : 500,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
            background: isActive ? '#0B3D2E' : 'transparent',
            boxShadow: isActive ? '0 4px 14px rgba(11,61,46,0.4)' : 'none',
            transition: 'all 0.2s'
        })}
        onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default Sidebar;
