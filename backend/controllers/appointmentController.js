const Appointment = require('../models/Appointment');
const User = require('../models/User');

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, symptoms, previousHistory } = req.body;
    const patientId = req.user._id;

    // Validate doctor exists and is approved
    if (doctorId) {
      const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isApproved: true });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found or not approved' });
      }
    }

    // Check for existing appointment at the same time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      reason,
      symptoms,
      previousHistory,
      status: doctorId ? 'pending' : 'needs_doctor'
    });

    // Populate doctor and patient details
    await appointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email specialization photo' }
    ]);

    res.status(201).json(appointment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
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

    // Check if user is authorized to update
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

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
}; 