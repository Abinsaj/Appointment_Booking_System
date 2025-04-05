const Booking = require('../models/booking.js');

exports.getBookingsByDate = async (req, res) => {
  try {
    console.log('its,herre ')
    const date = req.params.date;
    console.log(date)
    const bookings = await Booking.find({ 'slot.date': date });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

exports.createBooking = async (req, res) => {
    const { name, phone, slot } = req.body;
    console.log(req.body, 'Incoming request');
  
    if (!name || !phone || !slot?.date || !slot?.time) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const existingUserBooking = await Booking.findOne({ phone, 'slot.date': slot.date });
      console.log(existingUserBooking, 'Existing booking for same user and date');
  
      if (existingUserBooking) {
        return res.status(400).json({ message: 'You have already booked a slot for this date' });
      }
  
      const slotTaken = await Booking.findOne({ 'slot.date': slot.date, 'slot.time': slot.time });
      if (slotTaken) {
        return res.status(400).json({ message: 'This slot is already booked' });
      }
  
      const booking = new Booking({ name, phone, slot });
      await booking.save();
      res.status(201).json({ message: 'Slot booked successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Booking failed' });
    }
  };
  
