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
  getDoctorById,
  getDoctorProfile
} = require('../controllers/doctorController');

// Public routes
router.get('/', getDoctors);

// Protected routes
router.use(protect);

// Doctor profile route - must come before /:id routes
router.get('/profile', authorize('doctor'), getDoctorProfile);

// Doctor and Admin only routes
router.post('/', authorize('admin'), registerDoctor);
router.put('/:id', authorize('doctor', 'admin'), updateDoctor);
router.delete('/:id', authorize('admin'), deleteDoctor);
router.put('/:id/availability', authorize('doctor'), updateDoctorAvailability);

// Public routes that need to come after specific routes
router.get('/:id', getDoctor);
router.get('/:id/availability', getDoctorAvailability);
router.get('/:id/reviews', getDoctorReviews);

// Patient only routes
router.post('/:id/reviews', authorize('patient'), addDoctorReview);

module.exports = router; 