const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');


const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes } = req.body;
    const doctorId = req.user._id;

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const medicalRecord = await MedicalRecord.create({
      patient: patientId,
      doctor: doctorId,
      diagnosis,
      prescription,
      notes
    });

    res.status(201).json(medicalRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name email');
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateMedicalRecord = async (req, res) => {
  try {
    const { diagnosis, prescription, notes } = req.body;
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (req.user._id.toString() !== record.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    record.diagnosis = diagnosis || record.diagnosis;
    record.prescription = prescription || record.prescription;
    record.notes = notes || record.notes;

    await record.save();
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    await record.remove();
    res.json({ message: 'Medical record removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getPatientMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getDoctorMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctor: req.user._id })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const addMedicalRecordAttachment = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (req.user._id.toString() !== record.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to add attachments' });
    }

    res.json({ message: 'Attachment added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeMedicalRecordAttachment = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (req.user._id.toString() !== record.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to remove attachments' });
    }

    res.json({ message: 'Attachment removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFollowUpDate = async (req, res) => {
  try {
    const { followUpDate } = req.body;
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (req.user._id.toString() !== record.doctor.toString()) {
      return res.status(403).json({ message: 'Not authorized to update follow-up date' });
    }

    record.followUpDate = followUpDate;
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPendingMedicalRecordsCount = async (req, res) => {
  try {
    const count = await MedicalRecord.countDocuments({
      doctor: req.params.id,
      status: 'pending'
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error fetching pending reports count:', error);
    res.status(500).json({ message: 'Error fetching pending reports count', error: error.message });
  }
};

// Get patient medical records for doctor
const getPatientMedicalRecordsForDoctor = async (req, res) => {
  try {
    console.log('Doctor fetching medical records for patient:', req.params.patientId);
    
    // Check if the doctor has any appointments with this patient
    const Appointment = require('../models/Appointment');
    const appointment = await Appointment.findOne({
      doctor: req.user._id,
      patient: req.params.patientId
    });

    if (!appointment) {
      console.log('Doctor not authorized to access this patient\'s records');
      return res.status(403).json({ message: 'Not authorized to access this patient\'s records' });
    }

    // Get medical records for this patient
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${records.length} medical records for patient`);
    res.json(records);
  } catch (error) {
    console.error('Error fetching patient medical records for doctor:', error);
    res.status(500).json({ message: 'Error fetching patient medical records', error: error.message });
  }
};

module.exports = {
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
}; 