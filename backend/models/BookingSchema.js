const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
        appointmentDate: {
            type: Date,
            required: true
        }
    });
    
    module.exports = mongoose.model('Booking', BookingSchema);
 