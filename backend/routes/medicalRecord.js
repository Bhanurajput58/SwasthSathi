const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getPatientMedicalRecords,
  getDoctorMedicalRecords,
  getPatientMedicalRecordsForDoctor,
  addMedicalRecordAttachment,
  removeMedicalRecordAttachment,
  updateFollowUpDate,
  getPendingMedicalRecordsCount
} = require('../controllers/medicalRecordController');

router.use(protect);

// Patient routes
router.get('/patient', authorize('patient'), getPatientMedicalRecords);
router.get('/patient/:id', authorize('patient'), getMedicalRecord);

// Doctor routes
router.post('/', authorize('doctor'), createMedicalRecord);
router.get('/doctor', authorize('doctor'), getDoctorMedicalRecords);
router.get('/doctor/patient/:patientId', authorize('doctor'), getPatientMedicalRecordsForDoctor);
router.get('/doctor/:id', authorize('doctor'), getMedicalRecord);
router.get('/doctor/:id/pending-reports', authorize('doctor'), getPendingMedicalRecordsCount);
router.put('/doctor/:id', authorize('doctor'), updateMedicalRecord);
router.put('/doctor/:id/followup', authorize('doctor'), updateFollowUpDate);
router.post('/doctor/:id/attachments', authorize('doctor'), addMedicalRecordAttachment);
router.delete('/doctor/:id/attachments/:attachmentId', authorize('doctor'), removeMedicalRecordAttachment);

// Admin routes
router.get('/admin', authorize('admin'), getMedicalRecords);
router.get('/admin/:id', authorize('admin'), getMedicalRecord);
router.put('/admin/:id', authorize('admin'), updateMedicalRecord);
router.delete('/admin/:id', authorize('admin'), deleteMedicalRecord);

module.exports = router; 