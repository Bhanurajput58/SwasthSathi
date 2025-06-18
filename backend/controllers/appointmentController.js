const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const createAppointment = async (req, res) => {
  try {
    // Test database connection
    console.log('=== DATABASE CONNECTION TEST ===');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    const { doctor, date, time, reason, symptoms, previousHistory } = req.body;
    const patient = req.user._id;

    console.log('=== APPOINTMENT CREATION START ===');
    console.log('Received appointment data:', {
      doctor,
      date,
      time,
      reason: reason?.length,
      symptoms: symptoms?.length,
      previousHistory: previousHistory?.length
    });
    console.log('Patient ID:', patient);
    console.log('User role:', req.user.role);

    // Validate required fields
    const requiredFields = {
      doctor: 'Doctor ID',
      date: 'Date',
      time: 'Time',
      reason: 'Reason for visit',
      symptoms: 'Symptoms',
      previousHistory: 'Previous medical history'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        console.log(`Missing required field: ${field}`);
        return res.status(400).json({ 
          success: false,
          message: `${label} is required` 
        });
      }
    }

    // Validate doctor exists and is approved
    const doctorExists = await User.findOne({ 
      _id: doctor, 
      role: 'doctor', 
      isApproved: true 
    });
    
    if (!doctorExists) {
      console.log('Doctor not found or not approved:', doctor);
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or not approved' 
      });
    }

    console.log('Doctor found:', doctorExists.name);

    // Format the date properly
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);

    console.log('Original date:', date);
    console.log('Formatted date:', formattedDate);

    if (isNaN(formattedDate.getTime())) {
      console.log('Invalid date format');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid date format' 
      });
    }

    // Ensure the date is not in the past (accounting for timezone)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    if (formattedDate < today) {
      console.log('Date is in the past');
      return res.status(400).json({ 
        success: false,
        message: 'Cannot book appointments for past dates' 
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(time)) {
      console.log('Invalid time format:', time);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid time format. Please use format HH:MM AM/PM'
      });
    }

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: formattedDate,
      time,
      status: { $nin: ['cancelled'] }
    });

    if (existingAppointment) {
      console.log('Time slot already booked');
      return res.status(400).json({ 
        success: false,
        message: 'This time slot is already booked. Please select another time.' 
      });
    }

    // Create appointment with proper data validation
    const appointmentData = {
      patient: patient,
      doctor: new mongoose.Types.ObjectId(doctor),
      date: formattedDate,
      time: time.trim(),
      reason: reason.trim(),
      symptoms: symptoms.trim(),
      previousHistory: previousHistory.trim(),
      status: 'pending'
    };

    console.log('Appointment data to save:', appointmentData);

    // Validate the data before creating
    const appointment = new Appointment(appointmentData);
    
    // Validate the appointment
    const validationError = appointment.validateSync();
    if (validationError) {
      console.log('Validation errors:', validationError);
      const errors = Object.values(validationError.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }

    // Save the appointment
    console.log('Saving appointment to database...');
    console.log('Appointment object before save:', appointment);
    console.log('Appointment data types:', {
      patient: typeof appointment.patient,
      doctor: typeof appointment.doctor,
      date: typeof appointment.date,
      time: typeof appointment.time,
      reason: typeof appointment.reason,
      symptoms: typeof appointment.symptoms,
      previousHistory: typeof appointment.previousHistory,
      status: typeof appointment.status
    });
    
    // Try using create method instead of save
    const savedAppointment = await Appointment.create(appointmentData);
    console.log('Appointment saved successfully with ID:', savedAppointment._id);

    // Populate doctor and patient details
    await savedAppointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email specialization photo' }
    ]);

    console.log('=== APPOINTMENT CREATION SUCCESS ===');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: savedAppointment
    });
  } catch (error) {
    console.error('=== APPOINTMENT CREATION ERROR ===');
    console.error('Appointment creation error:', error);
    
    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }

    // Handle MongoDB validation errors with detailed logging
    if (error.name === 'MongoServerError' && error.code === 121) {
      console.log('MongoDB validation error details:', error.errInfo);
      console.log('Failing document ID:', error.errInfo?.failingDocumentId);
      console.log('Schema rules not satisfied:', error.errInfo?.details?.schemaRulesNotSatisfied);
      
      return res.status(400).json({ 
        success: false,
        message: 'Invalid appointment data. Please check all required fields.',
        details: error.errInfo?.details?.schemaRulesNotSatisfied || 'Validation failed'
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('Duplicate key error');
      return res.status(400).json({ 
        success: false,
        message: 'This time slot is already booked' 
      });
    }

    res.status(500).json({ 
      success: false,
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
        success: false,
        message: 'Doctor ID, date, and time are required' 
      });
    }

    // Format the date to match the stored format
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid date format' 
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid time format. Please use format HH:MM AM/PM'
      });
    }

    // Check if there's an existing appointment
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: formattedDate,
      time: time,
      status: { $nin: ['cancelled'] }
    });

    res.json({ 
      success: true,
      available: !existingAppointment 
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error checking availability',
      error: error.message 
    });
  }
};

// Test endpoint to verify database connection and appointment saving
const testAppointmentSave = async (req, res) => {
  try {
    console.log('=== TESTING APPOINTMENT SAVE ===');
    
    // Create a test appointment
    const testAppointment = new Appointment({
      patient: req.user._id,
      doctor: req.user._id, // Using same user as doctor for test
      date: new Date(),
      time: '10:00 AM',
      reason: 'Test appointment',
      symptoms: 'Test symptoms',
      previousHistory: 'Test history',
      status: 'pending'
    });

    console.log('Test appointment data:', testAppointment);

    // Save the test appointment
    const savedTestAppointment = await testAppointment.save();
    console.log('Test appointment saved with ID:', savedTestAppointment._id);

    // Delete the test appointment
    await Appointment.findByIdAndDelete(savedTestAppointment._id);
    console.log('Test appointment deleted');

    res.json({
      success: true,
      message: 'Appointment save test successful',
      testId: savedTestAppointment._id
    });
  } catch (error) {
    console.error('Test appointment save error:', error);
    res.status(500).json({
      success: false,
      message: 'Test appointment save failed',
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
  checkAvailability,
  testAppointmentSave
}; 