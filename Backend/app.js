const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("success");
    
})

const app = express();
app.use(cors({}));
app.use(express.json());


app.use('/api', require('./routes/bookingRoute.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
