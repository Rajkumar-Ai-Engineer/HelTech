import { useState } from 'react'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'

export default function History() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    const sampleHistory = [
        { id: 1, date: '2024-01-10', doctor: 'Dr. Sarah Smith', diagnosis: 'Annual Checkup', status: 'Completed' },
        { id: 2, date: '2023-12-15', doctor: 'Dr. John Doe', diagnosis: 'Flu Treatment', status: 'Completed' },
        { id: 3, date: '2023-11-20', doctor: 'Dr. Emily White', diagnosis: 'Blood Test Results', status: 'Completed' }
    ]

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="History" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <div className="view-container" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ color: 'var(--text-main)' }}>Medical History</h2>
                            <button className="btn-primary" style={{ margin: 0, width: 'auto' }}>
                                <i className="ph ph-funnel"></i> Filter
                            </button>
                        </div>

                        {sampleHistory.map(record => (
                            <div key={record.id} className="appointment-card">
                                <div>
                                    <h4 style={{ color: 'var(--text-main)' }}>{record.diagnosis}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                        {record.doctor} • {record.date}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="status-badge status-confirmed">{record.status}</span>
                                    <button style={{
                                        marginTop: '8px',
                                        padding: '8px 16px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer',
                                        display: 'block',
                                        marginLeft: 'auto',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Footer />
                </section>
            </div>
        </>
    )
}
