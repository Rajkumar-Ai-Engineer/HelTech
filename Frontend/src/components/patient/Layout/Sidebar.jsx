import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext.jsx'

export default function Sidebar({ isOpen, onClose }) {
    const { user, profile } = useAuth()
    const location = useLocation()
    const userRole = 'patient' // Mapping user to patient role for now

    const isActive = (path) => location.pathname === path ? 'active' : ''

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)
        : user?.email?.substring(0, 2).toUpperCase() || 'US'

    const patientNav = [
        { path: '/patient', icon: 'ph-house', label: 'Home' },
        { path: '/patient/dashboard', icon: 'ph-squares-four', label: 'Dashboard' },
        { path: '/patient/prescription', icon: 'ph-file-text', label: 'Prescription AI' },
        { path: '/patient/assistant', icon: 'ph-robot', label: 'Sirax - AI Health Assistant' },
        { path: '/patient/appointments', icon: 'ph-calendar-check', label: 'Appointment' },
        { path: '/patient/profile', icon: 'ph-user-circle', label: 'Profile' }
    ]

    const hospitalNav = [
        { path: '/', icon: 'ph-house', label: 'Home' },
        { path: '/dashboard', icon: 'ph-squares-four', label: 'Dashboard' },
        { path: '/appointments', icon: 'ph-calendar-check', label: 'Appointment' },
        { path: '/history', icon: 'ph-clock-clockwise', label: 'Records' },
        { path: '/profile', icon: 'ph-hospital', label: 'Profile' }
    ]

    const navItems = userRole === 'patient' ? patientNav : hospitalNav

    return (
        <>
            {/* Overlay for mobile - closes sidebar when clicked */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998,
                        display: 'none'
                    }}
                ></div>
            )}

            <nav className={`sidebar ${isOpen ? 'open' : ''}`} style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '10px 0 30px rgba(0,0,0,0.02)'
            }}>
                <div className="brand" style={{ padding: '32px 24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #0D9488, #0B746B)', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(13, 148, 136, 0.2)' }}>
                            <i className="ph-fill ph-plus-circle" style={{ color: 'white', fontSize: '20px' }}></i>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', margin: 0 }}>HelTech</h1>
                    </div>
                </div>

                <ul className="nav-menu" style={{ padding: '0 16px' }}>
                    {navItems.map((item, idx) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path)}`}
                            onClick={onClose}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '14px',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.2s ease',
                                color: isActive(item.path) ? 'var(--primary-color)' : '#64748B',
                                background: isActive(item.path) ? 'rgba(13, 148, 136, 0.08)' : 'transparent',
                                fontWeight: isActive(item.path) ? 700 : 500
                            }}
                        >
                            <i className={`ph ${item.icon}`} style={{ fontSize: '22px' }}></i>
                            <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                        </Link>
                    ))}
                </ul>


                <div style={{ marginTop: 'auto', padding: '16px' }}>
                    <Link to="/patient/profile" style={{ textDecoration: 'none' }} onClick={onClose}>
                        <div className="user-profile-preview" style={{
                            padding: '12px',
                            borderRadius: '16px',
                            background: '#F8FAFC',
                            border: '1px solid #F1F5F9',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                        }}>
                            <div className="avatar" style={{
                                width: '40px',
                                height: '40px',
                                fontSize: '0.85rem',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, #0D9488, #0B746B)',
                                color: 'white',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700
                            }}>{initials}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || user?.email || 'User'}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Patient Member</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Powered by AI Warriors</div>
                </div>
            </nav>
        </>
    )
}
