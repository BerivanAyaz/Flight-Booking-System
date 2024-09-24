const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  flightName: String,
  flightNumber: String,
  id: String,
  airlineCode: String,
  scheduleTime: String,
  scheduleDateTime: Date,  
  estimatedLandingTime: String,
  route: {
    destinations: [String]
  },
  flightDirection: String,
  prefixICAO: String,
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);