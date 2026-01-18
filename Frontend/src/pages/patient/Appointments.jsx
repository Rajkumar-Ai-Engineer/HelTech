import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'
import AppointmentModal from '../../components/patient/AppointmentModal.jsx'

export default function Appointments() {
    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    useEffect(() => {
        if (user) {
            fetchAppointments()
        }
    }, [user])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const today = new Date().toISOString().split('T')[0]
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('auth_user_id', user.id)
                .gte('appointment_date', today)
                .order('appointment_date', { ascending: true })

            if (error) throw error
            setAppointments(data || [])
        } catch (error) {
            console.error('Error fetching appointments:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            confirmed: 'status-confirmed',
            pending: 'status-pending',
            cancelled: 'status-cancelled'
        }
        return statusMap[status] || 'status-pending'
    }

    const formatDate = (dateString, timeString) => {
        const date = new Date(dateString)
        const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
        return `${dateStr}, ${timeString}`
    }

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="Appointment" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <div className="view-container" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ color: 'var(--text-main)' }}>Upcoming Appointments</h2>
                            <button
                                className="btn-primary"
                                style={{ margin: 0, width: 'auto' }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                + New Appointment
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                Loading appointments...
                            </div>
                        ) : appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <i className="fas fa-calendar-times" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
                                <p>No appointments yet. Book your first appointment!</p>
                            </div>
                        ) : (
                            appointments.map((appointment) => (
                                <div key={appointment.id} className="appointment-card">
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                            <i className="fas fa-hospital"></i>
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'var(--text-main)' }}>{appointment.patient_name}</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {appointment.specialist} • {appointment.hospital}
                                            </p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{appointment.symptoms}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatDate(appointment.appointment_date, appointment.appointment_time)}</div>
                                        <span className={`status-badge ${getStatusBadge(appointment.status)}`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Footer />
                </section>
            </div>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
            />
        </>
    )
}
