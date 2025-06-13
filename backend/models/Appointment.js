const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(value);
      },
      message: 'Invalid time format. Use HH:MM format'
    }
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Reason must be at least 3 characters long']
  },
  symptoms: {
    type: String,
    trim: true
  },
  previousHistory: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'needs_doctor', 'confirmed', 'cancelled', 'completed'],
    default: 'needs_doctor'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ status: 1 });

// Prevent double booking for the same doctor at the same time
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema); 