import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const fallbackDoctors = [
  { id: 'doc-1', name: 'ডা. রফিকুল ইসলাম', specialty: 'সাধারণ চিকিৎসক', exp: '১৫ বছর', rating: 4.9, reviews: 234, location: 'ঢাকা মেডিকেল', availableDays: ['শনিবার', 'সোমবার'], fee: '৫০০', img: '👨‍⚕️' },
  { id: 'doc-2', name: 'ডা. সুমাইয়া বেগম', specialty: 'হৃদরোগ', exp: '১২ বছর', rating: 4.8, reviews: 189, location: 'হার্ট ফাউন্ডেশন', availableDays: ['মঙ্গলবার', 'বৃহস্পতিবার'], fee: '৮০০', img: '👩‍⚕️' },
  { id: 'doc-3', name: 'ডা. তানভীর আহমেদ', specialty: 'নিউরোলজি', exp: '২০ বছর', rating: 4.9, reviews: 312, location: 'বারডেম হাসপাতাল', availableDays: [], fee: '১০০০', img: '👨‍⚕️' },
  { id: 'doc-4', name: 'ডা. নাফিসা রহমান', specialty: 'শিশুরোগ', exp: '৮ বছর', rating: 4.7, reviews: 156, location: 'শিশু হাসপাতাল', availableDays: ['রবিবার', 'বুধবার'], fee: '৪০০', img: '👩‍⚕️' },
  { id: 'doc-5', name: 'ডা. করিম হোসেন', specialty: 'চর্মরোগ', exp: '১০ বছর', rating: 4.6, reviews: 98, location: 'স্কয়ার হাসপাতাল', availableDays: ['শনিবার', 'শুক্রবার'], fee: '৬০০', img: '👨‍⚕️' },
  { id: 'doc-6', name: 'ডা. শাহিদা পারভীন', specialty: 'অর্থোপেডিক', exp: '১৮ বছর', rating: 4.8, reviews: 267, location: 'সিএমএইচ', availableDays: [], fee: '৯০০', img: '👩‍⚕️' },
]

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: '12px', color: i <= Math.floor(rating) ? '#f59e0b' : '#e5e7eb' }}>★</span>
      ))}
    </div>
  )
}

function DoctorCard({ doctor, onSelect, canBook, currentUser }) {
  const availableDays = doctor.availableDays || []

  return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
      transition: 'all 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)' }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', flexShrink: 0,
        }}>{doctor.img}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827' }}>{doctor.name}</h3>
            <span style={{
              padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
              background: availableDays.length ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: availableDays.length ? '#059669' : '#dc2626',
            }}>
              {availableDays.length ? '● Free' : '● Busy'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>{doctor.specialty}</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>📍 {doctor.location} • {doctor.exp} অভিজ্ঞতা</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <Stars rating={doctor.rating} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{doctor.rating}</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>({doctor.reviews} রিভিউ)</span>
          </div>

          <div style={{ marginTop: '14px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Free days</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableDays.length > 0 ? availableDays.map(day => (
                <span key={day} style={{
                  padding: '5px 10px', borderRadius: '999px',
                  background: 'rgba(16,185,129,0.08)', color: '#059669', fontSize: '12px', fontWeight: 700,
                }}>{day}</span>
              )) : (
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>ডাক্তার এখনো free day set করেননি</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>পরামর্শ ফি</p>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>৳{doctor.fee}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(doctor)}
          aria-disabled={!canBook}
          style={{
            padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
            color: canBook ? 'white' : '#9ca3af',
            background: canBook ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(0,0,0,0.06)',
            border: 'none', cursor: canBook ? 'pointer' : 'not-allowed',
            boxShadow: canBook ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
          }}
        >
          {canBook ? 'অ্যাপয়েন্টমেন্ট নিন' : 'পরে দেখুন'}
        </button>
      </div>

      {!canBook && currentUser?.role !== 'user' && (
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
          শুধু user account থেকে booking করা যাবে।
        </div>
      )}
    </div>
  )
}

export default function Doctors({ doctors = fallbackDoctors, currentUser, onBookAppointment, onRequireAuth }) {
  const navigate = useNavigate()
  const [activeSpec, setActiveSpec] = useState('সব')
  const [search, setSearch] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [booking, setBooking] = useState({ day: '', time: '', notes: '' })
  const [bookingMessage, setBookingMessage] = useState('')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const specialties = useMemo(() => ['সব', ...new Set(doctors.map(doctor => doctor.specialty).filter(Boolean))], [doctors])

  const filtered = useMemo(() => {
    return doctors.filter(doctor =>
      (activeSpec === 'সব' || doctor.specialty === activeSpec) &&
      (search === '' || doctor.name.includes(search) || doctor.specialty.includes(search) || doctor.location.includes(search))
    )
  }, [activeSpec, doctors, search])

  const selectedDoctor = filtered.find(doctor => doctor.id === selectedDoctorId) || doctors.find(doctor => doctor.id === selectedDoctorId)

  const selectDoctor = async doctor => {
    setSelectedDoctorId(doctor.id)
    setBooking({
      day: doctor.availableDays?.[0] || '',
      time: '',
      notes: '',
    })
    setBookingMessage('')
    setIsBookingModalOpen(true)
  }

  const submitBooking = async () => {
    if (!selectedDoctor) return

    if (!currentUser) {
      setBookingMessage('Book করতে login করতে হবে।')
      await onRequireAuth?.('login')
      return
    }

    if (currentUser.role !== 'user') {
      setBookingMessage('শুধু user account থেকে appointment book করা যাবে।')
      return
    }

    try {
      const result = await onBookAppointment?.({
        doctorId: selectedDoctor.id,
        doctorEmail: selectedDoctor.email,
        day: booking.day,
        time: booking.time,
        notes: booking.notes,
      })

      if (result?.ok) {
        setBookingMessage(result.message)
        setSelectedDoctorId('')
        setBooking({ day: '', time: '', notes: '' })
        setIsBookingModalOpen(false)
        // Send user to their dashboard to view the booked appointment
        navigate('/dashboard')
      } else {
        setBookingMessage(result?.message || 'Booking failed')
      }
    } catch (error) {
      setBookingMessage(error?.message || 'Booking failed')
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
          বিশেষজ্ঞ ডাক্তার খুঁজুন
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>আপনার কাছের সেরা চিকিৎসকের সাথে অ্যাপয়েন্টমেন্ট নিন</p>
      </div>

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '6px 20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
      }}>
        <span style={{ fontSize: '18px', color: '#9ca3af' }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="নাম, বিশেষত্ব বা হাসপাতাল দিয়ে খুঁজুন..."
          style={{
            flex: 1, border: 'none', outline: 'none', fontSize: '15px',
            color: '#111827', padding: '10px 0', background: 'transparent',
          }}
        />
      </div>

      {/* Specialty Filter */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {specialties.map(s => (
          <button key={s} onClick={() => setActiveSpec(s)}
            style={{
              padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
              border: '2px solid',
              borderColor: activeSpec === s ? '#10b981' : 'rgba(0,0,0,0.1)',
              background: activeSpec === s ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
              color: activeSpec === s ? 'white' : '#374151',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >{s}</button>
        ))}
      </div>

      {bookingMessage && (
        <div style={{
          marginBottom: '20px',
          padding: '14px 16px',
          borderRadius: '14px',
          background: 'rgba(16,185,129,0.08)',
          color: '#059669',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          {bookingMessage}
        </div>
      )}

      {isBookingModalOpen && selectedDoctor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => { setIsBookingModalOpen(false); setBookingMessage('') }}
        >
          <div
            style={{
              width: 'min(920px, 100%)',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 24px 80px rgba(2, 6, 23, 0.35)',
              overflow: 'hidden',
            }}
            onClick={event => event.stopPropagation()}
          >
            <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>{selectedDoctor.name}</h3>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>{selectedDoctor.specialty} • {selectedDoctor.location}</p>
              </div>
              <button
                type="button"
                onClick={() => { setIsBookingModalOpen(false); setBookingMessage('') }}
                style={{ border: 'none', background: 'rgba(15, 23, 42, 0.06)', width: '36px', height: '36px', borderRadius: '12px', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }} className="book-grid">
                <div style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.08), rgba(255,255,255,1))', borderRadius: '18px', padding: '18px', border: '1px solid rgba(16,185,129,0.12)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f766e', marginBottom: '10px' }}>Available days</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(selectedDoctor.availableDays || []).length > 0 ? selectedDoctor.availableDays.map(day => {
                      const selected = booking.day === day
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setBooking(previous => ({ ...previous, day }))}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '999px',
                            border: '1px solid',
                            borderColor: selected ? '#059669' : 'rgba(15, 23, 42, 0.12)',
                            background: selected ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
                            color: selected ? 'white' : '#334155',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {day}
                        </button>
                      )
                    }) : (
                      <div style={{ color: '#64748b', fontSize: '14px' }}>এই doctor এখনো free day set করেননি</div>
                    )}
                  </div>

                  <div style={{ marginTop: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                    দিন select করার পরে time লিখে বুক করুন।
                  </div>
                </div>

                <div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <label style={fieldLabel}>Selected day</label>
                      <input value={booking.day} readOnly placeholder="Choose a day" style={fieldInput} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Time</label>
                      <input value={booking.time} onChange={e => setBooking(previous => ({ ...previous, time: e.target.value }))} placeholder="e.g. 10:30 AM" style={fieldInput} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Notes</label>
                      <input value={booking.notes} onChange={e => setBooking(previous => ({ ...previous, notes: e.target.value }))} placeholder="Optional note" style={fieldInput} />
                    </div>
                  </div>

                  {bookingMessage && (
                    <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', color: '#b91c1c', fontSize: '14px' }}>
                      {bookingMessage}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '18px', flexWrap: 'wrap' }}>
                    {!currentUser && (
                      <button
                        type="button"
                        onClick={() => onRequireAuth?.('login')}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(15, 23, 42, 0.12)',
                          background: 'white',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        Login to book
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={submitBooking}
                      disabled={!booking.day || !booking.time}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: booking.day && booking.time ? 'pointer' : 'not-allowed',
                        background: booking.day && booking.time ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(0,0,0,0.08)',
                        color: booking.day && booking.time ? 'white' : '#94a3b8',
                        fontWeight: 700,
                      }}
                    >
                      Book appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className="doc-grid">
        {filtered.map(doc => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onSelect={selectDoctor}
            canBook={currentUser?.role === 'user' && (doc.availableDays || []).length > 0}
            currentUser={currentUser}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '16px' }}>কোনো ডাক্তার পাওয়া যায়নি</p>
        </div>
      )}

      <style>{`@media(max-width:768px){.doc-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

const fieldLabel = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#334155',
  marginBottom: '8px',
}

const fieldInput = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '12px',
  border: '1px solid rgba(15, 23, 42, 0.14)',
  padding: '12px 14px',
  fontSize: '14px',
  background: 'white',
}
