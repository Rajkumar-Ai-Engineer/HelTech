import { motion } from 'framer-motion'

export const AuthLayout = ({ children }) => {
    return (
        <div className="auth-container">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </div>
    )
}
