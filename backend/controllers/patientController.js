const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Get patient profile
const getPatientProfile = async (req, res) => {
  try {
    console.log('Fetching profile for patient:', req.params.id);
    
    const patient = await User.findById(req.params.id)
      .select('-password')
      .lean();

    if (!patient) {
      console.log('Patient not found');
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.user._id.toString() !== patient._id.toString()) {
      console.log('Unauthorized access attempt');
      return res.status(403).json({ message: 'Not authorized to access this profile' });
    }

    console.log('Profile fetched successfully');
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ message: 'Error fetching patient profile', error: error.message });
  }
};

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

// Update patient profile
const updatePatientProfile = async (req, res) => {
  try {
    console.log('Received update request for patient:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      name,
      email,
      phone,
      address,
      photo,
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContact,
      medicalHistory,
      insurance,
      occupation,
      maritalStatus,
      height,
      weight,
      lifestyle
    } = req.body;

    const patient = await User.findById(req.params.id);

    if (!patient) {
      console.log('Patient not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.user._id.toString() !== patient._id.toString()) {
      console.log('Authorization failed:', {
        userId: req.user._id.toString(),
        patientId: patient._id.toString()
      });
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    if (email && email !== patient.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        console.log('Email already exists:', email);
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    try {
      const updates = {
        // Basic Information
        name: name || patient.name,
        email: email || patient.email,
        phone: phone || patient.phone,
        address: address || patient.address,
        photo: photo || patient.photo,
        dateOfBirth: dateOfBirth || patient.dateOfBirth,
        gender: gender || patient.gender,
        bloodGroup: bloodGroup || patient.bloodGroup,

        // Emergency Contact
        emergencyContact: {
          name: emergencyContact?.name || patient.emergencyContact?.name || '',
          relationship: emergencyContact?.relationship || patient.emergencyContact?.relationship || '',
          phone: emergencyContact?.phone || patient.emergencyContact?.phone || ''
        },

        // Medical History
        medicalHistory: {
          allergies: medicalHistory?.allergies || patient.medicalHistory?.allergies || '',
          chronicConditions: medicalHistory?.chronicConditions || patient.medicalHistory?.chronicConditions || '',
          currentMedications: medicalHistory?.currentMedications || patient.medicalHistory?.currentMedications || '',
          previousSurgeries: medicalHistory?.previousSurgeries || patient.medicalHistory?.previousSurgeries || ''
        },

        // Insurance Information
        insurance: {
          provider: insurance?.provider || patient.insurance?.provider || '',
          policyNumber: insurance?.policyNumber || patient.insurance?.policyNumber || '',
          groupNumber: insurance?.groupNumber || patient.insurance?.groupNumber || '',
          expiryDate: insurance?.expiryDate || patient.insurance?.expiryDate || null
        },

        // Additional Information
        occupation: occupation || patient.occupation,
        maritalStatus: maritalStatus || patient.maritalStatus,
        height: height || patient.height,
        weight: weight || patient.weight,

        // Lifestyle Information
        lifestyle: {
          smoking: lifestyle?.smoking !== undefined ? lifestyle.smoking : (patient.lifestyle?.smoking || false),
          alcohol: lifestyle?.alcohol !== undefined ? lifestyle.alcohol : (patient.lifestyle?.alcohol || false),
          exercise: lifestyle?.exercise || patient.lifestyle?.exercise || 'sedentary'
        }
      };

      console.log('Applying updates:', JSON.stringify(updates, null, 2));

      // Apply all updates
      Object.assign(patient, updates);

      // Validate the document before saving
      const validationError = patient.validateSync();
      if (validationError) {
        console.log('Validation error:', validationError);
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: Object.values(validationError.errors).map(err => err.message)
        });
      }

      // Save the updated patient
      const savedPatient = await patient.save();
      console.log('Patient saved successfully:', savedPatient._id);

      // Return updated patient without password
      const updatedPatient = await User.findById(patient._id)
        .select('-password')
        .lean();

      res.json({
        message: 'Profile updated successfully',
        patient: updatedPatient
      });
    } catch (saveError) {
      console.error('Error during save operation:', saveError);
      throw saveError;
    }
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({ 
      message: 'Error updating patient profile', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  getPatientProfile,
  getPatientsByDoctor,
  updatePatientProfile
}; 