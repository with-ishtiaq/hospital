const path = require('path');
const fs = require('fs');
 const crypto = require('crypto');
const { pool } = require('../db');

// Configure upload directory for prescription files
const UPLOAD_DIR = path.join(__dirname, '../uploads/prescriptions');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ensurePrescriptionTables = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_prescriptions (
            id uuid PRIMARY KEY,
            patient_id text NOT NULL,
            date timestamptz NOT NULL DEFAULT now(),
            doctor_name text,
            doctor_id text,
            diagnosis text,
            notes text,
            medications jsonb NOT NULL DEFAULT '[]'::jsonb,
            created_at timestamptz NOT NULL DEFAULT now()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_prescription_files (
            id uuid PRIMARY KEY,
            prescription_id uuid NOT NULL REFERENCES patient_prescriptions(id) ON DELETE CASCADE,
            original_name text,
            file_name text,
            file_path text,
            file_type text,
            file_size integer,
            uploaded_at timestamptz NOT NULL DEFAULT now()
        );
    `);
};

const normalizeMedications = (medications) => {
    try {
        if (typeof medications === 'string' && medications.trim()) {
            const m = JSON.parse(medications);
            if (Array.isArray(m)) return m;
        }
    } catch (e) {
        return [];
    }
    return [];
};

// Get patient profile
const getPatientProfile = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        // Ensure prescription tables are present before querying
        await ensurePrescriptionTables();

        // Aggregate prescriptions with files for this patient
        const rxQuery = await pool.query(
            `SELECT p.id,
                    p.date,
                    p.doctor_name,
                    p.doctor_id,
                    p.diagnosis,
                    p.notes,
                    p.medications,
                    COALESCE(
                      json_agg(
                        json_build_object(
                          '_id', f.id,
                          'originalName', f.original_name,
                          'fileName', f.file_name,
                          'filePath', f.file_path,
                          'fileType', f.file_type,
                          'fileSize', f.file_size,
                          'uploadedAt', f.uploaded_at
                        )
                      ) FILTER (WHERE f.id IS NOT NULL),
                      '[]'::json
                    ) AS files
             FROM patient_prescriptions p
             LEFT JOIN patient_prescription_files f ON f.prescription_id = p.id
             WHERE p.patient_id = $1
             GROUP BY p.id
             ORDER BY p.date DESC`,
            [patientId]
        );
        const prescriptions = rxQuery.rows.map(r => ({
            _id: r.id,
            date: r.date,
            doctorName: r.doctor_name,
            doctorId: r.doctor_id,
            diagnosis: r.diagnosis,
            notes: r.notes,
            medications: r.medications,
            files: r.files
        }));

        // Best-effort profile lookup (schema-agnostic)
        // - Avoid assuming columns like first_name/last_name/full_name exist.
        // - Avoid type mismatch by comparing id as text.
        let userRow = null;
        let patientInfoRow = null;
        let legacyPatientRow = null;

        try {
            const u = await pool.query(
                `SELECT * FROM users u WHERE u.id::text = $1 LIMIT 1`,
                [patientId]
            );
            userRow = u.rows[0] || null;
        } catch (e) {
            userRow = null;
        }

        try {
            const pi = await pool.query(
                `SELECT * FROM patient_infos pi WHERE pi.user_id::text = $1 ORDER BY pi.id DESC LIMIT 1`,
                [patientId]
            );
            patientInfoRow = pi.rows[0] || null;
        } catch (e) {
            patientInfoRow = null;
        }

        try {
            const p = await pool.query(
                `SELECT * FROM patients p WHERE p.user_id::text = $1 LIMIT 1`,
                [patientId]
            );
            legacyPatientRow = p.rows[0] || null;
        } catch (e) {
            legacyPatientRow = null;
        }

        // Aggregate health records (EMR) if table exists
        let healthRecords = [];
        try {
            const emrRows = await pool.query(
                `SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY record_date DESC`,
                [patientId]
            );
            healthRecords = emrRows.rows || [];
        } catch (e) {
            // If table doesn't exist or query fails, keep healthRecords empty without failing the profile
            healthRecords = [];
        }

        const baseProfile = {
            patientId,
            user: userRow,
            patientInfo: patientInfoRow,
            patient: legacyPatientRow
        };

        if (!userRow && prescriptions.length === 0 && healthRecords.length === 0) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        res.status(200).json({ success: true, data: { ...baseProfile, prescriptions, healthRecords } });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update patient profile
const updatePatientProfile = async (req, res) => {
    try {
        // Not implemented for Neon-only at the moment
        res.status(501).json({ success: false, message: 'Profile update not implemented for Neon-only mode yet' });
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Upload prescription
const uploadPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        await ensurePrescriptionTables();
        
        const patientId = req.params.patientId;
        const { originalname, mimetype, size, filename, path: uploadedAbsPath } = req.file;
        const { doctorName, doctorId, diagnosis, notes, date, medications } = req.body;

        const meds = normalizeMedications(medications);
        const rxDate = date ? new Date(date) : new Date();
        const relPath = `prescriptions/${filename}`;

        const prescriptionId = crypto.randomUUID();
        const fileId = crypto.randomUUID();

        const inserted = await pool.query(
            `INSERT INTO patient_prescriptions (id, patient_id, date, doctor_name, doctor_id, diagnosis, notes, medications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING *`,
            [prescriptionId, patientId, rxDate, doctorName || null, doctorId || null, diagnosis || null, notes || null, JSON.stringify(meds)]
        );

        const rx = inserted.rows[0];
        const fileInserted = await pool.query(
            `INSERT INTO patient_prescription_files (id, prescription_id, original_name, file_name, file_path, file_type, file_size)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING *`,
            [fileId, rx.id, originalname, filename, relPath, mimetype, size]
        );

        // Return in a shape similar to previous Mongoose output
        return res.status(201).json({
            success: true,
            message: 'Prescription uploaded successfully',
            data: {
                _id: rx.id,
                date: rx.date,
                doctorName: rx.doctor_name,
                doctorId: rx.doctor_id,
                diagnosis: rx.diagnosis,
                notes: rx.notes,
                medications: rx.medications,
                files: [{
                    _id: fileInserted.rows[0].id,
                    originalName: fileInserted.rows[0].original_name,
                    fileName: fileInserted.rows[0].file_name,
                    filePath: fileInserted.rows[0].file_path,
                    fileType: fileInserted.rows[0].file_type,
                    fileSize: fileInserted.rows[0].file_size,
                    uploadedAt: fileInserted.rows[0].uploaded_at
                }]
            }
        });
    } catch (error) {
        console.error('Error uploading prescription:', error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get all prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
    try {
        await ensurePrescriptionTables();
        const patientId = req.params.patientId;
        const result = await pool.query(
            `SELECT p.id,
                    p.patient_id,
                    p.date,
                    p.doctor_name,
                    p.doctor_id,
                    p.diagnosis,
                    p.notes,
                    p.medications,
                    COALESCE(
                      json_agg(
                        json_build_object(
                          '_id', f.id,
                          'originalName', f.original_name,
                          'fileName', f.file_name,
                          'filePath', f.file_path,
                          'fileType', f.file_type,
                          'fileSize', f.file_size,
                          'uploadedAt', f.uploaded_at
                        )
                      ) FILTER (WHERE f.id IS NOT NULL),
                      '[]'::json
                    ) AS files
             FROM patient_prescriptions p
             LEFT JOIN patient_prescription_files f ON f.prescription_id = p.id
             WHERE p.patient_id = $1
             GROUP BY p.id
             ORDER BY p.date DESC`,
            [patientId]
        );

        const data = result.rows.map(r => ({
            _id: r.id,
            date: r.date,
            doctorName: r.doctor_name,
            doctorId: r.doctor_id,
            diagnosis: r.diagnosis,
            notes: r.notes,
            medications: r.medications,
            files: r.files
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get a single prescription
const getPrescription = async (req, res) => {
    try {
        await ensurePrescriptionTables();
        const patientId = req.params.patientId;
        const prescriptionId = req.params.prescriptionId;
        const result = await pool.query(
            `SELECT p.id,
                    p.date,
                    p.doctor_name,
                    p.doctor_id,
                    p.diagnosis,
                    p.notes,
                    p.medications,
                    COALESCE(
                      json_agg(
                        json_build_object(
                          '_id', f.id,
                          'originalName', f.original_name,
                          'fileName', f.file_name,
                          'filePath', f.file_path,
                          'fileType', f.file_type,
                          'fileSize', f.file_size,
                          'uploadedAt', f.uploaded_at
                        )
                      ) FILTER (WHERE f.id IS NOT NULL),
                      '[]'::json
                    ) AS files
             FROM patient_prescriptions p
             LEFT JOIN patient_prescription_files f ON f.prescription_id = p.id
             WHERE p.patient_id = $1 AND p.id = $2
             GROUP BY p.id`,
            [patientId, prescriptionId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }
        const r = result.rows[0];
        return res.status(200).json({
            success: true,
            data: {
                _id: r.id,
                date: r.date,
                doctorName: r.doctor_name,
                doctorId: r.doctor_id,
                diagnosis: r.diagnosis,
                notes: r.notes,
                medications: r.medications,
                files: r.files
            }
        });
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Download prescription file
const downloadPrescriptionFile = async (req, res) => {
    try {
        await ensurePrescriptionTables();
        const patientId = req.params.patientId;
        const prescriptionId = req.params.prescriptionId;
        const fileId = req.params.fileId;

        const result = await pool.query(
            `SELECT f.*
             FROM patient_prescriptions p
             JOIN patient_prescription_files f ON f.prescription_id = p.id
             WHERE p.patient_id = $1 AND p.id = $2 AND f.id = $3`,
            [patientId, prescriptionId, fileId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        const file = result.rows[0];
        const filePath = path.join(__dirname, '..', 'uploads', file.file_path);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on server' });
        }
        
        res.download(filePath, file.original_name || file.file_name);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getPatientProfile,
    updatePatientProfile,
    uploadPrescription,
    getPatientPrescriptions,
    getPrescription,
    downloadPrescriptionFile
};
