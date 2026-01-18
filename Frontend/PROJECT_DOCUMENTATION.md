# HelTech Login System - Project Documentation

## 📋 Project Overview

**Project Name:** HelTech Login System  
**Type:** React + Vite Web Application  
**Purpose:** Patient authentication system with email/password and Google OAuth  
**Status:** 🔴 Database configuration issue preventing signups

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** React 19.2.3
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.11.0
- **Animations:** Framer Motion 12.24.7
- **UI Notifications:** React Hot Toast 2.6.0
- **Icons:** Lucide React 0.562.0

### Backend/Database
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **API:** Supabase Client (@supabase/supabase-js 2.89.0)

---

## 📁 Project Structure

```
d:\TCE Hackathon\Login\
├── src/
│   ├── components/
│   │   ├── AuthLayout.jsx          # Authentication page wrapper
│   │   ├── OAuthButtons.jsx        # Google OAuth button component
│   │   └── PasswordInput.jsx       # Password field with visibility toggle
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── lib/
│   │   └── supabase.js             # Supabase client configuration
│   ├── pages/
│   │   ├── AuthCallback.jsx        # OAuth redirect handler
│   │   ├── Dashboard.jsx           # Post-login dashboard
│   │   ├── Login.jsx               # Login page
│   │   └── Signup.jsx              # Registration page
│   ├── App.jsx                     # Main app component with routes
│   ├── index.css                   # Global styles
│   └── main.jsx                    # React entry point
├── package.json
├── vite.config.js
├── index.html
└── Documentation files (*.md)
```

---

## 🔐 Authentication Flow

### Email/Password Signup
1. User fills form: Full Name, Mobile, Email, Password
2. `AuthContext.signUp()` → Supabase Auth creates user
3. Profile record inserted into `profiles` table
4. Redirect to login

### Email/Password Login
1. User enters credentials
2. `AuthContext.signIn()` → Supabase Auth validates
3. Load user profile from `profiles` table
4. Redirect to dashboard

### Google OAuth
1. User clicks "Sign in with Google"
2. `signInWithOAuth()` → Redirects to Google
3. Google authenticates → Redirects to `/auth/callback`
4. `AuthCallback` component syncs profile
5. Redirect to dashboard

---

## 🗄️ Database Schema

### Current `profiles` Table Structure
```sql
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    email_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### ❌ PROBLEM: Missing Columns for OAuth

The above schema is missing required columns for Supabase Auth integration.

### ✅ REQUIRED Schema
```sql
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,  -- ⚠️ MISSING
    full_name TEXT NOT NULL,
    phone_number VARCHAR(10),
    email_id TEXT NOT NULL UNIQUE,
    password_hash TEXT,                                                      -- ⚠️ Should be nullable
    avatar_url TEXT,                                                        -- ⚠️ MISSING
    auth_provider TEXT DEFAULT 'email',                                     -- ⚠️ MISSING
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## 🚨 Current Issue: Database Error

### Error Message
```
"database error saving new user"
```

### Root Cause
The `profiles` table is missing the `auth_user_id` column that links to Supabase's `auth.users` table.

### Where It Fails
**File:** `src/contexts/AuthContext.jsx`  
**Line:** ~115-125  
**Function:** `signUp()`

```javascript
// This INSERT fails because auth_user_id column doesn't exist
await supabase.from('profiles').insert([
    {
        auth_user_id: data.user.id,  // ❌ Column doesn't exist
        email_id: email,
        full_name: metadata.full_name,
        phone_number: metadata.mobile_number,
        auth_provider: 'email',
    },
])
```

### Impact
- ❌ Email/password signup fails
- ❌ Google OAuth signup fails
- ❌ Users cannot register

---

## 🔧 Solution Required

### SQL to Run in Supabase Dashboard

```sql
-- Add missing OAuth columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';

-- Make password optional for OAuth users
ALTER TABLE profiles 
ALTER COLUMN password_hash DROP NOT NULL,
ALTER COLUMN phone_number DROP NOT NULL;

-- Add performance index
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);

-- Create trigger for automatic OAuth profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email_id, full_name, avatar_url, auth_provider)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    COALESCE(new.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email_id = EXCLUDED.email_id,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Steps to Apply Fix
1. Open Supabase Dashboard: https://app.supabase.com
2. Navigate to SQL Editor (left sidebar)
3. Click "+ New query"
4. Paste the SQL above
5. Click "Run"
6. Verify "Success" messages appear

---

## 📝 Key Files Explained

### 1. `src/contexts/AuthContext.jsx` (Core Authentication)
**Purpose:** Manages all authentication logic  
**Key Functions:**
- `signUp(email, password, metadata)` - Email/password registration
- `signIn(email, password)` - Email/password login
- `signInWithOAuth(provider)` - Google OAuth
- `signOut()` - Logout
- `loadUserProfile(userId)` - Fetch profile data
- `syncProfile(authUser)` - Create/update profile for OAuth users

**Dependencies:**
- Supabase client
- Database trigger for OAuth users

### 2. `src/pages/AuthCallback.jsx`
**Purpose:** Handles OAuth redirect after Google authentication  
**Flow:**
1. Extracts session from URL
2. Syncs user profile to database
3. Redirects to dashboard

### 3. `src/lib/supabase.js`
**Purpose:** Supabase client configuration  
**Environment Variables Required:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. `src/components/OAuthButtons.jsx`
**Purpose:** Renders Google OAuth button  
**Note:** Facebook OAuth was removed per user request

---

## 🔑 Environment Configuration

### Required Environment Variables
Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Google OAuth Setup (If Not Done)
1. Google Cloud Console: https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Configure in Supabase: Authentication → Providers → Google

---

## 🎯 Testing Checklist

### After Database Fix
- [ ] Email signup works (no database error)
- [ ] Email login works
- [ ] Google OAuth redirects properly
- [ ] Google OAuth creates profile automatically
- [ ] Users appear in Supabase: Authentication → Users
- [ ] Profiles created in `profiles` table
- [ ] Dashboard loads after login

---

## 🐛 Known Issues

### 1. Database Configuration Error ⚠️ CRITICAL
**Status:** 🔴 Blocking all signups  
**Priority:** P0 - Must fix first  
**Fix:** Run database migration SQL (see Solution section)

### 2. Google OAuth redirect_uri_mismatch (If Occurs)
**Cause:** Redirect URI in Google Cloud Console doesn't match Supabase  
**Fix:** Add exact Supabase callback URL to Google OAuth credentials  
**Format:** `https://PROJECT-REF.supabase.co/auth/v1/callback`

---

## 📊 Project Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.89.0",
    "@vitejs/plugin-react": "^5.1.2",
    "framer-motion": "^12.24.7",
    "lucide-react": "^0.562.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.11.0"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "vite": "^7.2.4"
  }
}
```

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at: http://localhost:5173
```

---

## 📞 Discussion Points for Team

1. **Database Migration**
   - Who has access to Supabase Dashboard?
   - Can we schedule a time to run the migration SQL?
   - Do we need to backup data first?

2. **Testing After Fix**
   - Who will test email signup?
   - Who will test Google OAuth?
   - Should we test with real user accounts?

3. **Production Deployment**
   - When do we plan to deploy?
   - Do we need to configure Google OAuth for production domain?
   - What's our rollback plan?

4. **Future Enhancements**
   - Email verification (currently disabled)
   - Password reset functionality
   - Profile editing
   - Additional OAuth providers?

---

## 📄 Additional Documentation Files

- `FIX_DATABASE.sql` - Complete database migration SQL
- `SIMPLE_FIX_STEPS.md` - Step-by-step database fix guide
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth configuration guide
- `OAUTH_SETUP_GUIDE.md` - Complete OAuth setup documentation
- `DEBUG_OAUTH_AND_DATABASE.md` - Troubleshooting guide

---

## ✅ Action Items

### Immediate (P0)
1. [ ] Run database migration SQL in Supabase
2. [ ] Verify columns were added successfully
3. [ ] Test email signup
4. [ ] Test Google OAuth

### Short Term (P1)
1. [ ] Configure Google OAuth (if not done)
2. [ ] Test all authentication flows
3. [ ] Set up production environment variables

### Long Term (P2)
1. [ ] Add email verification
2. [ ] Implement password reset
3. [ ] Add profile editing UI
4. [ ] Set up error monitoring (Sentry, LogRocket, etc.)

---

**Last Updated:** January 7, 2026  
**Status:** 🔴 Database migration required before deployment  
**Next Step:** Run migration SQL in Supabase Dashboard
