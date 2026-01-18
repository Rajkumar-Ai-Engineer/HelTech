# Appointments Feature Setup

## Database Setup (Supabase)

### Step 1: Run SQL Migration
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `appointments_table.sql`
4. Copy and paste the entire SQL script
5. Click **Run** to execute

This will create:
- ✅ `appointments` table with proper schema
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Auto-update triggers

### Step 2: Verify Setup
Run this query to verify:
```sql
SELECT * FROM appointments LIMIT 1;
```

## Features Implemented

### 🔒 Security
- **User Isolation**: Each user can only see their own appointments
- **Auth-based Access**: Uses `auth.uid()` for all queries
- **RLS Policies**: Enforced at database level

### 📋 Appointment Fields
- Patient Name (required)
- Contact Number (required, 10-digit validation)
- Address (required)
- Symptoms/Condition (required)
- Hospital Selection (required)
- Attender Name (optional)
- Attender Contact (optional, 10-digit validation)
- Status (pending/confirmed/cancelled)
- Appointment Date (auto-generated)

### 🎨 UI Features
- Medical-themed modal design
- Real-time form validation
- Loading states
- Success/error notifications
- Responsive layout
- Keyboard navigation
- Empty state handling

## Usage

### Book Appointment
1. Navigate to Appointments page
2. Click "+ New Appointment"
3. Fill in required fields
4. Click "Book Appointment"

### View Appointments
- All appointments are displayed on the Appointments page
- Sorted by most recent first
- Color-coded status badges

## Testing

1. **Login** with your account
2. **Book** a new appointment
3. **Verify** it appears in the list
4. **Logout** and login with different account
5. **Confirm** you don't see other user's appointments

## Troubleshooting

### "Failed to book appointment"
- Check if SQL migration was run
- Verify user is authenticated
- Check browser console for errors

### "No appointments showing"
- Ensure you're logged in
- Check if appointments exist for your user
- Verify RLS policies are enabled

## Database Schema

```sql
appointments (
  id UUID PRIMARY KEY,
  auth_user_id UUID → auth.users(id),
  patient_name TEXT,
  contact_number TEXT,
  address TEXT,
  symptoms TEXT,
  hospital TEXT,
  attender_name TEXT,
  attender_contact TEXT,
  status TEXT,
  appointment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```
