-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_datetime TIMESTAMP NOT NULL,
    reason TEXT,
    status VARCHAR(32) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications (Pharmacy Catalogue)
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    generic_name VARCHAR(128),
    manufacturer VARCHAR(128),
    strength VARCHAR(32),
    form VARCHAR(32),
    description TEXT
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    medication_id INTEGER REFERENCES medications(id) ON DELETE CASCADE,
    prescription_date DATE NOT NULL,
    dosage VARCHAR(64),
    frequency VARCHAR(64),
    duration VARCHAR(64),
    quantity INTEGER,
    refills_allowed INTEGER DEFAULT 0,
    status VARCHAR(32),
    notes TEXT
);

-- Wards, Rooms, Beds (Bed Management)
CREATE TABLE IF NOT EXISTS wards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    ward_id INTEGER REFERENCES wards(id) ON DELETE CASCADE,
    room_number VARCHAR(16) NOT NULL
);
CREATE TABLE IF NOT EXISTS beds (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    bed_number VARCHAR(16) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS bed_allocations (
    id SERIAL PRIMARY KEY,
    bed_id INTEGER REFERENCES beds(id) ON DELETE CASCADE,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    unit VARCHAR(32),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records (EMR)
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    record_type VARCHAR(32),
    record_date DATE NOT NULL,
    description TEXT NOT NULL,
    details JSONB,
    recorded_by_doctor_id INTEGER REFERENCES doctors(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
