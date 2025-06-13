const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPatients,
  getDoctors,
  approveDoctor,
  rejectDoctor,
  assignDoctorToPatient,
  getPatientDoctor,
  getPatientDetails,
  getAllAppointments
} = require('../controllers/adminController');

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Patient routes
router.get('/patients', getPatients);
router.get('/patients/:id', getPatientDetails);
router.post('/assign-doctor', assignDoctorToPatient);
router.get('/patient/:patientId/doctor', getPatientDoctor);

// Doctor routes
router.get('/doctors', getDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);

// New route for all appointments
router.get('/appointments', getAllAppointments);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Admin route error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = router; 