import { useState } from 'react'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Profile() {
    const { user, profile } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    const userName = profile?.full_name || user?.email || 'User'
    const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2)

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="Profile" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column', background: 'linear-gradient(180deg, var(--bg-color) 0%, rgba(255,255,255,0) 100%)' }}>
                    <div className="view-container" style={{ flex: 1, padding: '40px' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '48px',
                            borderRadius: '32px',
                            maxWidth: '900px',
                            margin: '0 auto',
                            boxShadow: 'var(--shadow-xl)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '48px', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '140px',
                                    height: '140px',
                                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                    color: 'white',
                                    borderRadius: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3.5rem',
                                    fontWeight: 800,
                                    boxShadow: '0 20px 40px rgba(0, 121, 107, 0.3)',
                                    transform: 'rotate(-5deg)'
                                }}>
                                    {initials}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{userName}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                                        <i className="ph ph-envelope"></i>
                                        <span>{user?.email}</span>
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <i className="ph-fill ph-check-circle"></i>
                                        Verified Patient
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)', margin: '0 0 40px 0' }}></div>

                            <h3 style={{ marginBottom: '32px', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 700 }}>Personal Information</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)', borderRadius: '20px', transition: 'var(--transition)' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                                        <i className="ph ph-user"></i> Full Name
                                    </label>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{profile?.full_name || 'Not provided'}</div>
                                </div>
                                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)', borderRadius: '20px', transition: 'var(--transition)' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                                        <i className="ph ph-phone"></i> Phone Number
                                    </label>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{profile?.phone_number || 'Not provided'}</div>
                                </div>
                                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)', borderRadius: '20px', transition: 'var(--transition)' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                                        <i className="ph ph-fingerprint"></i> Authentication
                                    </label>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'capitalize' }}>{profile?.auth_provider || 'email'}</div>
                                </div>
                                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)', borderRadius: '20px', transition: 'var(--transition)' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                                        <i className="ph ph-calendar"></i> Member Since
                                    </label>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </section>
            </div>
        </>
    )
}
