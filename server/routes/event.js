const express = require("express");

const router = express.Router();
const axios = require("axios");
const { Event } = require("../models");

/** NOTE !! THIS IS NOT DUPLICATE SAFE! ... YET! */
/** LOCATION IS CURRENTLY HARD CODED */

// GET request to fetch event data from SERPAPI and save to our DB Event model
router.get("/", (req, res) => {

  const { latitude, longitude } = req.query;
  console.log('this should be location lat and long', latitude, longitude );

  axios
    .get("https://serpapi.com/search", {

      params: {
        q: 'events',
        location: `${latitude}, ${longitude}`,
        engine: "google_events",
        api_key: process.env.EVENTS_API_KEY,
      },
    })

    .then((response) => {
      console.log(response.data);
      // filter out data we don't need by mapping over response
      const mappedEvents = response.data.events_results.map((event) => ({
        title: event.title,
        date: event.date.when,
        location: event.address,
        description: event.description,
        venueName: event.venue && event.venue.name || 'N/A',
        linkUrl: event.link,
        ticketUrl: event.ticket_info[0].link,
        thumbnail: event.thumbnail,
        image: event.image,
      }));

      // use mappedEvents obj to create new document in our DB
      Event.insertMany(mappedEvents)
        .then((addEvents) => {
          res.status(200);
          res.send(addEvents);
        })
        .catch((err) => {
          console.error("Error saving events to DB", err);
          res.status(500);
        });
    })
    .catch((err) => {
      console.error("Error fetching events from API", err);
      res.status(500);
    });
});

// query DB for all documents in Events
router.get("/all", (req, res) => {
  Event.find({})
    .then((events) => {
      res.status(200);
      res.send(events);
    })
    .catch((err) => {
      console.error("Error getting events:", err);
      res.status(500);
    });
});

module.exports = router;
