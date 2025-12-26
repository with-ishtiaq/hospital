const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = require('../config/db');
const Doctor = require('../models/doctorModel');

// Connect to DB
connectDB().catch(err => {
  console.error('Database connection error:'.red, err.message);
  process.exit(1);
});

// Sample doctor data
const doctors = [
  {
    doctorName: 'Dr. Emily Carter',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    degrees: ['MD', 'FACC'],
    phoneNumber: '1234567890',
    email: 'emily.carter@example.com',
    password: 'password123',
    employeeId: 'DOC001',
    imagePath: '',
    isActive: true,
    yearsOfExperience: 15,
    languages: ['English', 'Spanish'],
    licenseNumber: 'LIC12345',
    consultationFee: 200,
    availableDays: ['monday', 'wednesday', 'friday'],
  },
  {
    doctorName: 'Dr. Benjamin Lee',
    department: 'Neurology',
    specialization: 'Neuro-Oncology',
    degrees: ['MD', 'PhD'],
    phoneNumber: '0987654321',
    email: 'benjamin.lee@example.com',
    password: 'password123',
    employeeId: 'DOC002',
    imagePath: '',
    isActive: true,
    yearsOfExperience: 12,
    languages: ['English', 'Mandarin'],
    licenseNumber: 'LIC54321',
    consultationFee: 250,
    availableDays: ['tuesday', 'thursday'],
  }
];

// Import sample data into MongoDB
const importData = async () => {
  try {
    // Clear existing data
    await Doctor.deleteMany();

    // Insert sample doctors
    await Doctor.create(doctors);

    console.log('Sample doctor data imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Destroy sample data from MongoDB
const destroyData = async () => {
  try {
    await Doctor.deleteMany();

    console.log('Doctor data destroyed successfully!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
