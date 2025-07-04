const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  checkAvailability,
  testAppointmentSave
} = require('../controllers/appointmentController');

router.use(protect);

// Test route (remove in production)
router.post('/test-save', testAppointmentSave);

// Patient routes
router.post('/', authorize('patient'), createAppointment);
router.post('/check-availability', authorize('patient'), checkAvailability);
router.get('/patient', authorize('patient'), getPatientAppointments);
router.get('/patient/:id', authorize('patient'), getAppointment);
router.put('/patient/:id', authorize('patient'), updateAppointment);
router.delete('/patient/:id', authorize('patient'), deleteAppointment);
router.put('/patient/:id/cancel', authorize('patient'), cancelAppointment);

// Doctor routes
router.get('/doctor/:doctorId', authorize('doctor'), getDoctorAppointments);
router.get('/doctor/:doctorId/appointments', authorize('doctor'), getAppointment);
router.put('/doctor/:doctorId/appointments/:id/status', authorize('doctor'), updateAppointmentStatus);

// Admin routes
router.get('/admin', authorize('admin'), getAppointments);
router.get('/admin/:id', authorize('admin'), getAppointment);
router.put('/admin/:id', authorize('admin'), updateAppointment);
router.delete('/admin/:id', authorize('admin'), deleteAppointment);

// Common routes
router.route('/:id')
  .put(updateAppointmentStatus);

module.exports = router; 