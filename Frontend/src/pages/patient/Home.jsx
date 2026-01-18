import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="Home" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <div className="view-container" style={{ flex: 1, padding: '32px' }}>
                        <div className="hero-banner animate-fade-in" style={{
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #0D9488 0%, #0F172A 100%)',
                            padding: '60px 48px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '20px' }}
                                >
                                    Welcome to <span style={{ color: '#5EEAD4' }}>HelTech</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}
                                >
                                    Your complete healthcare management platform powered by next-gen AI intelligence.
                                </motion.p>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                    <Link to="/patient/dashboard" className="btn btn-primary" style={{ padding: '16px 32px', borderRadius: '14px' }}>
                                        <i className="ph-bold ph-arrow-right"></i>
                                        Get Started
                                    </Link>
                                    <Link to="/patient/assistant" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 32px', borderRadius: '14px' }}>
                                        AI Assistant
                                    </Link>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                                <i className="ph-fill ph-circles-three" style={{ fontSize: '280px', color: 'white' }}></i>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', marginTop: '48px' }}>
                            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 700 }}>Quick Actions</h2>
                            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Select a service to begin</p>
                        </div>

                        <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            <Link to="/patient/assistant" className="action-card animate-scale-in" style={{ padding: '32px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', borderRadius: '24px' }}>
                                <div className="action-icon" style={{ background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)', width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <i className="ph-fill ph-robot" style={{ fontSize: '32px', color: '#0D9488' }}></i>
                                </div>
                                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>AI Assistant</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>Chat with Sirax for instant health guidance and symptom analysis.</p>
                            </Link>

                            <Link to="/patient/appointments" className="action-card animate-scale-in" style={{ padding: '32px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', borderRadius: '24px' }}>
                                <div className="action-icon" style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)', width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <i className="ph-fill ph-calendar-plus" style={{ fontSize: '32px', color: '#0284C7' }}></i>
                                </div>
                                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>Appointment</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>Schedule and manage your doctor visits with ease.</p>
                            </Link>
                        </div>
                    </div>
                    <Footer />
                </section>
            </div>
        </>
    )
}
