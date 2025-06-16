const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const createAppointment = async (req, res) => {
  try {
    console.log('Received appointment request:', JSON.stringify(req.body, null, 2));
    
    const { doctor, date, time, reason, symptoms, previousHistory } = req.body;
    const patient = req.user._id;

    // Validate required fields
    if (!doctor) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    if (!time) {
      return res.status(400).json({ message: 'Time is required' });
    }

    if (!reason) {
      return res.status(400).json({ message: 'Reason for visit is required' });
    }

    if (!symptoms) {
      return res.status(400).json({ message: 'Symptoms are required' });
    }

    if (!previousHistory) {
      return res.status(400).json({ message: 'Previous medical history is required' });
    }

    // Validate doctor exists and is approved
    const doctorExists = await User.findOne({ 
      _id: doctor, 
      role: 'doctor', 
      isApproved: true 
    });
    
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }

    // Format the date properly
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ 
        message: 'Invalid time format. Please use format HH:MM AM/PM'
      });
    }

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      doctor,
      date: formattedDate,
      time,
      status: { $nin: ['cancelled'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'This time slot is already booked. Please select another time.' 
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient,
      doctor,
      date: formattedDate,
      time: time.trim(),
      reason: reason.trim(),
      symptoms: symptoms.trim(),
      previousHistory: previousHistory.trim(),
      status: 'pending'
    });

    // Validate the appointment
    const validationError = appointment.validateSync();
    if (validationError) {
      return res.status(400).json({ 
        message: 'Invalid appointment data',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    // Save the appointment
    const savedAppointment = await appointment.save();

    // Populate doctor and patient details
    await savedAppointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email specialization photo' }
    ]);

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ 
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email photo')
      .populate('doctor', 'name email specialization photo')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email photo')
      .populate('doctor', 'name email specialization photo');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { date, time, reason, symptoms, previousHistory, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Update fields
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (symptoms) appointment.symptoms = symptoms;
    if (previousHistory) appointment.previousHistory = previousHistory;
    if (notes) appointment.notes = notes;

    await appointment.save();
    await appointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email specialization photo' }
    ]);

    res.json(appointment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to delete
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await appointment.remove();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name email specialization photo')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient appointments', error: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, startDate, endDate } = req.query;
    
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const query = { doctor: doctorId };
    
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email photo')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor appointments', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only doctors can update status
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update appointment status' });
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email specialization photo' }
    ]);

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to cancel
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    await appointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email specialization photo' }
    ]);

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ 
        message: 'Doctor ID, date, and time are required' 
      });
    }

    // Format the date to match the stored format
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);

    // Check if there's an existing appointment
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: formattedDate,
      time: time,
      status: { $nin: ['cancelled'] }
    });

    res.json({ available: !existingAppointment });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      message: 'Error checking availability',
      error: error.message 
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  checkAvailability
}; 