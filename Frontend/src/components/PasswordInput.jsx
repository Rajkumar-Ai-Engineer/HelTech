import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export const PasswordInput = ({
    id,
    placeholder,
    value,
    onChange,
    disabled = false,
    autoComplete = 'current-password'
}) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="input-wrapper">
            <input
                type={showPassword ? 'text' : 'password'}
                id={id}
                className="form-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                autoComplete={autoComplete}
                required
            />
            <motion.div
                className="input-icon"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.div>
        </div>
    )
}
