import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import Navbar from './Components/Navbar.jsx'
import AuthModal from './Components/AuthModal.jsx'
import Home from './Pages/Home.jsx'
import Doctors from './Pages/Doctors/Doctors.jsx'
import Remedies from './Pages/Remedies/Remedies.jsx'
import PetHealth from './Pages/PetHealth/PetHealth.jsx'
import HumanHealth from './Pages/HumanHealth/HumanHealth.jsx'
import MedicineReminders from './Pages/HumanHealth/MedicineReminders.jsx'
import {
  AdminDashboardOverview,
  AdminUsersManagement,
  DoctorAppointmentsDashboard,
  DoctorAvailabilityDashboard,
  DoctorDashboardOverview,
  UserAppointmentsDashboard,
  UserDashboardOverview,
} from './Pages/Dashboards.jsx'
import { apiRequest } from './lib/api.js'
import { auth } from './lib/firebase.js'

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { path: '/human-health', label: 'Health', icon: '🩺' },
  { path: '/medicine-reminders', label: 'Reminders', icon: '💊' },
  { path: '/remedies', label: 'Remedies', icon: '🌿' },
  // { path: '/pet-health', label: 'Pet Health', icon: '🐾' },
]

function defaultDashboardPath(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'doctor') return '/doctor/dashboard'
  return '/dashboard'
}

function formatAuthError(error) {
  const code = error?.code || ''
  const message = error?.message || 'Authentication failed'

  if (code === 'auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.authenticationservice.signup-are-blocked') {
    return 'Firebase signup is blocked for this project. Enable Email/Password sign-in in Firebase Authentication and check API key restrictions / authorized domains.'
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Firebase Email/Password provider is disabled. Turn it on in Firebase Authentication > Sign-in method.'
  }

  if (code === 'auth/invalid-api-key') {
    return 'Firebase API key is missing or invalid. Check the VITE_FIREBASE_* values in .env.'
  }

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase Authentication. Add the current localhost domain in Firebase.'
  }

  return message
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

function RoleRoute({ user, roles, children }) {
  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={defaultDashboardPath(user.role)} replace />
  }

  return children
}

function AppRouter({
  currentUser,
  doctors,
  users,
  appointments,
  reminders,
  onLogout,
  onRequireAuth,
  onBookAppointment,
  onUpdateUserRole,
  onUpdateAvailability,
  onAddReminder,
}) {
  const reminderItems = useMemo(
    () => reminders.filter(item => item.userId === currentUser?.id),
    [currentUser?.id, reminders],
  )

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/doctors"
        element={
          <Doctors
            doctors={doctors}
            currentUser={currentUser}
            onBookAppointment={onBookAppointment}
            onRequireAuth={onRequireAuth}
          />
        }
      />
      <Route path="/human-health" element={<HumanHealth />} />
      <Route
        path="/medicine-reminders"
        element={
          <ProtectedRoute user={currentUser}>
            <MedicineReminders items={reminderItems} onAddReminder={onAddReminder} />
          </ProtectedRoute>
        }
      />
      <Route path="/remedies" element={<Remedies />} />
      <Route path="/pet-health" element={<PetHealth />} />

      <Route
        path="/dashboard"
        element={
          <RoleRoute user={currentUser} roles={['user']}>
            <UserDashboardOverview user={currentUser} appointments={appointments} doctors={doctors} onLogout={onLogout} />
          </RoleRoute>
        }
      />
      <Route
        path="/dashboard/appointments"
        element={
          <RoleRoute user={currentUser} roles={['user']}>
            <UserAppointmentsDashboard user={currentUser} appointments={appointments} onLogout={onLogout} />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute user={currentUser} roles={['admin']}>
            <AdminDashboardOverview user={currentUser} users={users} appointments={appointments} onLogout={onLogout} />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/dashboard/users"
        element={
          <RoleRoute user={currentUser} roles={['admin']}>
            <AdminUsersManagement
              user={currentUser}
              users={users}
              onLogout={onLogout}
              onUpdateUserRole={onUpdateUserRole}
            />
          </RoleRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <RoleRoute user={currentUser} roles={['doctor']}>
            <DoctorDashboardOverview
              user={currentUser}
              appointments={appointments}
              onLogout={onLogout}
              onUpdateAvailability={onUpdateAvailability}
            />
          </RoleRoute>
        }
      />
      <Route
        path="/doctor/dashboard/availability"
        element={
          <RoleRoute user={currentUser} roles={['doctor']}>
            <DoctorAvailabilityDashboard
              user={currentUser}
              onLogout={onLogout}
              onUpdateAvailability={onUpdateAvailability}
            />
          </RoleRoute>
        }
      />
      <Route
        path="/doctor/dashboard/appointments"
        element={
          <RoleRoute user={currentUser} roles={['doctor']}>
            <DoctorAppointmentsDashboard user={currentUser} appointments={appointments} onLogout={onLogout} />
          </RoleRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppShell() {
  const [currentUser, setCurrentUser] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [reminders, setReminders] = useState([])
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })
  const navigate = useNavigate()
  const location = useLocation()

  const loadPublicData = async () => {
    const result = await apiRequest('/api/doctors')
    setDoctors(result.doctors || [])
  }

  const loadPrivateData = async user => {
    const [appointmentsResult, remindersResult, usersResult] = await Promise.all([
      apiRequest('/api/appointments'),
      apiRequest('/api/reminders'),
      user?.role === 'admin' ? apiRequest('/api/users') : Promise.resolve({ users: [] }),
    ])

    setAppointments(appointmentsResult.appointments || [])
    setReminders(remindersResult.reminders || [])
    setUsers(usersResult.users || [])
  }

  async function syncProfile(firebaseUser, desiredRole) {
    return apiRequest('/api/auth/sync', {
      method: 'POST',
      body: {
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Health User',
          photoURL: firebaseUser.photoURL || '',
        },
        desiredRole,
      },
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPublicData().catch(error => {
      console.error('Unable to load doctors', error)
    })

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        setCurrentUser(null)
        setAppointments([])
        setReminders([])
        setUsers([])
        return
      }

      try {
        // Pick up any pending role set by the register form (clears immediately to avoid reuse)
        const pendingRole = sessionStorage.getItem('pendingRole') || undefined
        sessionStorage.removeItem('pendingRole')

        const profile = await syncProfile(firebaseUser, pendingRole)
        setCurrentUser(profile.user)
        await loadPrivateData(profile.user)
        setAuthModal({ open: false, mode: 'login' })
        // Only navigate to dashboard immediately if the user just registered (pendingRole)
        // or if they are currently on the root path. This prevents forcing a redirect
        // when the user visits other pages like /doctors while already signed in.
        if (pendingRole || location.pathname === '/') {
          navigate(defaultDashboardPath(profile.user.role), { replace: true })
        }
      } catch (error) {
        console.error('Unable to sync user', error)
      }
    })

    return unsubscribe
  }, [navigate])

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPrivateData(currentUser).catch(error => {
        console.error('Unable to load private data', error)
      })
    }
  }, [currentUser])

  async function handleAuthSubmit(payload) {
    if (payload?.switchMode) {
      setAuthModal({ open: true, mode: payload.switchMode })
      return
    }

    if (payload.mode === 'register' && payload.password !== payload.confirmPassword) {
      throw new Error('Password confirmation did not match')
    }

    if (payload.mode === 'register') {
      try {
        // Store the desired role BEFORE creating the Firebase account.
        // onAuthStateChanged fires immediately on account creation — before our
        // explicit syncProfile call below — so we use sessionStorage as a bridge
        // to pass the role to that listener without a race condition.
        sessionStorage.setItem('pendingRole', payload.role || 'user')
        const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
        await updateProfile(credential.user, { displayName: payload.name })
        // onAuthStateChanged has already handled the sync with the pendingRole;
        // nothing more to do here — navigate will happen there too.
        return
      } catch (error) {
        sessionStorage.removeItem('pendingRole')
        throw new Error(formatAuthError(error))
      }
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, payload.email, payload.password)
      const profile = await syncProfile(credential.user)
      setCurrentUser(profile.user)
      setAuthModal({ open: false, mode: 'login' })
      navigate(defaultDashboardPath(profile.user.role), { replace: true })
    } catch (error) {
      throw new Error(formatAuthError(error))
    }
  }

  async function handleLogout() {
    await signOut(auth)
    setCurrentUser(null)
    setAppointments([])
    setReminders([])
    setUsers([])
    navigate('/', { replace: true })
  }

  function openAuthModal(mode = 'login') {
    setAuthModal({ open: true, mode })
    // Return a resolved promise so callers can `await onRequireAuth()` if they want
    // to treat the modal opening as an asynchronous operation.
    return Promise.resolve()
  }

  function handleRequireAuth(mode = 'login') {
    return openAuthModal(mode)
  }

  async function handleBookAppointment(payload) {
    if (!currentUser) {
      openAuthModal('login')
      return { ok: false, message: 'Please login first' }
    }

    const doctor = doctors.find(item => item.id === payload.doctorId)
    const response = await apiRequest('/api/appointments', {
      method: 'POST',
      body: {
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        doctorId: payload.doctorId,
        doctorEmail: payload.doctorEmail || '',
        doctorName: doctor?.name || payload.doctorName,
        doctorSpecialty: doctor?.specialty || payload.doctorSpecialty,
        day: payload.day,
        time: payload.time,
        notes: payload.notes || '',
      },
    })

    setAppointments(previous => [response.appointment, ...previous.filter(item => item.id !== response.appointment.id)])
    // Refresh from server so the doctor dashboard gets the canonical appointment payload.
    await loadPrivateData(currentUser)
    return { ok: true, message: 'Appointment booked successfully' }
  }

  async function handleUpdateUserRole(userId, role) {
    const response = await apiRequest(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: { role },
    })

    setUsers(response.users || [])
    if (currentUser?.id === response.user?.id) {
      setCurrentUser(response.user)
    }
    await loadPublicData()
  }

  async function handleUpdateAvailability(day) {
    if (!currentUser) {
      return
    }

    const nextDays = currentUser.availableDays?.includes(day)
      ? currentUser.availableDays.filter(item => item !== day)
      : [...(currentUser.availableDays || []), day]

    const response = await apiRequest(`/api/users/${currentUser.id}/availability`, {
      method: 'PATCH',
      body: { availableDays: nextDays },
    })

    setCurrentUser(response.user)
    await loadPublicData()
  }

  async function handleAddReminder(reminder) {
    if (!currentUser) {
      openAuthModal('login')
      throw new Error('Please login first')
    }

    const response = await apiRequest('/api/reminders', {
      method: 'POST',
      body: {
        userId: currentUser.id,
        text: reminder.text,
        time: reminder.time,
      },
    })

    setReminders(previous => [response.reminder, ...previous.filter(item => item.id !== response.reminder.id)])
    return response.reminder
  }

  return (
    <>
      <Navbar
        user={currentUser}
        links={navLinks}
        dashboardPath={currentUser ? defaultDashboardPath(currentUser.role) : '/'}
        onLoginClick={openAuthModal}
        onLogout={handleLogout}
      />

      <AppRouter
        currentUser={currentUser}
        doctors={doctors}
        users={users}
        appointments={appointments}
        reminders={reminders}
        onLogout={handleLogout}
        onRequireAuth={handleRequireAuth}
        onBookAppointment={handleBookAppointment}
        onUpdateUserRole={handleUpdateUserRole}
        onUpdateAvailability={handleUpdateAvailability}
        onAddReminder={handleAddReminder}
      />

      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: authModal.mode })}
        onSubmit={handleAuthSubmit}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
} 