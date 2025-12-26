-- Central database schema
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'doctor', 'patient'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_hospitals (
    user_id INTEGER REFERENCES users(id),
    hospital_id INTEGER REFERENCES hospitals(id),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, hospital_id)
);

-- Per-hospital schema
CREATE SCHEMA IF NOT EXISTS hospital_schema;

CREATE TABLE IF NOT EXISTS hospital_schema.patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    blood_type VARCHAR(5),
    allergies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hospital_schema.doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(100) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hospital_schema.prescriptions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES hospital_schema.patients(id),
    doctor_id INTEGER REFERENCES hospital_schema.doctors(id),
    diagnosis TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hospital_schema.prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES hospital_schema.prescriptions(id),
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- One-hot encoding tables for efficient searching
CREATE TABLE IF NOT EXISTS hospital_schema.medical_conditions (
    id SERIAL PRIMARY KEY,
    condition_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hospital_schema.medications (
    id SERIAL PRIMARY KEY,
    medication_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Junction tables for one-hot encoding
CREATE TABLE IF NOT EXISTS hospital_schema.prescription_conditions (
    prescription_id INTEGER REFERENCES hospital_schema.prescriptions(id),
    condition_id INTEGER REFERENCES hospital_schema.medical_conditions(id),
    PRIMARY KEY (prescription_id, condition_id)
);

CREATE TABLE IF NOT EXISTS hospital_schema.prescription_medications (
    prescription_id INTEGER REFERENCES hospital_schema.prescriptions(id),
    medication_id INTEGER REFERENCES hospital_schema.medications(id),
    PRIMARY KEY (prescription_id, medication_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON hospital_schema.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON hospital_schema.prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription_id ON hospital_schema.prescription_items(prescription_id);