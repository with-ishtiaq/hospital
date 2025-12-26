CREATE SCHEMA IF NOT EXISTS hospital_schema;

CREATE TABLE IF NOT EXISTS hospital_schema.patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
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
    user_id INTEGER,
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

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON hospital_schema.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON hospital_schema.prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription_id ON hospital_schema.prescription_items(prescription_id);
