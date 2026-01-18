import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'

export default function Dashboard() {
    const { user } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [upcomingCount, setUpcomingCount] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    const [todayConsultations, setTodayConsultations] = useState(0)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    useEffect(() => {
        if (user) {
            fetchUpcomingAppointments()
        }
        fetchSystemStats()
    }, [user])

    const fetchUpcomingAppointments = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]
            const { data, error } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: false })
                .eq('auth_user_id', user.id)
                .gte('appointment_date', today)
                .order('appointment_date', { ascending: true })

            if (error) throw error
            setUpcomingCount(data?.length || 0)
        } catch (error) {
            console.error('Error fetching appointments:', error)
        }
    }

    const fetchSystemStats = async () => {
        try {
            // Fetch total registered users from profiles table
            const { count: usersCount, error: usersError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            if (!usersError) {
                setTotalUsers(usersCount || 0)
            }

            // Fetch today's appointments as consultations
            const today = new Date().toISOString().split('T')[0]
            const { data: todayAppts, error: apptsError } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: false })
                .eq('appointment_date', today)

            if (!apptsError) {
                setTodayConsultations(todayAppts?.length || 0)
            }
        } catch (error) {
            console.error('Error fetching system stats:', error)
        }
    }

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="Dashboard" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <div className="view-container" style={{ flex: 1 }}>
                        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)', color: 'white', border: 'none', padding: '32px' }}>
                                <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ph-fill ph-calendar" style={{ fontSize: '28px', color: 'white' }}></i>
                                </div>
                                <div className="stat-info" style={{ marginTop: '20px' }}>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }}>{upcomingCount}</h3>
                                    <p style={{ opacity: 0.9, fontWeight: 500, fontSize: '0.95rem' }}>Your Upcoming Appointments</p>
                                </div>
                            </div>
                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)', color: 'white', border: 'none', padding: '32px' }}>
                                <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ph-fill ph-users" style={{ fontSize: '28px', color: 'white' }}></i>
                                </div>
                                <div className="stat-info" style={{ marginTop: '20px' }}>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }}>{totalUsers}</h3>
                                    <p style={{ opacity: 0.9, fontWeight: 500, fontSize: '0.95rem' }}>Total Registered Users</p>
                                </div>
                            </div>
                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', border: 'none', padding: '32px' }}>
                                <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ph-fill ph-heartbeat" style={{ fontSize: '28px', color: 'white' }}></i>
                                </div>
                                <div className="stat-info" style={{ marginTop: '20px' }}>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }}>{todayConsultations}</h3>
                                    <p style={{ opacity: 0.9, fontWeight: 500, fontSize: '0.95rem' }}>Consultations Today</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '48px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>Healthcare Services</h2>
                            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                <Link to="/patient/prescription" className="action-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#F0FDF4', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                        <i className="ph-fill ph-upload-simple" style={{ fontSize: '30px', color: '#16A34A' }}></i>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Analyze Prescription</h3>
                                </Link>
                                <Link to="/patient/assistant" className="action-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#EEF2FF', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                        <i className="ph-fill ph-chat-circle-dots" style={{ fontSize: '30px', color: '#4F46E5' }}></i>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sirax AI Assistant</h3>
                                </Link>
                                <Link to="/patient/appointments" className="action-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#FFF7ED', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                        <i className="ph-fill ph-calendar-plus" style={{ fontSize: '30px', color: '#EA580C' }}></i>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Book Appointment</h3>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </section>
            </div>
        </>
    )
}
