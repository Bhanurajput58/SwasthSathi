const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAdminStats, getRecentUsers, getRecentAppointments, getAllUsers, updateUser, deleteUser, getAllDoctors, approveDoctor, getPatients, assignDoctorToPatient, getPatientDoctor, getPatientDetails } = require('../controllers/adminController');

router.use(protect);

// Admin only routes
router.get('/stats', authorize('admin'), getAdminStats);
router.get('/recent-users', authorize('admin'), getRecentUsers);
router.get('/recent-appointments', authorize('admin'), getRecentAppointments);
router.get('/users', authorize('admin'), getAllUsers);
router.get('/doctors', authorize('admin'), getAllDoctors);
router.get('/patients', authorize('admin'), getPatients);
router.get('/patients/:id', authorize('admin'), getPatientDetails);
router.post('/assign-doctor', authorize('admin'), assignDoctorToPatient);
router.patch('/doctors/:doctorId/approve', authorize('admin'), approveDoctor);
router.put('/users/:id', authorize('admin'), updateUser);
router.delete('/users/:id', authorize('admin'), deleteUser);

// Get doctor details for a patient
router.get('/patient/:patientId/doctor', authorize('admin'), getPatientDoctor);

module.exports = router; 