import React, { useState } from 'react'
import { apiRequest } from '../../lib/api.js'

// ── Shared styles for health tools ──
const toolCard = {
  background: 'white', borderRadius: '20px', padding: '24px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
}
const toolTitle = {
  fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px',
}
const fieldLabel = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: '#374151', marginBottom: '6px',
}
const toolInput = {
  width: '100%', padding: '10px 14px', borderRadius: '12px',
  border: '2px solid rgba(0,0,0,0.08)', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box', color: '#111827',
  background: 'white',
}
const toolBtn = {
  width: '100%', padding: '12px', borderRadius: '12px',
  border: '2px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)',
  color: '#059669', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
}
const resultBox = {
  marginTop: '16px', padding: '16px', borderRadius: '12px',
  background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)',
}
const badge = {
  display: 'inline-block', fontSize: '12px', fontWeight: 600,
  padding: '4px 12px', borderRadius: '100px', marginTop: '6px',
}

function BMISection() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState(null)

  function calculate(e) {
    e.preventDefault()
    const w = parseFloat(weight)
    const h = parseFloat(height) / 100
    if (!w || !h) return
    const bmi = +(w / (h * h)).toFixed(1)
    let cat = 'Unknown', color = '#888'
    if (bmi < 18.5)    { cat = 'Underweight'; color = '#378ADD' }
    else if (bmi < 25) { cat = 'Normal';      color = '#639922' }
    else if (bmi < 30) { cat = 'Overweight';  color = '#EF9F27' }
    else               { cat = 'Obese';        color = '#E24B4A' }
    setResult({ bmi, cat, color })
  }

  return (
    <div style={toolCard}>
      <h3 style={toolTitle}>⚖️ BMI Calculator</h3>
      <form onSubmit={calculate}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={fieldLabel}>Weight (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 70" style={toolInput} />
          </div>
          <div>
            <label style={fieldLabel}>Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)}
              placeholder="e.g. 170" style={toolInput} />
          </div>
        </div>
        <button type="submit" style={toolBtn}>Calculate BMI</button>
      </form>
      {result && (
        <div style={resultBox}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{result.bmi}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>BMI</div>
          <span style={{ ...badge, background: result.color + '18', color: result.color }}>{result.cat}</span>
        </div>
      )}
    </div>
  )
}

function PulseSection() {
  const [phase, setPhase] = useState('idle')
  const [timeLeft, setTimeLeft] = useState(15)
  const [beats, setBeats] = useState(0)
  const [result, setResult] = useState(null)
  const timerRef = React.useRef(null)

  function startTimer() {
    setPhase('running')
    setBeats(0)
    setTimeLeft(15)
    setResult(null)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setPhase('done')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function countBeat() {
    if (phase !== 'running') return
    setBeats(prev => prev + 1)
  }

  React.useEffect(() => {
    if (phase === 'done') {
      setBeats(prev => {
        const bpm = prev * 4
        let label = 'Normal', color = '#639922'
        if (bpm < 60)       { label = 'Bradycardia (low)';  color = '#378ADD' }
        else if (bpm > 100) { label = 'Tachycardia (high)'; color = '#E24B4A' }
        setResult({ bpm, label, color, raw: prev })
        return prev
      })
    }
  }, [phase])

  function reset() {
    clearInterval(timerRef.current)
    setPhase('idle')
    setTimeLeft(15)
    setBeats(0)
    setResult(null)
  }

  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = (timeLeft / 15) * circumference

  return (
    <div style={toolCard}>
      <h3 style={toolTitle}>💓 Pulse Monitor</h3>

      {phase === 'idle' && (
        <>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px' }}>
            আঙুল গলায় বা কব্জিতে রাখুন। Start চাপুন, তারপর প্রতিটি heartbeat-এ <strong>Tap</strong> করুন। ১৫ সেকেন্ড পর BPM বের হবে।
          </p>
          <button onClick={startTimer} style={toolBtn}>▶ Start Measuring</button>
        </>
      )}

      {phase === 'running' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
              <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="5" />
                <circle cx="36" cy="36" r={radius} fill="none" stroke="#10b981" strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, color: '#111827',
              }}>{timeLeft}s</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{beats}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>beats counted</div>
            </div>
          </div>
          <button
            onClick={countBeat}
            style={{
              width: '100%', padding: '20px', borderRadius: '14px',
              border: '2px solid rgba(16,185,129,0.4)',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', fontWeight: 700, fontSize: '18px', cursor: 'pointer',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            💓 Tap each beat
          </button>
        </>
      )}

      {phase === 'done' && result && (
        <>
          <div style={resultBox}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{result.bpm}</span>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>bpm</span>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>{result.raw} beats × 4 = {result.bpm} BPM</div>
            <span style={{ ...badge, background: result.color + '18', color: result.color }}>{result.label}</span>
          </div>
          <button onClick={reset} style={{ ...toolBtn, marginTop: '12px' }}>↺ আবার মাপুন</button>
        </>
      )}
    </div>
  )
}

const commonSymptoms = [
  'জ্বর', 'মাথাব্যথা', 'কাশি', 'গলা ব্যথা', 'পেটে ব্যথা',
  'বমি বমি ভাব', 'ক্লান্তি', 'শ্বাসকষ্ট', 'পিঠে ব্যথা', 'চোখ জ্বালা',
  'ডায়রিয়া', 'বুকে ব্যথা', 'মাথা ঘোরা', 'ত্বকে র‍্যাশ', 'ঘন ঘন প্রস্রাব',
]

export default function HumanHealth() {
  const [selected, setSelected] = useState([])
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const toggleSymptom = (s) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
    setResult(null)
  }

  const analyze = async () => {
    if (selected.length === 0) return
    setLoading(true)
    setResult(null)

    try {
      const data = await apiRequest('/api/ai/predict', {
        method: 'POST',
        body: { symptoms: selected, age, gender },
      })
      setResult({ ...data.result, color: severityColor(data.result.severity) })
      setStep(3)
    } catch (error) {
      alert('AI বিশ্লেষণ ব্যর্থ হয়েছে: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const severityColor = (severity) => {
    if (severity === 'গুরুতর') return '#ef4444'
    if (severity === 'মধ্যম') return '#f59e0b'
    return '#10b981'
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '100px', padding: '6px 16px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '13px', color: '#059669', fontWeight: 600 }}>🩺 AI স্বাস্থ্য বিশ্লেষণ</span>
        </div>
        <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
          আপনার লক্ষণ বিশ্লেষণ করুন
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          লক্ষণ নির্বাচন করুন এবং AI-এর সাহায্যে সম্ভাব্য রোগ জানুন
        </p>
      </div>

      {/* Step Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '40px' }}>
        {[1, 2, 3].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: step >= s ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(0,0,0,0.08)',
              color: step >= s ? 'white' : '#9ca3af',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, transition: 'all 0.3s',
            }}>{s}</div>
            {i < 2 && <div style={{ width: '60px', height: '2px', background: step > s ? '#10b981' : 'rgba(0,0,0,0.1)', transition: 'all 0.3s' }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
        marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
          ব্যক্তিগত তথ্য
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>বয়স</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="যেমন: ২৫"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '2px solid rgba(0,0,0,0.08)', fontSize: '15px',
                outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#10b981'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>লিঙ্গ</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '2px solid rgba(0,0,0,0.08)', fontSize: '15px',
                outline: 'none', background: 'white', cursor: 'pointer',
              }}
            >
              <option value="">নির্বাচন করুন</option>
              <option value="male">পুরুষ</option>
              <option value="female">মহিলা</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>
        </div>
        <style>{`@media(max-width:600px){.form-grid{grid-template-columns:1fr!important}}`}</style>
      </div>

      {/* Step 2: Symptoms */}
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
        marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</span>
          লক্ষণ নির্বাচন করুন
        </h2>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
          {selected.length === 0 ? 'যেকোনো লক্ষণ ক্লিক করুন' : `${selected.length}টি লক্ষণ নির্বাচিত`}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {commonSymptoms.map(s => (
            <button key={s} onClick={() => { toggleSymptom(s); if (step < 2) setStep(2) }}
              style={{
                padding: '10px 18px', borderRadius: '100px', fontSize: '14px',
                fontWeight: selected.includes(s) ? 600 : 500,
                border: '2px solid',
                borderColor: selected.includes(s) ? '#10b981' : 'rgba(0,0,0,0.1)',
                background: selected.includes(s) ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
                color: selected.includes(s) ? 'white' : '#374151',
                cursor: 'pointer', transition: 'all 0.2s',
                transform: selected.includes(s) ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {selected.includes(s) ? '✓ ' : ''}{s}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>নির্বাচিত লক্ষণ:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selected.map(s => (
                <span key={s} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  background: 'rgba(16,185,129,0.08)', color: '#059669', fontSize: '13px', fontWeight: 600,
                }}>
                  {s}
                  <button onClick={() => toggleSymptom(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '14px', padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyze}
        disabled={selected.length === 0 || loading}
        style={{
          width: '100%', padding: '18px', borderRadius: '14px',
          fontSize: '16px', fontWeight: 700,
          color: selected.length === 0 ? '#9ca3af' : 'white',
          background: selected.length === 0
            ? 'rgba(0,0,0,0.06)'
            : 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none', cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          boxShadow: selected.length > 0 ? '0 8px 24px rgba(16,185,129,0.3)' : 'none',
          transition: 'all 0.2s', marginBottom: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}
      >
        {loading ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            AI বিশ্লেষণ করছে...
          </>
        ) : '🔍 বিশ্লেষণ করুন'}
      </button>

      {/* Result */}
      {result && (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: `2px solid ${result.color}22`,
          animation: 'slideUp 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: `${result.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
            }}>🔬</div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI বিশ্লেষণের ফলাফল</p>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', fontFamily: '"Playfair Display", serif' }}>{result.disease}</h3>
            </div>
          </div>

          {result.description && (
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, marginBottom: '20px' }}>
              {result.description}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'নির্ভরযোগ্যতা', value: `${result.confidence}%`, icon: '📊' },
              { label: 'তীব্রতা', value: result.severity, icon: '⚠️' },
              { label: 'লক্ষণ', value: `${selected.length}টি`, icon: '📋' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.02)', borderRadius: '14px', padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: result.color }}>{item.value}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                📋 সুপারিশ
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.recommendations.map((rec, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: `${result.color}08`, fontSize: '13px', color: '#374151', lineHeight: 1.5,
                  }}>
                    <span style={{ color: result.color, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.warning && (
            <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>{result.warning}</p>
            </div>
          )}

          <div style={{ background: '#e0f2fe', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>ℹ️</span>
            <p style={{ fontSize: '13px', color: '#075985', lineHeight: 1.6 }}>
              <strong>সতর্কতা:</strong> এটি একটি AI-ভিত্তিক প্রাথমিক পর্যবেক্ষণ। সঠিক রোগ নির্ণয়ের জন্য অবশ্যই একজন যোগ্য চিকিৎসকের পরামর্শ নিন।
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {/* ── Health Tools: BMI & Pulse ── */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '26px', fontWeight: 700, color: '#111827',
          marginBottom: '20px', textAlign: 'center',
        }}>
          স্বাস্থ্য পরিমাপ
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          <BMISection />
          <PulseSection />
        </div>
      </div>
    </div>
  )
}
