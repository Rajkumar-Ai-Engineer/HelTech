import { useState, useRef } from 'react'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'

export default function Prescription() {
    const [showInfo, setShowInfo] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const fileInputRef = useRef(null)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    const handleUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setIsAnalyzing(true)
        setAnalysisResult(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            console.log('Sending request to:', 'http://localhost:8000/api/prescription/analyze')
            console.log('File:', file.name, file.type)

            const response = await fetch('http://127.0.0.1:8000/api/prescription/analyze', {
                method: 'POST',
                body: formData
            })

            console.log('Response status:', response.status)
            console.log('Response ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error response:', errorText)
                throw new Error(`Server error: ${response.status}`)
            }

            const data = await response.json()
            console.log('Response data:', data)

            if (data.analysis) {
                setAnalysisResult(data.analysis)
            } else {
                setAnalysisResult('No analysis returned from server.')
            }
        } catch (error) {
            console.error('Fetch error:', error)
            setAnalysisResult(`Error: ${error.message}`)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="Prescription AI" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column', background: 'linear-gradient(180deg, var(--bg-color) 0%, rgba(255,255,255,0) 100%)' }}>
                    <div className="view-container" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        padding: '40px',
                        position: 'relative'
                    }}>
                        {/* Info Icon Button */}
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            style={{
                                position: 'absolute',
                                top: '24px',
                                right: '40px',
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748B',
                                fontSize: '24px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                zIndex: 10
                            }}
                            title="Guidelines"
                        >
                            <i className={showInfo ? "ph ph-x" : "ph ph-info"}></i>
                        </button>

                        {!showInfo ? (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />

                                {!analysisResult ? (
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '800px',
                                        padding: '80px 48px',
                                        border: '2px dashed #CBD5E1',
                                        borderRadius: '32px',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        backdropFilter: 'blur(10px)',
                                        textAlign: 'center',
                                        cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: isAnalyzing ? 0.6 : 1
                                    }}
                                        onClick={!isAnalyzing ? handleUpload : undefined}
                                        onMouseEnter={(e) => {
                                            if (!isAnalyzing) {
                                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isAnalyzing) {
                                                e.currentTarget.style.borderColor = '#CBD5E1';
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}>
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            background: isAnalyzing ? 'linear-gradient(135deg, #64748B, #94A3B8)' : 'linear-gradient(135deg, #0D9488, #14B8A6)',
                                            borderRadius: '35px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '32px',
                                            boxShadow: '0 15px 30px rgba(13, 148, 136, 0.2)',
                                            transform: 'rotate(5deg)',
                                            animation: isAnalyzing ? 'spin 2s linear infinite' : 'none'
                                        }}>
                                            <i className={isAnalyzing ? "ph-fill ph-spinner" : "ph-fill ph-upload-simple"} style={{ fontSize: '56px', color: 'white' }}></i>
                                        </div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', color: '#0F172A', letterSpacing: '-0.02em' }}>
                                            {isAnalyzing ? 'Analyzing...' : 'Analyze Prescription'}
                                        </h2>
                                        <p style={{ fontSize: '1.15rem', color: '#64748B', maxWidth: '500px', lineHeight: '1.6', marginBottom: '40px' }}>
                                            {isAnalyzing ? 'Please wait while our AI processes your prescription...' : 'Drop your medical documents here or click to browse. Our AI will automatically extract doses, schedules, and guidance.'}
                                        </p>
                                        {!isAnalyzing && (
                                            <div style={{
                                                padding: '16px 32px',
                                                background: 'var(--primary-color)',
                                                color: 'white',
                                                borderRadius: '16px',
                                                fontWeight: '700',
                                                fontSize: '1.05rem',
                                                boxShadow: '0 10px 15px -3px rgba(0, 121, 107, 0.3)'
                                            }}>
                                                Choose Files
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '800px',
                                        padding: '40px',
                                        background: 'var(--card-bg)',
                                        borderRadius: '24px',
                                        boxShadow: 'var(--shadow-lg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                            <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>Prescription Analysis</h2>
                                            <button
                                                onClick={() => setAnalysisResult(null)}
                                                style={{
                                                    background: 'var(--primary-color)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Analyze Another
                                            </button>
                                        </div>

                                        <div style={{
                                            background: 'var(--bg-color)',
                                            padding: '24px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: '1.6',
                                            fontSize: '0.95rem'
                                        }}>
                                            {analysisResult}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                width: '100%',
                                maxWidth: '800px',
                                padding: '40px',
                                background: 'var(--card-bg)',
                                borderRadius: '24px',
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid var(--border-color)',
                                animation: 'fadeIn 0.3s ease',
                                color: 'var(--text-main)'
                            }}>
                                <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '10px' }}>
                                    User Guide & Guidelines
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                            <i className="ph-fill ph-question" style={{ color: 'var(--secondary-color)' }}></i> How to use it?
                                        </h3>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                            <li>Click the central upload area or drag your file directly onto the screen.</li>
                                            <li>Select a clear image or PDF of your handwritten or digital prescription.</li>
                                            <li>Wait a few seconds for our AI (Sirax) to extract the information.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                            <i className="ph-fill ph-lightning" style={{ color: 'var(--accent-color)' }}></i> What are the outputs?
                                        </h3>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                            <li>Digital list of medications and dosages.</li>
                                            <li>Automated schedule creation for your medicine reminders.</li>
                                            <li>AI-generated summary of medical advice and warnings.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                            <i className="ph-fill ph-check-circle" style={{ color: 'var(--primary-color)' }}></i> Primary Uses
                                        </h3>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                            <li>Digitizing old paper records for easy searching.</li>
                                            <li>Helping cross-reference potential medication interactions.</li>
                                            <li>Quickly sharing prescription details with your doctors.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                            <i className="ph-fill ph-warning-diamond" style={{ color: 'var(--danger-color)' }}></i> Important Guidelines
                                        </h3>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                            <li>Ensure lighting is good when taking a photo of the prescription.</li>
                                            <li>Do not crop out the doctor's name or date of the prescription.</li>
                                            <li><strong>Note:</strong> Always verify AI results with a professional pharmacist.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setShowInfo(false)}
                                        style={{ width: 'auto' }}
                                    >
                                        Back to Upload
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                    <Footer />
                </section>
            </div>
        </>
    )
}

