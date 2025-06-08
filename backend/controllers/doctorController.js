const User = require('../models/User');


const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const doctorExists = await User.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const doctor = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      phone,
      address
    });

    if (doctor) {
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        phone: doctor.phone,
        address: doctor.address
      });
    }
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(400).json({ message: error.message });
  }
};


const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-password');
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDoctor = (req, res) => {
  res.status(200).json({ message: 'getDoctor placeholder' });
};

const getDoctorAvailability = (req, res) => {
  res.status(200).json({ message: 'getDoctorAvailability placeholder' });
};

const getDoctorReviews = (req, res) => {
  res.status(200).json({ message: 'getDoctorReviews placeholder' });
};

const updateDoctor = (req, res) => {
  res.status(200).json({ message: 'updateDoctor placeholder' });
};

const deleteDoctor = (req, res) => {
  res.status(200).json({ message: 'deleteDoctor placeholder' });
};

const updateDoctorAvailability = (req, res) => {
  res.status(200).json({ message: 'updateDoctorAvailability placeholder' });
};

const addDoctorReview = (req, res) => {
  res.status(200).json({ message: 'addDoctorReview placeholder' });
};

module.exports = {
  registerDoctor,
  getDoctors,
  getDoctorById,
  getDoctor,
  getDoctorAvailability,
  getDoctorReviews,
  updateDoctor,
  deleteDoctor,
  updateDoctorAvailability,
  addDoctorReview
}; 