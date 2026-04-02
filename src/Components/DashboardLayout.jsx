import { Link, useLocation } from 'react-router-dom'

function navItemStyle(active) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: active ? 700 : 600,
    color: active ? '#0f766e' : '#334155',
    background: active ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
    border: active ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
  }
}

export default function DashboardLayout({ user, title, subtitle, navItems = [], onLogout, children }) {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef6f2 100%)' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 60,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.14em', color: '#64748b', textTransform: 'uppercase' }}>
                Dashboard
              </p>
              <h1 style={{ margin: '6px 0 0', fontSize: '24px', color: '#0f172a' }}>{title}</h1>
              <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#64748b' }}>{subtitle}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: 'rgba(15, 23, 42, 0.04)',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                {user?.name}
                <span style={{ marginLeft: '8px', color: '#0f766e', fontWeight: 600 }}>({user?.role})</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '24px' }} className="dashboard-grid">
          <aside
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '18px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 16px 48px rgba(15, 23, 42, 0.06)',
              alignSelf: 'start',
            }}
          >
            <div style={{ marginBottom: '18px', padding: '14px', borderRadius: '18px', background: 'linear-gradient(135deg, #0f766e, #10b981)', color: 'white' }}>
              <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.82 }}>Signed in as</p>
              <h2 style={{ margin: '8px 0 0', fontSize: '20px' }}>{user?.name}</h2>
              <p style={{ margin: '6px 0 0', fontSize: '13px', opacity: 0.85 }}>{user?.email}</p>
            </div>

            <nav style={{ display: 'grid', gap: '8px' }}>
              {navItems.map(item => {
                const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
                return (
                  <Link key={item.to} to={item.to} style={navItemStyle(active)}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <section
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 16px 48px rgba(15, 23, 42, 0.06)',
              minWidth: 0,
            }}
          >
            {children}
          </section>
        </div>
      </main>

      <style>{`@media(max-width: 900px){.dashboard-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
