const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
    // Temporarily commenting out validation to debug
    // validate: {
    //   validator: function(date) {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
    //     return date >= today;
    //   },
    //   message: 'Cannot book appointments for past dates'
    // }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, 'Please use valid time format (HH:MM AM/PM)']
  },
  reason: {
    type: String,
    trim: true,
    required: [true, 'Reason for visit is required'],
    minlength: [2, 'Reason must be at least 2 characters long']
  },
  symptoms: {
    type: String,
    trim: true,
    required: [true, 'Symptoms description is required'],
    minlength: [3, 'Symptoms description must be at least 3 characters long']
  },
  previousHistory: {
    type: String,
    trim: true,
    required: [true, 'Previous medical history is required'],
    minlength: [3, 'Previous medical history must be at least 3 characters long']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Basic indexes for efficient querying
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ status: 1 });

// Pre-save middleware to validate date and prevent double booking
appointmentSchema.pre('save', async function(next) {
  try {
    console.log('Pre-save middleware - Appointment data:', {
      doctor: this.doctor,
      patient: this.patient,
      date: this.date,
      time: this.time,
      reason: this.reason,
      symptoms: this.symptoms,
      previousHistory: this.previousHistory
    });

    // Check for existing appointment (excluding cancelled ones)
    const existingAppointment = await this.constructor.findOne({
      doctor: this.doctor,
      date: this.date,
      time: this.time,
      status: { $nin: ['cancelled'] },
      _id: { $ne: this._id }
    });

    if (existingAppointment) {
      console.log('Double booking detected:', existingAppointment);
      throw new Error('This time slot is already booked');
    }

    next();
  } catch (error) {
    console.error('Pre-save middleware error:', error);
    next(error);
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema); 