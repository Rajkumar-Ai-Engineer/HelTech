import { useState, useRef, useEffect } from 'react'
import Sidebar from '../../components/patient/Layout/Sidebar.jsx'
import Header from '../../components/patient/Layout/Header.jsx'
import Footer from '../../components/patient/Layout/Footer.jsx'
import VoiceInput from '../../components/patient/VoiceInput.jsx'

export default function Assistant() {
    const [messages, setMessages] = useState([
        { type: 'bot', text: '👋 Hello! I\'m Sirax\n\nYour AI Health Assistant. Ask me any health-related questions and I\'ll do my best to help you!' },
        {
            type: 'bot',
            text: 'I can help you with:\n• Understanding your symptoms\n• Medication information and side effects\n• General health advice\n• Diet and lifestyle recommendations\n• When to seek medical attention'
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [language, setLanguage] = useState('en-US')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const chatHistoryRef = useRef(null)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
        }
    }, [messages])

    const handleVoiceTranscript = (transcript) => {
        setInput(prev => prev ? `${prev} ${transcript}` : transcript)
    }

    const askQuestion = (question) => {
        setInput(question)
        handleSend(question)
    }

    const handleSend = async (text = input) => {
        if (!text.trim() || isLoading) return

        setMessages(prev => [...prev, { type: 'user', text }])
        setInput('')
        setIsLoading(true)

        try {
            // Dynamic API URL that works both locally and in production
            const API_BASE_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:8000' 
                : `http://${window.location.hostname}:8000`
            
            const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text })
            })

            if (!response.ok) {
                throw new Error('Failed to get response from assistant')
            }

            const data = await response.json()
            setMessages(prev => [...prev, {
                type: 'bot',
                text: data.response
            }])
        } catch (error) {
            console.error('Error:', error)
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title="Sirax - AI Health Assistant" onMenuToggle={toggleSidebar} />
                <section className="view-section active" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <div className="view-container" style={{ flex: 1 }}>
                        {/* Welcome Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                            color: 'white',
                            padding: '48px',
                            borderRadius: '32px',
                            marginBottom: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '32px',
                            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
                                <i className="ph-fill ph-robot" style={{ fontSize: '200px' }}></i>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #0D9488, #0B746B)',
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                boxShadow: '0 12px 24px rgba(13, 148, 136, 0.3)',
                                zIndex: 1
                            }}>
                                <i className="ph-fill ph-robot"></i>
                            </div>
                            <div style={{ flex: 1, zIndex: 1 }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>Sirax AI Health Companion</h2>
                                <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.5' }}>Your personalized intelligence for symptom analysis and health guidance.</p>
                            </div>
                        </div>

                        {/* Quick Suggestions */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                <div style={{ width: '8px', height: '24px', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Common Queries</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <button onClick={() => askQuestion('What are the side effects of my medications?')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '20px 24px', borderRadius: '20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div style={{ color: '#0D9488', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ph-fill ph-warning-circle"></i></div>
                                    <span>Side effects of medications?</span>
                                </button>
                                <button onClick={() => askQuestion('How should I take my prescribed medicines?')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '20px 24px', borderRadius: '20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div style={{ color: '#0284C7', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ph-fill ph-pill"></i></div>
                                    <span>Medication schedules?</span>
                                </button>
                                <button onClick={() => askQuestion('What diet should I follow?')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '20px 24px', borderRadius: '20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div style={{ color: '#F59E0B', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ph-fill ph-apple-logo"></i></div>
                                    <span>Dietary recommendations?</span>
                                </button>
                            </div>
                        </div>

                        {/* Chat Container */}
                        <div className="chat-container animate-fade-in">
                            <div className="chat-history" ref={chatHistoryRef}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message ${msg.type} animate-fade-in`} style={{ animationDuration: '0.3s' }}>
                                        {msg.text.split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line}
                                                {i < msg.text.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Input Area with Voice */}
                            <div className="chat-input-area" style={{ background: 'var(--card-bg)', display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={input}
                                    style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', flex: 1 }}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your health question here... (e.g., 'What causes headaches?')"
                                />
                                <VoiceInput
                                    onTranscript={handleVoiceTranscript}
                                    language={language}
                                />
                                <button className="send-btn" onClick={() => handleSend()}>
                                    <i className="ph-bold ph-paper-plane-right"></i>
                                </button>
                            </div>

                            {/* Language Selector */}
                            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => setLanguage('en-US')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: language === 'en-US' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                        background: language === 'en-US' ? 'var(--primary-light)' : 'transparent',
                                        color: language === 'en-US' ? 'var(--primary-color)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    🇬🇧 English
                                </button>
                                <button
                                    onClick={() => setLanguage('ta-IN')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: language === 'ta-IN' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                        background: language === 'ta-IN' ? 'var(--primary-light)' : 'transparent',
                                        color: language === 'ta-IN' ? 'var(--primary-color)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    🇮🇳 Tamil
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </section>
            </div>
        </>
    )
}
