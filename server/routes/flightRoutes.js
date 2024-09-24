const express = require("express");
const axios = require("axios");
const router = express.Router();

const flightApiUrl = "https://api.schiphol.nl/public-flights/flights";
const appKey = "d4e35fdd09dff7785932992a93acfc6e";
const appId = "c0c16e78";
const Booking = require('../models/bookingModel'); 

router.get("/", async (req, res) => {
    try {
      console.log("Received request with params:", req.query);
      const { direction, flightdate } = req.query;
      const response = await axios.get(flightApiUrl, {
        headers: {
          app_id: appId,
          app_key: appKey,
          resourceversion: "v4",
          Accept: "application/json",
        },
        params: {
          scheduleDate: flightdate,
          flightDirection: direction,
        },
      });
      console.log("Schiphol API response:", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching flight data:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Error fetching flight data", details: error.message });
    }
  });

  router.post("/book", async (req, res) => {
    try {
      const bookingData = {
        ...req.body,
        scheduleDateTime: new Date(req.body.scheduleDateTime) // Ensure it's saved as a Date
      };
      const newBooking = new Booking(bookingData);
      await newBooking.save();
      res.status(201).json({ message: "Flight booked successfully", booking: newBooking });
    } catch (error) {
      console.error("Error booking flight:", error);
      res.status(500).json({ error: "Error booking flight", details: error.message });
    }
  });
  
  router.get("/bookings", async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ bookingDate: -1 });
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Error fetching bookings", details: error.message });
    }
  });
  
 // New route for cancelling a flight
router.delete("/cancel/:id", async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Flight cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling flight:", error);
    res.status(500).json({ error: "Error cancelling flight", details: error.message });
  }
});

module.exports = router;