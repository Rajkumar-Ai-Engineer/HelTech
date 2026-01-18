import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { OAuthButtons } from '../components/OAuthButtons'
import toast from 'react-hot-toast'

export const Signup = () => {
    const navigate = useNavigate()
    const { user, signUp, signInWithOAuth, loading: authLoading } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (user && !authLoading) {
            navigate('/patient')
        }
    }, [user, authLoading, navigate])

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return false
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return false
        }

        const phoneRegex = /^[0-9]{10}$/
        if (!phoneRegex.test(formData.mobileNumber.replace(/\D/g, ''))) {
            toast.error('Please enter a valid 10-digit mobile number')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            const { user: newUser, error } = await signUp(
                formData.email,
                formData.password,
                {
                    full_name: formData.fullName,
                    mobile_number: formData.mobileNumber,
                }
            )

            if (newUser && !error) {
                navigate('/login')
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
                    <h1 className="auth-title">Create Patient Account</h1>
                    <p className="auth-subtitle">Join HelTech to manage your health</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 }}
                    >
                        <label htmlFor="fullName" className="form-label">Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                        <input
                            type="text"
                            id="fullName"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={isSubmitting || authLoading}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.14 }}
                    >
                        <label htmlFor="mobileNumber" className="form-label">Mobile Number <span style={{ color: 'var(--error)' }}>*</span></label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            className="form-input"
                            placeholder="Enter your mobile number"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            disabled={isSubmitting || authLoading}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16 }}
                    >
                        <label htmlFor="email" className="form-label">Email <span style={{ color: 'var(--error)' }}>*</span></label>
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
                        transition={{ delay: 0.18 }}
                    >
                        <label htmlFor="password" className="form-label">Password <span style={{ color: 'var(--error)' }}>*</span></label>
                        <PasswordInput
                            id="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isSubmitting || authLoading}
                            autoComplete="new-password"
                        />
                    </motion.div>

                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password <span style={{ color: 'var(--error)' }}>*</span></label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isSubmitting || authLoading}
                            autoComplete="new-password"
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
                        {isSubmitting ? <span className="spinner"></span> : 'Create Account'}
                    </motion.button>
                </form>

                <motion.div
                    className="auth-divider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Or sign up with
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
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign In</Link>
                </motion.div>
            </motion.div>
        </AuthLayout>
    )
}
