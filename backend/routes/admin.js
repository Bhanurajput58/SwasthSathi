const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAdminStats, getRecentUsers, getRecentAppointments, getAllUsers, updateUser, deleteUser, getAllDoctors } = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);

router.get('/users/recent', getRecentUsers);

router.get('/users', getAllUsers);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

router.get('/doctors', getAllDoctors);

router.get('/appointments/recent', getRecentAppointments);

module.exports = router; 