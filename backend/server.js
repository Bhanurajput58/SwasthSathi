const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());

// Database connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // Verify database and collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(col => col.name));
    
    // Ensure appointments collection exists
    const appointmentsCollection = collections.find(col => col.name === 'appointments');
    if (appointmentsCollection) {
      console.log('✅ Appointments collection found');
      const appointmentCount = await db.collection('appointments').countDocuments();
      console.log(`📊 Total appointments in database: ${appointmentCount}`);
    } else {
      console.log('⚠️ Appointments collection not found - will be created when first appointment is saved');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const medicalRecordRoutes = require('./routes/medicalRecord');
const adminRoutes = require('./routes/admin');
const patientRoutes = require('./routes/patient');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SwasthSathi API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('...');
  console.log(`server is running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('...');
}); 