import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { OAuthButtons } from '../components/OAuthButtons'

export const Login = () => {
    const navigate = useNavigate()
    const { user, signIn, signInWithOAuth, loading: authLoading } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        if (user && !authLoading) {
            navigate('/patient')
        }
    }, [user, authLoading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const { user: loggedInUser, error } = await signIn(formData.email, formData.password)
            if (loggedInUser && !error) {
                navigate('/patient')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOAuthSignIn = async (provider) => {
        setIsSubmitting(true)
        try {
            await signInWithOAuth(provider)
        } finally {
            // Usually redirects, but if it doesn't, we reset
            setIsSubmitting(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back!</h1>
                    <p className="auth-subtitle">Sign in to your patient account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting || authLoading}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label htmlFor="password" className="form-label">Password</label>
                        <PasswordInput
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isSubmitting || authLoading}
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting || authLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        {isSubmitting ? <span className="spinner"></span> : 'Login'}
                    </motion.button>
                </form>

                <motion.div
                    className="auth-divider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Or continue with
                </motion.div>

                <OAuthButtons
                    onGoogleClick={() => handleOAuthSignIn('google')}
                    disabled={isSubmitting || authLoading}
                />

                <motion.div
                    className="auth-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">Sign Up</Link>
                </motion.div>
            </motion.div>
        </AuthLayout>
    )
}
