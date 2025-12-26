const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const MedicalRecord = require('./MedicalRecord');
const Prescription = require('./Prescription');
const Medication = require('./Medication');
const PrescriptionItem = require('./PrescriptionItem');

function setupModels(sequelize) {
  // Initialize all models with the sequelize instance
  const userModel = User(sequelize);
  const patientModel = Patient(sequelize);
  const doctorModel = Doctor(sequelize);
  const medicalRecordModel = MedicalRecord(sequelize);
  const prescriptionModel = Prescription(sequelize);
  const medicationModel = Medication(sequelize);
  const prescriptionItemModel = PrescriptionItem(sequelize);

  // Define relationships

  // User has one Doctor (one-to-one)
  userModel.hasOne(doctorModel, {
    foreignKey: 'user_id',
    as: 'doctorProfile',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  doctorModel.belongsTo(userModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Doctor has many MedicalRecords (one-to-many)
  doctorModel.hasMany(medicalRecordModel, {
    foreignKey: 'doctor_id',
    as: 'medicalRecords',
  });
  medicalRecordModel.belongsTo(doctorModel, {
    foreignKey: 'doctor_id',
    as: 'doctor',
  });

  // Patient has many MedicalRecords (one-to-many)
  patientModel.hasMany(medicalRecordModel, {
    foreignKey: 'patient_id',
    as: 'medicalRecords',
  });
  medicalRecordModel.belongsTo(patientModel, {
    foreignKey: 'patient_id',
    as: 'patient',
  });

  // Doctor has many Prescriptions (one-to-many)
  doctorModel.hasMany(prescriptionModel, {
    foreignKey: 'doctor_id',
    as: 'prescriptions',
  });
  prescriptionModel.belongsTo(doctorModel, {
    foreignKey: 'doctor_id',
    as: 'doctor',
  });

  // Patient has many Prescriptions (one-to-many)
  patientModel.hasMany(prescriptionModel, {
    foreignKey: 'patient_id',
    as: 'prescriptions',
  });
  prescriptionModel.belongsTo(patientModel, {
    foreignKey: 'patient_id',
    as: 'patient',
  });

  // Prescription has many PrescriptionItems (one-to-many)
  prescriptionModel.hasMany(prescriptionItemModel, {
    foreignKey: 'prescription_id',
    as: 'items',
  });
  prescriptionItemModel.belongsTo(prescriptionModel, {
    foreignKey: 'prescription_id',
    as: 'prescription',
  });

  // Medication has many PrescriptionItems (one-to-many)
  medicationModel.hasMany(prescriptionItemModel, {
    foreignKey: 'medication_id',
    as: 'prescriptionItems',
  });
  prescriptionItemModel.belongsTo(medicationModel, {
    foreignKey: 'medication_id',
    as: 'medication',
  });

  // Return all models
  return {
    User: userModel,
    Patient: patientModel,
    Doctor: doctorModel,
    MedicalRecord: medicalRecordModel,
    Prescription: prescriptionModel,
    Medication: medicationModel,
    PrescriptionItem: prescriptionItemModel,
  };
}

module.exports = setupModels;
