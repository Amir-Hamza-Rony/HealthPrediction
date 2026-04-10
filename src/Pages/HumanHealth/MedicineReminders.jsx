import { useState, useEffect, useRef } from 'react'

const fallbackItems = [{ id: 1, text: 'Vitamin D - once daily', time: '09:00' }]

// ── Register Service Worker & schedule reminders ──
async function registerAndSchedule(reminders) {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return

  // Request permission if not granted
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  if (Notification.permission !== 'granted') return

  try {
    const reg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready

    const sw = reg.active || reg.waiting || reg.installing
    if (sw) {
      sw.postMessage({ type: 'SCHEDULE_REMINDERS', reminders })
    }
  } catch (err) {
    console.error('SW registration failed:', err)
  }
}

// ── Buzzer (Web Audio API) ──
function playBuzzer() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.6, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch (_) {}
}

export default function MedicineReminders({ items, onAddReminder }) {
  const [localItems, setLocalItems] = useState(fallbackItems)
  const [text, setText] = useState('')
  const [time, setTime] = useState('')
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const [activeAlert, setActiveAlert] = useState(null)
  const checkRef = useRef(null)

  const visibleItems = items ?? localItems

  // ── Schedule via SW whenever reminders change ──
  useEffect(() => {
    if (visibleItems.length > 0) {
      registerAndSchedule(visibleItems)
    }
  }, [visibleItems])

  // ── In-app check every 30s for 5-min warning ──
  useEffect(() => {
    checkRef.current = setInterval(() => {
      const now = new Date()
      const hh = now.getHours()
      const mm = now.getMinutes()

      visibleItems.forEach(item => {
        if (!item.time) return
        const [rh, rm] = item.time.split(':').map(Number)
        // 5 minutes before = reminder time minus 5
        const totalReminder = rh * 60 + rm
        const totalNow = hh * 60 + mm
        if (totalReminder - totalNow === 5) {
          playBuzzer()
          setActiveAlert(item)
        }
      })
    }, 30000)

    return () => clearInterval(checkRef.current)
  }, [visibleItems])

  async function requestPermission() {
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') registerAndSchedule(visibleItems)
  }

  async function add(e) {
    e.preventDefault()
    if (!text) return

    if (onAddReminder) {
      await onAddReminder({ text, time })
    } else {
      const newItem = { id: Date.now(), text, time }
      setLocalItems(prev => [...prev, newItem])
    }

    setText('')
    setTime('')
  }

  function dismissAlert() {
    setActiveAlert(null)
  }

  // Format time to 12h for display
  function fmt(t) {
    if (!t) return 'No time set'
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  }

  // Minutes until reminder
  function minutesUntil(t) {
    if (!t) return null
    const now = new Date()
    const [rh, rm] = t.split(':').map(Number)
    const target = new Date()
    target.setHours(rh, rm, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)
    return Math.round((target - now) / 60000)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '640px', margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '100px', padding: '5px 14px', marginBottom: '14px',
        }}>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>💊 Medicine Reminders</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
          ওষুধের সময়সূচি
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          সময়ের ৫ মিনিট আগে buzzer ও notification পাবেন
        </p>
      </div>

      {/* Permission banner */}
      {permission !== 'granted' && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '14px',
          padding: '14px 18px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5 }}>
            <strong>⚠️ Notification বন্ধ আছে।</strong> Background reminder পেতে permission দিন।
          </div>
          <button
            onClick={requestPermission}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: 'none',
              background: '#f59e0b', color: 'white', fontWeight: 600,
              fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Allow Notifications
          </button>
        </div>
      )}

      {/* Active alert popup */}
      {activeAlert && (
        <div style={{
          background: 'white', border: '2px solid #10b981', borderRadius: '16px',
          padding: '18px 20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          boxShadow: '0 8px 32px rgba(16,185,129,0.2)',
          animation: 'slideUp 0.3s ease',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginBottom: '2px' }}>
              ⏰ ৫ মিনিট পরে ওষুধ খাওয়ার সময়!
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{activeAlert.text}</div>
          </div>
          <button onClick={dismissAlert} style={{
            padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
            background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#6b7280',
          }}>Dismiss</button>
        </div>
      )}

      {/* Add form */}
      <div style={{
        background: 'white', borderRadius: '20px', padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
          নতুন reminder যোগ করুন
        </h2>
        <form onSubmit={add}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '10px' }} className="reminder-form-grid">
            <input
              value={text} onChange={e => setText(e.target.value)}
              placeholder="ওষুধের নাম ও ডোজ"
              style={{
                padding: '11px 14px', borderRadius: '12px',
                border: '2px solid rgba(0,0,0,0.08)', fontSize: '14px',
                outline: 'none', color: '#111827',
              }}
              onFocus={e => e.target.style.borderColor = '#10b981'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
            />
            <input
              type="time" value={time} onChange={e => setTime(e.target.value)}
              style={{
                padding: '11px 14px', borderRadius: '12px',
                border: '2px solid rgba(0,0,0,0.08)', fontSize: '14px',
                outline: 'none', color: '#111827',
              }}
              onFocus={e => e.target.style.borderColor = '#10b981'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            }}
          >
            + Add Reminder
          </button>
        </form>
      </div>

      {/* Reminders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {visibleItems.map(item => {
          const mins = minutesUntil(item.time)
          const soon = mins !== null && mins <= 30
          return (
            <div key={item.id} style={{
              background: 'white', borderRadius: '16px', padding: '16px 20px',
              border: soon ? '1.5px solid rgba(16,185,129,0.4)' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                  background: soon ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>💊</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{item.text}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{fmt(item.time)}</div>
                </div>
              </div>
              {mins !== null && (
                <div style={{
                  fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px',
                  background: soon ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)',
                  color: soon ? '#059669' : '#9ca3af', whiteSpace: 'nowrap',
                }}>
                  {mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media(max-width:480px){ .reminder-form-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

