const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Get patients associated with a doctor
const getPatientsByDoctor = async (req, res) => {
  try {
    // Find all appointments for this doctor
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient', 'name email phone photo')
      .distinct('patient');

    // Get unique patients
    const patients = [...new Set(appointments.map(app => app.patient))];

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

module.exports = {
  getPatientsByDoctor
}; 