const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getPatientsByDoctor } = require('../controllers/patientController');

router.use(protect);

// Get patients associated with a doctor
router.get('/doctor/:doctorId', authorize('doctor'), getPatientsByDoctor);

module.exports = router; 