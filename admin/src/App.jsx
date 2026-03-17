import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Ventures from './pages/Ventures';
import Treasury from './pages/Treasury';
import Payments from './pages/Payments';
import Projects from './pages/Projects';
import Withdrawals from './pages/Withdrawals';
import Marketing from './pages/Marketing';
import Reports from './pages/Reports';
import Savings from './pages/Savings';
import { useState } from 'react';

const Placeholder = ({ title, icon }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: 400, background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9',
    boxShadow: '0 2px 16px rgba(10,31,68,0.04)', gap: 16, textAlign: 'center'
  }}>
    <div style={{ fontSize: 48 }}>{icon || '🔧'}</div>
    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0A1F44', margin: 0 }}>{title}</h2>
    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, maxWidth: 340, margin: 0 }}>
      This module is part of the Zamani Master Plan and is currently being provisioned.
    </p>
  </div>
);

function App() {
  const [isAdmin] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={isAdmin ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="ventures" element={<Ventures />} />
          <Route path="treasury" element={<Treasury />} />
          <Route path="payments" element={<Payments />} />
          <Route path="projects" element={<Projects />} />
          <Route path="savings" element={<Savings />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Placeholder title="Risk & Analytics" icon="📊" />} />
          <Route path="kyc" element={<Placeholder title="Compliance & KYC" icon="🛡️" />} />
          <Route path="loans" element={<Placeholder title="Strategic Funding" icon="💳" />} />
          <Route path="settings" element={<Placeholder title="System Settings" icon="⚙️" />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
