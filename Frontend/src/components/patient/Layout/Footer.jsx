import { useTheme } from '../../../contexts/ThemeContext.jsx'

export default function Footer() {
    const { theme } = useTheme()

    return (
        <footer style={{
            padding: '24px 32px',
            marginTop: 'auto',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <p>&copy; {new Date().getFullYear()} <strong>HelTech</strong>. All Rights Reserved.</p>
                <span style={{ opacity: 0.5 }}>|</span>
                <p>Powered by <strong style={{ color: 'var(--primary-color)' }}>AI Warriors</strong></p>
            </div>
        </footer>
    )
}
