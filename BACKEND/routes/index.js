const express = require('express');
const router = express.Router();

// Import route files
const asRouter = (mod) => (mod && mod.default) ? mod.default : mod;
const authRoutes = asRouter(require('./auth'));
const patientRoutes = asRouter(require('./patient'));
const doctorRoutes = asRouter(require('./doctor'));
const appointmentRoutes = asRouter(require('./appointmentRoutes'));
const emrRoutes = asRouter(require('./emrRoutes'));
const inventoryRoutes = asRouter(require('./inventoryRoutes'));
const pharmacyRoutes = asRouter(require('./pharmacyRoutes'));
const medicineShopRoutes = asRouter(require('./medicineShopRoutes'));
const bedRoutes = asRouter(require('./bedRoutes'));
const healthRoutes = asRouter(require('./healthRoutes'));
const verificationRoutes = asRouter(require('./verificationRoutes'));
const hospitalRoutes = asRouter(require('./hospitalRoutes'));
const testRoutes = asRouter(require('./test'));
const chatbotRoutes = asRouter(require('./chatbotRoutes'));
const patientProfileRoutes = asRouter(require('./patientProfileRoutes'));

// Test routes (no auth required)
router.use('/test', testRoutes);

// API Routes
router.use('/auth', authRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/emr', emrRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/medicine-shops', medicineShopRoutes);
router.use('/beds', bedRoutes);
router.use('/health', healthRoutes);
router.use('/verify', verificationRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/patient-profiles', patientProfileRoutes);
// Remove duplicate route registrations
// router.use('/health', healthRoutes);
// router.use('/verify', verificationRoutes);

module.exports = router;
