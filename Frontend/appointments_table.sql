-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    hospital TEXT NOT NULL,
    specialist TEXT NOT NULL,
    attender_name TEXT,
    attender_contact TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_auth_user_id ON appointments(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own appointments
CREATE POLICY "Users can view own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Create policy: Users can only insert their own appointments
CREATE POLICY "Users can insert own appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = auth_user_id);

-- Create policy: Users can only update their own appointments
CREATE POLICY "Users can update own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- Create policy: Users can only delete their own appointments
CREATE POLICY "Users can delete own appointments"
    ON appointments FOR DELETE
    USING (auth.uid() = auth_user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
