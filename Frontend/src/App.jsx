import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { AuthCallback } from './pages/AuthCallback'

// Patient Pages
import Home from './pages/patient/Home'
import Dashboard from './pages/patient/Dashboard'
import Appointments from './pages/patient/Appointments'
import Assistant from './pages/patient/Assistant'
import Prescription from './pages/patient/Prescription'
import Profile from './pages/patient/Profile'

// Styles
import './index.css'
import './styles/style.css'
import './styles/animations.css'
import './styles/ui-enhancements.css'

const PatientArea = ({ children }) => (
    <div className="patient-app">
        {children}
    </div>
)

const RootRedirect = () => {
    const { user, loading } = useAuth()
    if (loading) return null
    return user ? <Navigate to="/patient" replace /> : <Navigate to="/login" replace />
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Protected Patient Routes */}
                        <Route path="/patient" element={<ProtectedRoute><PatientArea><Home /></PatientArea></ProtectedRoute>} />
                        <Route path="/patient/dashboard" element={<ProtectedRoute><PatientArea><Dashboard /></PatientArea></ProtectedRoute>} />
                        <Route path="/patient/appointments" element={<ProtectedRoute><PatientArea><Appointments /></PatientArea></ProtectedRoute>} />
                        <Route path="/patient/assistant" element={<ProtectedRoute><PatientArea><Assistant /></PatientArea></ProtectedRoute>} />
                        <Route path="/patient/prescription" element={<ProtectedRoute><PatientArea><Prescription /></PatientArea></ProtectedRoute>} />
                        <Route path="/patient/profile" element={<ProtectedRoute><PatientArea><Profile /></PatientArea></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="/dashboard" element={<Navigate to="/patient/dashboard" replace />} />
                    </Routes>
                </Router>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#fff',
                            color: '#1F2937',
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontWeight: 600,
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App
