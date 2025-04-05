# Appointment-Booking-System

# Overview

The Appointment Booking System allows users to book appointments in predefined time slots. The system ensures that double bookings are not allowed and includes a reusable frontend plugin that can be embedded into any website.

# Features

# Appointment Slots:

Available in 30-minute intervals between 10:00 AM and 5:00 PM.

1:00 PM to 2:00 PM is a break and not available for booking.

# Booking Functionality:

Users can book an appointment by providing:

Name

Phone Number

Date

Selected Time Slot

Prevents double booking.

# Slot Availability:

Users can check available slots for a specific date.

# Reusable Frontend Plugin:

Simple, responsive UI for booking and viewing available slots.
Plugon: ./bookingPlugin.js

Can be embedded using a <script> tag.

# Project Structure

Appointment Booking System/
├── backend/
│   ├── controllers/
│   │   └── bookingController.js
│   ├── models/
│   │   └── booking.js
│   ├── routes/
│   │   └── bookingRoute.js
│   ├── app.js
│   └── .gitignore
├── frontend/
│   ├── plugin/
│   │   ├── bookingPlugin.js
│   │   
│   └── index.html
└── README.md

# Technology Stack

Backend: Node.js with Express
Database: MongoDB
Frontend: HTML, CSS, and JavaScript

# Installation & Setup
Prerequisites

Node.js and npm
MongoDB

# Backend Setup

Navigate to the backend directory:
 "Appointment Booking System/backend"

Install dependencies:
ynpm install

Create a .env file in the backend directory with the following variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment_booking

# Start the server:
npm start


# Frontend Setup

# Navigate to the frontend directory:
 "Appointment Booking System/frontend"

Open index.html in a web browser to test the application locally.

API Endpoints
Get Available Slots

URL: /api/bookings
Method: GET
Query Parameters: date (format: YYYY-MM-DD)
Response: List of available time slots for the specified date

Book Appointment

URL: /api/bookings
Method: POST
Body:
    {
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "date": "2023-05-20",
  "timeSlot": "10:00 AM"
    }

