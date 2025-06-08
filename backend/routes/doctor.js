const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  registerDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  updateDoctorAvailability,
  addDoctorReview,
  getDoctorReviews,
  getDoctorById
} = require('../controllers/doctorController');

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.get('/:id/reviews', getDoctorReviews);

// Protected routes
router.use(protect);

// Doctor and Admin only routes
router.post('/', authorize('admin'), registerDoctor);
router.put('/:id', authorize('doctor', 'admin'), updateDoctor);
router.delete('/:id', authorize('admin'), deleteDoctor);
router.put('/:id/availability', authorize('doctor'), updateDoctorAvailability);

// Patient only routes
router.post('/:id/reviews', authorize('patient'), addDoctorReview);

module.exports = router; 