const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
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
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    experiences: {
        type: Array,
        required: true,
        min: 0
    },
    hospital: {
        type: String,
        trim: true
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    ,
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    photo: {
        type: String,
        trim: true
    },
    ticketprice: {
        type: Number,
        min: 0
    },
    role: {
        type: String,
        enum: ['doctor', 'admin'],
        default: 'doctor'
    },
    qualification: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 50
    },
    about: {
        type: String,
        trim: true
    },
    timeslot: [{
        type: Array,
        trim: true
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    averagerating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalrating: {
        type: Number,
        min: 0,
        default: 0
    },
    isapproved: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
});

module.exports = mongoose.model('Doctor', DoctorSchema);