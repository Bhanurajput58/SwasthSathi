const User = require('../models/User');


const registerDoctor = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      specialization,
      experience,
      hospital,
      qualification,
      bio,
      about,
      photo
    } = req.body;

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
      specialization,
      experience,
      hospital,
      qualification,
      bio,
      about,
      photo,
      isApproved: false 
    });

    if (doctor) {
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        phone: doctor.phone,
        specialization: doctor.specialization,
        experience: doctor.experience,
        hospital: doctor.hospital,
        qualification: doctor.qualification,
        bio: doctor.bio,
        about: doctor.about,
        photo: doctor.photo,
        isApproved: doctor.isApproved
      });
    }
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(400).json({ message: error.message });
  }
};


const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const getDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
      .select('-password');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAvailability = (req, res) => {
  res.status(200).json({ message: 'getDoctorAvailability placeholder' });
};

const getDoctorReviews = (req, res) => {
  res.status(200).json({ message: 'getDoctorReviews placeholder' });
};

const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      experience,
      hospital,
      phone,
      qualification,
      bio,
      about,
      photo
    } = req.body;

    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (email !== doctor.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.hospital = hospital || doctor.hospital;
    doctor.phone = phone || doctor.phone;
    doctor.qualification = qualification || doctor.qualification;
    doctor.bio = bio || doctor.bio;
    doctor.about = about || doctor.about;
    doctor.photo = photo || doctor.photo;

    await doctor.save();

    // Return updated doctor without password
    const updatedDoctor = await User.findById(doctor._id).select('-password');
    res.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctorAvailability = (req, res) => {
  res.status(200).json({ message: 'updateDoctorAvailability placeholder' });
};

const addDoctorReview = (req, res) => {
  res.status(200).json({ message: 'addDoctorReview placeholder' });
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.user._id, role: 'doctor' })
      .select('-password');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Error fetching doctor profile' });
  }
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
  addDoctorReview,
  getDoctorProfile
}; 