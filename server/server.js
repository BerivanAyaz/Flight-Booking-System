require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const connectDB = require('./db');
   const flightRoutes = require('./routes/flightRoutes');

   const app = express();
   const PORT = 5001;

   // Connect to MongoDB
   connectDB();

   app.use(cors());
   app.use(express.json());
   app.use('/api/flights', flightRoutes);

   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });