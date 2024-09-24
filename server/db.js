const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://berivannayaz:1234abc@cluster0.rjqq529.mongodb.net/flightBookingDB?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
