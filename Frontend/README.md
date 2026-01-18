# HelTech Login System

A modern, secure authentication system built with React and Supabase, supporting email/password and Google OAuth authentication.

## 🚀 Features

- ✅ Email/Password Authentication
- ✅ Google OAuth Integration
- ✅ Modern UI with Framer Motion animations
- ✅ Toast notifications for user feedback
- ✅ Password visibility toggle
- ✅ Responsive design
- ✅ Protected routes

## 🛠️ Tech Stack

- **Frontend:** React 19.2.3 + Vite 7.2.4
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (Supabase)
- **UI:** Framer Motion, React Hot Toast
- **Routing:** React Router DOM

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # Authentication context
├── lib/             # Supabase client
├── pages/           # Application pages
└── index.css        # Global styles
```

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table with OAuth support
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(10),
    email_id TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    avatar_url TEXT,
    auth_provider TEXT DEFAULT 'email',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔑 Google OAuth Setup

1. **Google Cloud Console:**
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`

2. **Supabase Dashboard:**
   - Go to Authentication → Providers → Google
   - Enable and add Client ID & Secret

See `PROJECT_DOCUMENTATION.md` for detailed setup instructions.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 Documentation

For complete documentation including architecture, database schema, and troubleshooting, see:
- **`PROJECT_DOCUMENTATION.md`** - Complete project documentation

## 🤝 Contributing

This project was built for the TCE Hackathon.

## 📄 License

All rights reserved.
