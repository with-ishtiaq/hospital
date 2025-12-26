-- Add/alter fields for patients and doctors for richer registration
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
  ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
  ADD COLUMN IF NOT EXISTS medical_history TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS hospital VARCHAR(255);

ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS experience INTEGER,
  ADD COLUMN IF NOT EXISTS degree VARCHAR(255),
  ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
  ADD COLUMN IF NOT EXISTS hospital VARCHAR(255);
