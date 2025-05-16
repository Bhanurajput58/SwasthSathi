const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
},
phone: {
    type: Number,
    required: false,
    trim: true
},
photo: {
    type: String,
    required: false
},
role: {
    type: String,
    enum: ['patient', 'admin', 'doctor'],
    default: 'patient'
},
gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false
},
bloodtype: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: false
},
appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
}],
});

export default mongoose.model('User', userSchema);