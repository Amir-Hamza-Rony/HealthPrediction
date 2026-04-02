import { useState } from 'react'

function createBaseForm() {
  return {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  }
}

export default function AuthModal({ open, mode, onClose, onSubmit }) {
  const [form, setForm] = useState(createBaseForm)
  const [error, setError] = useState('')
  const isLogin = mode === 'login'

  if (!open) {
    return null
  }

  const updateField = (field, value) => {
    setForm(previous => ({ ...previous, [field]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')

    try {
      await onSubmit({
        mode,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      })
    } catch (submitError) {
      setError(submitError?.message || 'Something went wrong')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.62)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '28px 28px 20px',
            background: 'linear-gradient(135deg, #0f766e, #059669)',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px' }}>
                HealthPrediction Access
              </p>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
                {isLogin ? 'লগইন করুন' : 'নতুন অ্যাকাউন্ট খুলুন'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '20px',
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: '12px 0 0', maxWidth: '420px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
            {isLogin
              ? 'আপনার existing account দিয়ে লগইন করুন।'
              : 'Register করে user বা doctor account বানাতে পারবেন। Admin role শুধু system account থেকেই ধরা হবে।'}
          </p>
        </div>

        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setError('')
                onSubmit({ switchMode: 'login' })
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                background: isLogin ? 'linear-gradient(135deg, #059669, #047857)' : 'rgba(15, 23, 42, 0.06)',
                color: isLogin ? 'white' : '#334155',
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setError('')
                onSubmit({ switchMode: 'register' })
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                background: !isLogin ? 'linear-gradient(135deg, #059669, #047857)' : 'rgba(15, 23, 42, 0.06)',
                color: !isLogin ? 'white' : '#334155',
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div
              style={{
                marginBottom: '18px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#b91c1c',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={labelStyle}>Your name</label>
                <input
                  value={form.name}
                  onChange={event => updateField('name', event.target.value)}
                  placeholder="আপনার নাম"
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={event => updateField('email', event.target.value)}
                placeholder="name@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={event => updateField('password', event.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {!isLogin && (
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={event => updateField('confirmPassword', event.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label style={labelStyle}>Account type</label>
                <select
                  value={form.role}
                  onChange={event => updateField('role', event.target.value)}
                  style={inputStyle}
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '14px 18px',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 800,
              boxShadow: '0 12px 24px rgba(16, 185, 129, 0.28)',
            }}
          >
            {isLogin ? 'লগইন করুন' : 'Register করুন'}
          </button>

          <div
            style={{
              marginTop: '16px',
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.04)',
              color: '#475569',
              fontSize: '13px',
              lineHeight: 1.7,
            }}
          >
            Demo accounts:
            <br />
            admin@health.test / Admin123!
            <br />
            doctor@health.test / Doctor123!
            <br />
            user@health.test / User123!
          </div>
        </div>
      </form>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#334155',
  marginBottom: '8px',
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '12px',
  border: '1px solid rgba(15, 23, 42, 0.14)',
  padding: '12px 14px',
  outline: 'none',
  fontSize: '15px',
  background: 'white',
}
