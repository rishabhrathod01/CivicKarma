import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Export from './pages/Export';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/export', label: 'Export' },
];

export default function App() {
  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <span style={styles.logo}>CK</span>
          <span style={styles.logoText}>CivicKarma</span>
        </div>
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>CivicKarma Admin Dashboard</h1>
        </header>
        <main style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/export" element={<Export />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    color: '#1a1a2e',
    backgroundColor: '#f0f2f5',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#1a7f37',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    flexShrink: 0,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    marginBottom: 16,
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
  },
  logoText: {
    fontWeight: 600,
    fontSize: 16,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '0 12px',
  },
  navLink: {
    display: 'block',
    padding: '10px 12px',
    borderRadius: 6,
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'background 0.15s, color 0.15s',
  },
  navLinkActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontWeight: 600,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  header: {
    backgroundColor: '#fff',
    padding: '16px 32px',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  headerTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  content: {
    padding: 32,
    flex: 1,
  },
};
