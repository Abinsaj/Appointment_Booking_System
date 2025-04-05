const express = require('express');
const router = express.Router();
const { getBookingsByDate,createBooking } = require('../controller/bookingContoller.js');

router.get('/bookings/:date', getBookingsByDate);
router.post('/bookings',createBooking)

module.exports = router;
    