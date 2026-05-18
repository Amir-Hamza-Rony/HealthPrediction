import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: '🧠',
    title: 'AI-চালিত বিশ্লেষণ',
    desc: 'উন্নত কৃত্রিম বুদ্ধিমত্তা দিয়ে আপনার লক্ষণ বিশ্লেষণ করুন',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: '👨‍⚕️',
    title: 'বিশেষজ্ঞ ডাক্তার',
    desc: 'কাছের অভিজ্ঞ ডাক্তারদের সাথে যোগাযোগ করুন',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: '💊',
    title: 'প্রাকৃতিক প্রতিকার',
    desc: 'সাধারণ রোগের জন্য ঘরোয়া ও আয়ুর্বেদিক সমাধান',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    icon: '📊',
    title: 'স্বাস্থ্য রিপোর্ট',
    desc: 'বিস্তারিত স্বাস্থ্য প্রতিবেদন ও পর্যবেক্ষণ',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
]

const stats = [
  { value: '৫০+', label: 'রোগ শনাক্তকরণ' },
  { value: '১০০+', label: 'বিশেষজ্ঞ ডাক্তার' },
  { value: '৫০০+', label: 'প্রতিকার পদ্ধতি' },
  { value: '৯৮%', label: 'সঠিকতার হার' },
]

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const num = parseInt(target.replace(/[^\d]/g, ''))
    let current = 0
    const step = Math.ceil(num / 40)
    const timer = setInterval(() => {
      current += step
      if (current >= num) { setCount(num); clearInterval(timer) }
      else setCount(current)
    }, 40)
    return () => clearInterval(timer)
  }, [target])
  return <>{target.replace(/[\d]+/, count)}</>
}

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px 100px',
        background: 'linear-gradient(160deg, #f0fdf8 0%, #ecfdf5 40%, #f7f8fc 100%)',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-80px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}
            className="hero-grid">

            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '13px', color: '#059669', fontWeight: 600 }}>AI-চালিত স্বাস্থ্যসেবা</span>
              </div>

              <h1 style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#111827',
                marginBottom: '20px',
              }}>
                আপনার স্বাস্থ্যের{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  পূর্বাভাস
                </span>{' '}
                জানুন
              </h1>

              <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8, marginBottom: '36px', maxWidth: '480px' }}>
                লক্ষণ বিশ্লেষণ করুন, সম্ভাব্য রোগ সম্পর্কে জানুন এবং কাছের সেরা ডাক্তারের সাথে যোগাযোগ করুন — সবকিছু এক জায়গায়।
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/human-health" style={{
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontSize: '15px', fontWeight: 700,
                  color: 'white',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🩺 স্বাস্থ্য পরীক্ষা শুরু
                </Link>
                <Link to="/doctors" style={{
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontSize: '15px', fontWeight: 600,
                  color: '#059669',
                  background: 'white',
                  border: '2px solid rgba(16,185,129,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                }}>
                  👨‍⚕️ ডাক্তার খুঁজুন
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '320px', height: '320px',
                borderRadius: '40px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '120px',
                boxShadow: '0 20px 60px rgba(16,185,129,0.15), 0 0 0 1px rgba(16,185,129,0.1)',
                position: 'relative',
              }}>
                🏥
                {/* Floating badges */}
                <div style={{
                  position: 'absolute', top: '20px', right: '-20px',
                  background: 'white', borderRadius: '14px', padding: '10px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '13px',
                  fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px',
                  animation: 'float 3s ease-in-out infinite',
                }}>
                  ✅ রোগ শনাক্ত
                </div>
                <div style={{
                  position: 'absolute', bottom: '30px', left: '-30px',
                  background: 'white', borderRadius: '14px', padding: '10px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '13px',
                  fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px',
                  animation: 'float 3s ease-in-out infinite 1.5s',
                }}>
                  🤖 AI বিশ্লেষণ
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </section>

      {/* Stats Bar */}
      <section style={{
        background: 'linear-gradient(135deg, #059669, #047857)',
        padding: '36px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}
          className="stats-grid">
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'white', fontFamily: '"Playfair Display", serif' }}>
                <AnimatedCounter target={s.value} />
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
            কী কী সুবিধা পাবেন?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>আমাদের প্ল্যাটফর্মের মাধ্যমে স্বাস্থ্যসেবা এখন আরও সহজ</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="features-grid">
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'flex-start', gap: '20px',
              transition: 'all 0.3s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)' }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: f.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '28px', flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){.features-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          borderRadius: '28px',
          padding: '64px 48px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', fontWeight: 700, color: 'white', marginBottom: '16px', position: 'relative' }}>
            আজই আপনার স্বাস্থ্য পরীক্ষা করুন
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '36px', position: 'relative' }}>
            বিনামূল্যে লক্ষণ বিশ্লেষণ করুন এবং সঠিক স্বাস্থ্যসেবা পান
          </p>
          <Link to="/human-health" style={{
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 36px', borderRadius: '14px',
            fontSize: '16px', fontWeight: 700,
            color: '#111827',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
            position: 'relative',
          }}>
            🚀 এখনই শুরু করুন — বিনামূল্যে
          </Link>
        </div>
      </section>
    </div>
  )
}
