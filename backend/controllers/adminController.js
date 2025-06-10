const User = require('../models/User');
const Appointment = require('../models/Appointment');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    
    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'patient',
        select: 'name email'
      })
      .populate({
        path: 'doctor',
        select: 'name email specialization'
      });

    if (!appointments) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    res.status(500).json({ message: 'Error fetching recent appointments', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isApproved } = req.body;

    console.log('Approving doctor:', { 
      doctorId, 
      isApproved,
      userRole: req.user.role,
      userId: req.user._id
    });

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    
    if (!doctor) {
      console.log('Doctor not found:', doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('Found doctor:', { 
      id: doctor._id, 
      name: doctor.name, 
      currentApproval: doctor.isApproved 
    });

    doctor.isApproved = isApproved;
    await doctor.save();

    console.log('Doctor approved successfully:', { 
      id: doctor._id, 
      name: doctor.name, 
      newApproval: doctor.isApproved 
    });

    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
      isApproved: doctor.isApproved
    });
  } catch (error) {
    console.error('Error approving doctor:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getRecentUsers,
  getRecentAppointments,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllDoctors,
  approveDoctor
}; 