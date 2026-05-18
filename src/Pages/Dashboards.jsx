import { Link } from 'react-router-dom'
import DashboardLayout from '../Components/DashboardLayout.jsx'

const weekdayLabels = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার']

const userNavItems = [
  { to: '/dashboard', label: 'Overview', icon: '📊' },
  { to: '/dashboard/appointments', label: 'My Appointments', icon: '🗓️' },
  { to: '/doctors', label: 'Find Doctors', icon: '👨‍⚕️' },
  { to: '/human-health', label: 'Health Analysis', icon: '🩺' },
]

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: '📊' },
  { to: '/admin/dashboard/users', label: 'User Management', icon: '👥' },
]

const doctorNavItems = [
  { to: '/doctor/dashboard', label: 'Overview', icon: '📊' },
  { to: '/doctor/dashboard/availability', label: 'Availability', icon: '🗓️' },
  { to: '/doctor/dashboard/appointments', label: 'Appointments', icon: '📋' },
]

function StatCard({ label, value, hint, accent = '#0f766e' }) {
  return (
    <div style={{ padding: '18px', borderRadius: '18px', background: 'linear-gradient(180deg, rgba(15, 118, 110, 0.08), rgba(15, 118, 110, 0.02))', border: '1px solid rgba(15, 118, 110, 0.12)' }}>
      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '30px', fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ marginTop: '8px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{hint}</div>}
    </div>
  )
}

function SectionCard({ title, description, children }) {
  return (
    <div style={{ marginTop: '18px', padding: '20px', borderRadius: '18px', background: 'white', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{title}</h3>
        {description && <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{description}</p>}
      </div>
      {children}
    </div>
  )
}

function AppointmentBadge({ status }) {
  const palette = {
    upcoming: { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669' },
    completed: { bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626' },
  }
  const tone = palette[status] || palette.upcoming
  return (
    <span style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: tone.bg, color: tone.color }}>
      {status}
    </span>
  )
}

function EmptyState({ title, description }) {
  return (
    <div style={{ padding: '28px', borderRadius: '18px', background: 'rgba(15, 23, 42, 0.03)', color: '#475569', textAlign: 'center' }}>
      <div style={{ fontSize: '42px', marginBottom: '10px' }}>🫥</div>
      <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{title}</h4>
      <p style={{ margin: '8px 0 0', fontSize: '14px', lineHeight: 1.7 }}>{description}</p>
    </div>
  )
}

function RolePill({ role }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', borderRadius: '999px', background: 'rgba(15, 118, 110, 0.1)', color: '#0f766e', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
      {role}
    </span>
  )
}

function normalizeId(value) {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object') {
    if (typeof value.id === 'string') {
      return value.id
    }

    if (typeof value._id === 'string') {
      return value._id
    }

    if (typeof value.toString === 'function') {
      return value.toString()
    }
  }

  return String(value)
}

function isDoctorAppointment(appointment, user) {
  if (!appointment || !user) {
    return false
  }

  const appointmentDoctorId = normalizeId(appointment.doctorId)
  const appointmentDoctorUserId = normalizeId(appointment.doctorUserId)
  const appointmentDoctorFirebaseUid = normalizeId(appointment.doctorFirebaseUid)
  const appointmentDoctorEmail = normalizeId(appointment.doctorEmail).toLowerCase()
  const appointmentDoctorName = normalizeId(appointment.doctorName).toLowerCase()
  const userId = normalizeId(user.id)
  const userFirebaseUid = normalizeId(user.firebaseUid)
  const userEmail = normalizeId(user.email).toLowerCase()
  const userName = normalizeId(user.name).toLowerCase()

  return (
    appointmentDoctorId === userId ||
    appointmentDoctorUserId === userId ||
    appointmentDoctorFirebaseUid === userFirebaseUid ||
    (appointmentDoctorEmail && appointmentDoctorEmail === userEmail) ||
    (appointmentDoctorName && appointmentDoctorName === userName)
  )
}

export function UserDashboardOverview({ user, appointments = [], doctors = [], onLogout }) {
  const myAppointments = appointments.filter(item => item.userId === user.id)
  const upcomingCount = myAppointments.filter(item => item.status === 'upcoming').length
  const lastAppointment = myAppointments[0]

  return (
    <DashboardLayout
      user={user}
      title="User Dashboard"
      subtitle="আপনার health journey, bookings, আর doctor access এক জায়গায়"
      navItems={userNavItems}
      onLogout={onLogout}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }} className="dash-stats-grid">
        <StatCard label="Upcoming appointments" value={upcomingCount} hint="বুক করা অ্যাপয়েন্টমেন্ট এখানে দেখাবে" />
        <StatCard label="Available doctors" value={doctors.length} hint="এখন active doctor profiles" accent="#2563eb" />
        <StatCard label="Last booked" value={lastAppointment ? lastAppointment.day : 'N/A'} hint={lastAppointment ? `${lastAppointment.doctorName} • ${lastAppointment.time}` : 'এখনও কোনো booking নেই'} accent="#7c3aed" />
      </div>

      <SectionCard
        title="Quick actions"
        description="Doctors list থেকে নতুন appointment নিতে পারেন অথবা health analysis শুরু করতে পারেন।"
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/doctors" style={quickActionStyle}>👨‍⚕️ ডাক্তার দেখুন</Link>
          <Link to="/human-health" style={quickActionStyle}>🩺 Health analysis</Link>
          <Link to="/remedies" style={quickActionStyle}>💊 Remedies</Link>
        </div>
      </SectionCard>

      <SectionCard
        title="Your recent appointments"
        description="নিচে আপনার upcoming booking list।"
      >
        {myAppointments.length === 0 ? (
          <EmptyState title="No appointments yet" description="Doctors page থেকে appointment booking করুন।" />
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {myAppointments.slice(0, 4).map(appointment => (
              <div key={appointment.id} style={appointmentRowStyle}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{appointment.doctorName}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{appointment.doctorSpecialty} • {appointment.day} • {appointment.time}</div>
                </div>
                <AppointmentBadge status={appointment.status} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  )
}

export function UserAppointmentsDashboard({ user, appointments = [], onLogout }) {
  const myAppointments = appointments.filter(item => item.userId === user.id)

  return (
    <DashboardLayout
      user={user}
      title="My Appointments"
      subtitle="আপনার সব appointment history"
      navItems={userNavItems}
      onLogout={onLogout}
    >
      {myAppointments.length === 0 ? (
        <EmptyState title="No booked appointments" description="Doctors page থেকে প্রথম appointment বুক করুন।" />
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {myAppointments.map(appointment => (
            <div key={appointment.id} style={appointmentRowStyle}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{appointment.doctorName}</h3>
                  <RolePill role={appointment.doctorSpecialty || 'doctor'} />
                </div>
                <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
                  দিন: {appointment.day} • সময়: {appointment.time}
                  {appointment.notes ? ` • Notes: ${appointment.notes}` : ''}
                </p>
              </div>
              <AppointmentBadge status={appointment.status} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export function AdminDashboardOverview({ user, users = [], appointments = [], onLogout }) {
  const doctorCount = users.filter(item => item.role === 'doctor').length
  const userCount = users.filter(item => item.role === 'user').length
  const adminCount = users.filter(item => item.role === 'admin').length

  return (
    <DashboardLayout
      user={user}
      title="Admin Dashboard"
      subtitle="User management আর platform control"
      navItems={adminNavItems}
      onLogout={onLogout}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }} className="dash-stats-grid">
        <StatCard label="Total users" value={users.length} hint="সব registered account" />
        <StatCard label="Doctors" value={doctorCount} hint="doctor role active users" accent="#2563eb" />
        <StatCard label="Users" value={userCount} hint="normal user accounts" accent="#7c3aed" />
        <StatCard label="Appointments" value={appointments.length} hint="system-wide bookings" accent="#dc2626" />
      </div>

      <SectionCard title="Platform summary" description="role distribution এবং quick health check">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }} className="dash-stats-grid">
          <StatCard label="Admins" value={adminCount} hint="control access" accent="#0f172a" />
          <StatCard label="Recent doctors" value={doctorCount} hint="role assigned doctors" accent="#0f766e" />
          <StatCard label="Active appointments" value={appointments.filter(item => item.status === 'upcoming').length} hint="upcoming bookings" accent="#16a34a" />
        </div>
      </SectionCard>

      <SectionCard title="Management shortcut" description="Sidebar থেকে User Management open করে role change করতে পারেন।">
        <Link to="/admin/dashboard/users" style={quickActionStyle}>👥 Open user management</Link>
      </SectionCard>
    </DashboardLayout>
  )
}

export function AdminUsersManagement({ user, users = [], onLogout, onUpdateUserRole }) {
  return (
    <DashboardLayout
      user={user}
      title="User Management"
      subtitle="Admin থেকে user / doctor / admin role update করুন"
      navItems={adminNavItems}
      onLogout={onLogout}
    >
      <SectionCard title="Role editor" description="Role select change করলেই local data update হবে।">
        <div style={{ display: 'grid', gap: '12px' }}>
          {users.map(account => (
            <div key={account.id} style={userRowStyle}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{account.name}</div>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b' }}>{account.email}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <RolePill role={account.role} />
                <select
                  value={account.role}
                  onChange={event => onUpdateUserRole(account.id, event.target.value)}
                  style={selectStyle}
                >
                  <option value="user">user</option>
                  <option value="doctor">doctor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </DashboardLayout>
  )
}

export function DoctorDashboardOverview({ user, appointments = [], onLogout, onUpdateAvailability }) {
  const doctorAppointments = appointments.filter(item => isDoctorAppointment(item, user))
  const upcomingAppointments = doctorAppointments.filter(item => item.status === 'upcoming').length
  const freeDays = user.availableDays || []

  return (
    <DashboardLayout
      user={user}
      title="Doctor Dashboard"
      subtitle="নিজের available দিন, booking, আর patient flow manage করুন"
      navItems={doctorNavItems}
      onLogout={onLogout}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }} className="dash-stats-grid">
        <StatCard label="Upcoming visits" value={upcomingAppointments} hint="ভবিষ্যৎ booking count" />
        <StatCard label="Free days" value={freeDays.length} hint={freeDays.length ? freeDays.join(', ') : 'আপনি এখনও day set করেননি'} accent="#2563eb" />
        <StatCard label="Total appointments" value={doctorAppointments.length} hint="সব booked patient" accent="#7c3aed" />
      </div>

      <SectionCard title="Your availability" description="কোন দিন free আছেন সেটা mark করুন।">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {weekdayLabels.map(day => {
            const selected = freeDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => onUpdateAvailability(day)}
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
          })}
        </div>
      </SectionCard>

      <SectionCard title="Recent bookings" description="আপনার patient appointments।">
        {doctorAppointments.length === 0 ? (
          <EmptyState title="No bookings yet" description="User appointment করলে এখানে দেখাবে।" />
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {doctorAppointments.map(appointment => (
              <div key={appointment.id} style={appointmentRowStyle}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{appointment.userName}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{appointment.day} • {appointment.time}</div>
                </div>
                <AppointmentBadge status={appointment.status} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  )
}

export function DoctorAvailabilityDashboard({ user, onLogout, onUpdateAvailability }) {
  const freeDays = user.availableDays || []

  return (
    <DashboardLayout
      user={user}
      title="Availability"
      subtitle="আপনি কোন কোন দিনে free সেটা mark করুন"
      navItems={doctorNavItems}
      onLogout={onLogout}
    >
      <SectionCard title="Set free days" description="একবার click করলে day add/remove হবে।">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {weekdayLabels.map(day => {
            const selected = freeDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => onUpdateAvailability(day)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor: selected ? '#059669' : 'rgba(15, 23, 42, 0.12)',
                  background: selected ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
                  color: selected ? 'white' : '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {selected ? '✓ ' : ''}{day}
              </button>
            )
          })}
        </div>
      </SectionCard>
    </DashboardLayout>
  )
}

export function DoctorAppointmentsDashboard({ user, appointments = [], onLogout }) {
  const doctorAppointments = appointments.filter(item => isDoctorAppointment(item, user))

  return (
    <DashboardLayout
      user={user}
      title="Appointments"
      subtitle="আপনার booked patient list"
      navItems={doctorNavItems}
      onLogout={onLogout}
    >
      {doctorAppointments.length === 0 ? (
        <EmptyState title="No appointments" description="User booking করলে এখানেই appear করবে।" />
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {doctorAppointments.map(appointment => (
            <div key={appointment.id} style={appointmentRowStyle}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{appointment.userName}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {appointment.day} • {appointment.time}{appointment.notes ? ` • ${appointment.notes}` : ''}
                </div>
              </div>
              <AppointmentBadge status={appointment.status} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

const quickActionStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '14px',
  textDecoration: 'none',
  background: 'linear-gradient(135deg, #0f766e, #10b981)',
  color: 'white',
  fontWeight: 700,
}

const appointmentRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '16px',
  borderRadius: '16px',
  background: 'rgba(15, 23, 42, 0.03)',
  flexWrap: 'wrap',
}

const userRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '16px',
  borderRadius: '16px',
  background: 'rgba(15, 23, 42, 0.03)',
  flexWrap: 'wrap',
}

const selectStyle = {
  minWidth: '120px',
  borderRadius: '12px',
  border: '1px solid rgba(15, 23, 42, 0.14)',
  padding: '10px 12px',
  background: 'white',
  fontSize: '14px',
}
