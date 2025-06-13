const User = require('../models/User');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    
    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)  // Keep only 5 most recent appointments
      .populate({
        path: 'patient',
        select: 'name email photo'
      })
      .populate({
        path: 'doctor',
        select: 'name email specialization photo'
      });

    if (!appointments) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    // Format appointments for better display
    const formattedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      patient: appointment.patient ? {
        name: appointment.patient.name,
        email: appointment.patient.email,
        photo: appointment.patient.photo
      } : null,
      doctor: appointment.doctor ? {
        name: appointment.doctor.name,
        email: appointment.doctor.email,
        specialization: appointment.doctor.specialization,
        photo: appointment.doctor.photo
      } : null,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
      createdAt: appointment.createdAt
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    res.status(500).json({ message: 'Error fetching recent appointments', error: error.message });
  }
};

// Get all appointments with pagination and filtering
const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { 'patient.name': { $regex: search, $options: 'i' } },
        { 'doctor.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'patient',
        select: 'name email photo phone'
      })
      .populate({
        path: 'doctor',
        select: 'name email specialization photo'
      });

    // Format appointments
    const formattedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      patient: appointment.patient ? {
        name: appointment.patient.name,
        email: appointment.patient.email,
        photo: appointment.patient.photo,
        phone: appointment.patient.phone
      } : null,
      doctor: appointment.doctor ? {
        name: appointment.doctor.name,
        email: appointment.doctor.email,
        specialization: appointment.doctor.specialization,
        photo: appointment.doctor.photo
      } : null,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
      createdAt: appointment.createdAt
    }));

    res.json({
      appointments: formattedAppointments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAppointments: total
    });
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isApproved } = req.body;

    console.log('Approving doctor:', { 
      doctorId, 
      isApproved,
      userRole: req.user.role,
      userId: req.user._id
    });

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    
    if (!doctor) {
      console.log('Doctor not found:', doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('Found doctor:', { 
      id: doctor._id, 
      name: doctor.name, 
      currentApproval: doctor.isApproved 
    });

    doctor.isApproved = isApproved;
    await doctor.save();

    console.log('Doctor approved successfully:', { 
      id: doctor._id, 
      name: doctor.name, 
      newApproval: doctor.isApproved 
    });

    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
      isApproved: doctor.isApproved
    });
  } catch (error) {
    console.error('Error approving doctor:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all patients
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password') 
      .sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Assign doctor to patient
const assignDoctorToPatient = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({ message: 'Patient ID and Doctor ID are required' });
    }

    // Verify both patient and doctor exist
    const [patient, doctor] = await Promise.all([
      User.findOne({ _id: patientId, role: 'patient' }),
      User.findOne({ _id: doctorId, role: 'doctor', isApproved: true })
    ]);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }

    // Find the most recent appointment that needs a doctor
    const appointment = await Appointment.findOne({
      patient: patientId,
      status: 'needs_doctor'
    }).sort({ createdAt: -1 });

    if (!appointment) {
      return res.status(404).json({ 
        message: 'No pending appointment found for this patient' 
      });
    }

    // Update the appointment with the assigned doctor
    appointment.doctor = doctorId;
    appointment.status = 'confirmed';
    await appointment.save();

    // Update doctor's patient count
    await User.findByIdAndUpdate(
      doctorId,
      { $inc: { patientCount: 1 } }
    );

    res.status(200).json({
      message: 'Doctor assigned successfully',
      appointment
    });
  } catch (error) {
    console.error('Error assigning doctor:', error);
    res.status(500).json({ 
      message: 'Error assigning doctor', 
      error: error.message 
    });
  }
};


const getPatientDoctor = async (req, res) => {
  try {
    console.log('Getting doctor details for patient:', req.params.patientId);
    
    const patient = await User.findById(req.params.patientId);
    
    if (!patient) {
      console.log('Patient not found:', req.params.patientId);
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the doctor directly from User collection
    const doctor = await User.findOne({ 
      role: 'doctor',
      isApproved: true
    });

    if (!doctor) {
      console.log('No approved doctor found');
      return res.status(404).json({ message: 'No approved doctor found' });
    }

    console.log('Found doctor:', doctor.name);

    // Return doctor details
    const doctorDetails = {
      name: doctor.name,
      photo: doctor.photo,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      experience: doctor.experience,
      qualification: doctor.qualification,
      address: doctor.address,
      licenseNumber: doctor.licenseNumber || 'Not provided'
    };

    console.log('Sending doctor details:', doctorDetails);
    res.json(doctorDetails);
  } catch (error) {
    console.error('Error in getPatientDoctor:', error);
    res.status(500).json({ 
      message: 'Error fetching doctor details',
      error: error.message 
    });
  }
};

// Get patient details by ID
const getPatientDetails = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id)
      .select('-password')
      .lean();

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Error fetching patient details', error: error.message });
  }
};

module.exports = {
  getAdminStats,
  getRecentUsers,
  getRecentAppointments,
  getAllAppointments,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  getPatients,
  assignDoctorToPatient,
  getPatientDoctor,
  getPatientDetails
}; 