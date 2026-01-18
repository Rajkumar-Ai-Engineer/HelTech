import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'

export default function Header({ title, onMenuToggle }) {
    const { user, profile, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)
        : user?.email?.substring(0, 2).toUpperCase() || 'US'

    return (
        <div className="top-bar animate-fade-in" style={{
            animationDuration: '0.4s',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Hamburger Menu Button - Only visible on mobile/tablet */}
                <button
                    className="menu-toggle-btn"
                    onClick={onMenuToggle}
                    aria-label="Toggle menu"
                    style={{
                        display: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#F1F5F9',
                        border: 'none',
                        cursor: 'pointer',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        color: '#64748B'
                    }}
                >
                    <i className="ph-bold ph-list" style={{ fontSize: '24px' }}></i>
                </button>
                <h2 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{title}</h2>
            </div>
            <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#F1F5F9',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        color: '#64748B'
                    }}
                >
                    <i className={theme === 'light' ? 'ph ph-moon' : 'ph ph-sun'} style={{ fontSize: '20px' }}></i>
                </button>

                <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>

                <div className="user-profile-preview" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #0D9488, #0B746B)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>{initials}</div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{profile?.full_name || user?.email || 'User'}</span>
                </div>

                <button
                    onClick={signOut}
                    className="logout-btn-highlighted"
                    title="Sign Out"
                    style={{
                        background: '#FEE2E2',
                        color: '#EF4444',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <i className="ph-bold ph-sign-out"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
