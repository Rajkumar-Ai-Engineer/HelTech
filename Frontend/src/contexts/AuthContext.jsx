import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    // Check for existing session on mount
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                loadUserProfile(session.user.id)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                await loadUserProfile(session.user.id)
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Load user profile from profiles table
    const loadUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', userId)
                .single()

            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error loading profile:', error)
        }
    }

    // Create or update profile for OAuth users
    const syncProfile = async (authUser) => {
        try {
            const profileData = {
                auth_user_id: authUser.id,
                email_id: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
                avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
                auth_provider: authUser.app_metadata?.provider || 'email',
            }

            const { data, error } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'auth_user_id' })
                .select()
                .single()

            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error syncing profile:', error)
        }
    }

    const signUp = async (email, password, metadata = {}) => {
        try {
            setLoading(true)

            // Sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: metadata.full_name,
                        mobile_number: metadata.mobile_number,
                    },
                },
            })

            if (error) throw error

            // Check if email confirmation is required
            if (data?.user && !data?.session) {
                toast.success('Please check your email to confirm your account')
                return { user: data.user, error: null }
            }

            // Create profile record
            if (data?.user) {
                try {
                    const profileData = {
                        auth_user_id: data.user.id,
                        email_id: email,
                        full_name: metadata.full_name,
                        phone_number: metadata.mobile_number,
                        auth_provider: 'email',
                    }

                    const { data: profileResult, error: profileError } = await supabase
                        .from('profiles')
                        .insert([profileData])
                        .select()
                        .single()

                    if (profileError) throw profileError
                    setProfile(profileResult)
                } catch (profileError) {
                    // If profile creation fails due to missing column, show helpful message
                    console.error('Profile creation error:', profileError)

                    if (profileError.message?.includes('auth_user_id') ||
                        profileError.code === '42703') {
                        toast.error('⚠️ Database setup incomplete! Please run migration SQL in Supabase')
                        console.error('❌ Missing database columns! Run migration SQL in Supabase Dashboard')
                        console.error('📋 See QUICK_FIX.md for instructions')
                    } else {
                        toast.error('Database error: ' + profileError.message)
                    }

                    // Sign out the auth user since profile creation failed
                    await supabase.auth.signOut()
                    return { user: null, error: profileError }
                }
            }

            toast.success('Account created successfully!')
            return { user: data.user, error: null }
        } catch (error) {
            const message = error.message === 'User already registered'
                ? 'Email already registered'
                : error.message || 'Failed to create account'
            toast.error(message)
            return { user: null, error }
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (email, password) => {
        try {
            setLoading(true)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Load profile immediately
            await loadUserProfile(data.user.id)

            toast.success('Welcome back!')
            return { user: data.user, error: null }
        } catch (error) {
            toast.error('Invalid email or password')
            return { user: null, error }
        } finally {
            setLoading(false)
        }
    }

    const signInWithOAuth = async (provider) => {
        try {
            setLoading(true)

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error

            // The redirect happens automatically, but we reset loading just in case the redirect is slow or doesn't happen
            return { data, error: null }
        } catch (error) {
            toast.error(`Failed to sign in with ${provider}`)
            return { data: null, error }
        } finally {
            // Note: If redirect happens, this state is lost anyway. If not, it restores the UI.
            setLoading(false)
        }
    }

    const signOut = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            setUser(null)
            setProfile(null)
            toast.success('Signed out successfully')
            // Use window.location for redirect (works outside Router context)
            window.location.href = '/login'
        } catch (error) {
            toast.error(error.message || 'Failed to sign out')
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        syncProfile,
        isConfigured: true,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
