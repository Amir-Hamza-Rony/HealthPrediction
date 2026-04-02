import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      color: 'white',
      padding: '56px 24px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '48px' }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
              }}>🩺</div>
              <div>
                <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, fontSize: '20px' }}>
                  স্বাস্থ্য<span style={{ color: '#10b981' }}>পূর্বাভাস</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>AI HEALTH PREDICTION</div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: '280px' }}>
              কৃত্রিম বুদ্ধিমত্তার সাহায্যে আপনার স্বাস্থ্য সম্পর্কে সচেতন সিদ্ধান্ত নিন।
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {['📧', '📱', '🌐'].map((icon, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', fontSize: '16px',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >{icon}</div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              পরিষেবা
            </h4>
            {[
              { to: '/human-health', label: 'স্বাস্থ্য বিশ্লেষণ' },
              { to: '/doctors', label: 'ডাক্তার খুঁজুন' },
              { to: '/remedies', label: 'ঘরোয়া প্রতিকার' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'block', textDecoration: 'none',
                fontSize: '14px', color: 'rgba(255,255,255,0.6)',
                marginBottom: '12px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#10b981'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{link.label}</Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              তথ্য
            </h4>
            {['আমাদের সম্পর্কে', 'গোপনীয়তা নীতি', 'শর্তাবলী', 'যোগাযোগ'].map(label => (
              <a key={label} href="#" style={{
                display: 'block', textDecoration: 'none',
                fontSize: '14px', color: 'rgba(255,255,255,0.6)',
                marginBottom: '12px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#10b981'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{label}</a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
            © ২০২৬ স্বাস্থ্যপূর্বাভাস। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            ⚕️ চিকিৎসা পরামর্শের বিকল্প নয়
          </p>
        </div>
      </div>

      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  )
}
