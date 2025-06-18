const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getPatientsByDoctor, updatePatientProfile, getPatientProfile, getPatientDetailsForDoctor } = require('../controllers/patientController');

router.use(protect);

// Get patient profile
router.get('/:id', authorize('patient'), getPatientProfile);

// Get patient details for doctor
router.get('/doctor/patient/:id', authorize('doctor'), getPatientDetailsForDoctor);

// Get patients associated with a doctor
router.get('/doctor/:doctorId', authorize('doctor'), getPatientsByDoctor);

// Update patient profile
router.put('/:id', authorize('patient'), updatePatientProfile);

module.exports = router; 