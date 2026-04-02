import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, links = [], dashboardPath = '/', onLoginClick, onLogout }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isAuthenticated = Boolean(user)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(16,185,129,0.15)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(16,185,129,0.08)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
            }}>🩺</div>
            <div>
              <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, fontSize: '18px', color: '#111827', lineHeight: 1.1 }}>
                স্বাস্থ্য<span style={{ color: '#10b981' }}>পূর্বাভাস</span>
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
                AI HEALTH PREDICTION
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }} className="hidden-mobile">
            {links.map(link => {
              const active = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
              return (
                <Link key={link.path} to={link.path} style={{
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#059669' : '#374151',
                  background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                  onMouseEnter={e => {
                    if (!active) { e.target.style.background = 'rgba(16,185,129,0.06)'; e.target.style.color = '#059669' }
                  }}
                  onMouseLeave={e => {
                    if (!active) { e.target.style.background = 'transparent'; e.target.style.color = '#374151' }
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="hidden-mobile">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  style={{
                    textDecoration: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'white',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {user?.name}
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#b91c1c',
                    background: 'rgba(239,68,68,0.08)',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onLoginClick('login')}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'white',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', fontSize: '22px',
            }}
            className="show-mobile"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            padding: '12px 0 16px',
            borderTop: '1px solid rgba(16,185,129,0.1)',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}
            className="show-mobile"
          >
            {links.map(link => {
              const active = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
              return (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} style={{
                  textDecoration: 'none', padding: '12px 16px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: active ? 600 : 500,
                  color: active ? '#059669' : '#374151',
                  background: active ? 'rgba(16,185,129,0.08)' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {link.icon} {link.label}
                </Link>
              )
            })}

            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📊 {user?.name}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onLogout()
                  }}
                  style={{
                    textAlign: 'left',
                    border: 'none',
                    background: 'rgba(239,68,68,0.08)',
                    color: '#b91c1c',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
                <button
                type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onLoginClick('login')
                  }}
                style={{
                  textAlign: 'left',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Login / Register
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
