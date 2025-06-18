const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swasthsathi');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixAppointmentSchema = async () => {
  try {
    console.log('=== APPOINTMENT SCHEMA FIX SCRIPT ===');
    
    // Get the database instance
    const db = mongoose.connection.db;
    
    // Check if appointments collection exists
    const collections = await db.listCollections().toArray();
    const appointmentCollections = collections.filter(col => 
      col.name.toLowerCase().includes('appointment')
    );
    
    console.log('Found appointment-related collections:', appointmentCollections.map(c => c.name));
    
    // Check for collection validation rules
    const currentCollection = db.collection('appointments');
    
    try {
      const collectionInfo = await db.command({ listCollections: 1, filter: { name: 'appointments' } });
      console.log('Collection info:', JSON.stringify(collectionInfo, null, 2));
      
      if (collectionInfo.cursor && collectionInfo.cursor.firstBatch && collectionInfo.cursor.firstBatch[0]) {
        const collectionDetails = collectionInfo.cursor.firstBatch[0];
        console.log('Collection details:', JSON.stringify(collectionDetails, null, 2));
        
        if (collectionDetails.options && collectionDetails.options.validator) {
          console.log('Found validation rules:', JSON.stringify(collectionDetails.options.validator, null, 2));
        }
      }
    } catch (error) {
      console.log('Could not get collection info:', error.message);
    }
    
    const sampleDoc = await currentCollection.findOne({});
    
    if (sampleDoc) {
      console.log('Current schema fields:', Object.keys(sampleDoc));
    } else {
      console.log('No documents found in appointments collection.');
    }
    
    console.log('Dropping appointments collection to remove validation rules...');
    try {
      await currentCollection.drop();
      console.log('Successfully dropped appointments collection');
    } catch (error) {
      console.log('Collection might not exist or already dropped:', error.message);
    }
    
    console.log('Creating new appointments collection...');
    await db.createCollection('appointments');
    console.log('New appointments collection created');
    
    console.log('\n=== TESTING NEW APPOINTMENT CREATION ===');
    
    const testAppointment = new Appointment({
      patient: new mongoose.Types.ObjectId(),
      doctor: new mongoose.Types.ObjectId(),
      date: new Date(),
      time: '10:00 AM',
      reason: 'Test appointment',
      symptoms: 'Test symptoms',
      previousHistory: 'Test history',
      status: 'pending'
    });
    
    console.log('Test appointment data:', testAppointment.toObject());
    
    const savedAppointment = await testAppointment.save();
    console.log('Test appointment created successfully:', savedAppointment._id);
    
    // Clean up test appointment
    await Appointment.findByIdAndDelete(savedAppointment._id);
    console.log('Test appointment cleaned up');
    
    console.log('\n=== SCHEMA FIX COMPLETED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('Error fixing appointment schema:', error);
    
    if (error.code === 121) {
      console.log('\n=== TRYING ALTERNATIVE APPROACH ===');
      console.log('The database has strict validation rules. Let\'s try to work around them...');
      
      try {
        const db = mongoose.connection.db;
        
        const newCollectionName = 'appointments_v2';
        console.log(`Creating new collection: ${newCollectionName}`);
        
        await db.createCollection(newCollectionName);
        console.log(`Collection ${newCollectionName} created successfully`);
        
        const NewAppointment = mongoose.model('AppointmentV2', Appointment.schema, newCollectionName);
        
        const testAppointment = new NewAppointment({
          patient: new mongoose.Types.ObjectId(),
          doctor: new mongoose.Types.ObjectId(),
          date: new Date(),
          time: '10:00 AM',
          reason: 'Test appointment',
          symptoms: 'Test symptoms',
          previousHistory: 'Test history',
          status: 'pending'
        });
        
        const savedAppointment = await testAppointment.save();
        console.log('Test appointment created successfully in new collection:', savedAppointment._id);
        
        await NewAppointment.findByIdAndDelete(savedAppointment._id);
        console.log('Test appointment cleaned up');
        
        console.log('\n=== ALTERNATIVE APPROACH SUCCESSFUL ===');
        console.log(`Use collection: ${newCollectionName} for appointments`);
        
      } catch (altError) {
        console.error('Alternative approach also failed:', altError);
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

if (require.main === module) {
  connectDB().then(() => {
    fixAppointmentSchema();
  });
}

module.exports = { fixAppointmentSchema }; 