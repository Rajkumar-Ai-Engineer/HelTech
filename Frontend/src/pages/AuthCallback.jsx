import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const AuthCallback = () => {
    const navigate = useNavigate()
    const { syncProfile } = useAuth()
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the auth code from URL
                const { data, error } = await supabase.auth.getSession()

                if (error) throw error

                if (data.session) {
                    // Sync OAuth user profile to profiles table
                    try {
                        await syncProfile(data.session.user)
                    } catch (syncError) {
                        console.error('Profile sync error:', syncError)

                        // Check if it's a database schema issue
                        if (syncError.message?.includes('auth_user_id') ||
                            syncError.code === '42703') {
                            setError('Database setup incomplete. Please run migration SQL in Supabase Dashboard.')
                            setTimeout(() => {
                                navigate('/login', { replace: true })
                            }, 5000)
                            return
                        }
                    }

                    toast.success('Welcome back!')

                    // Redirect to dashboard immediately
                    navigate('/patient', { replace: true })
                } else {
                    throw new Error('No session found')
                }
            } catch (err) {
                console.error('Auth callback error:', err)
                setError(err.message)
                setTimeout(() => {
                    navigate('/login', { replace: true })
                }, 3000)
            }
        }

        handleCallback()
    }, [navigate, syncProfile])

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
                padding: '2rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        textAlign: 'center',
                        maxWidth: '400px'
                    }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                    <h2 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>
                        Authentication Failed
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {error}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Redirecting to login...
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    textAlign: 'center',
                    maxWidth: '400px'
                }}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        fontSize: '3rem',
                        marginBottom: '1rem'
                    }}
                >
                    🔐
                </motion.div>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Completing Sign In...
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Please wait while we set up your account
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            </motion.div>
        </div>
    )
}
