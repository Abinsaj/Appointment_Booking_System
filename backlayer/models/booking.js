const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  slot: {
    date: { type: String, required: true }, 
    time: { type: String, required: true }, 
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
