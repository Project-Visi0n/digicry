const express = require("express");

const router = express.Router();
const axios = require("axios");
const { Event } = require("../models");

/** NOTE !! THIS IS NOT DUPLICATE SAFE! ... YET! */
/** LOCATION IS CURRENTLY HARD CODED */



// GOOGLE MAPS API REVERSE GEOLOCATION
// TAKES THE USERS LAT AND LONG AND GETS THEIR CITY
router.get('/location', (req, res) => {
  // get users lat and long values from query
  const { latlng } = req.query;
  // api call to google maps
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      latlng: latlng,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  })
    .then((response) => {
      // assign variable to an array of objects where each obj has same keys
        // ex: { long_name: 'Saint Andrew Street', short_name: 'St Andrew St', types: ['route'] }
      // the obj with the city name has 'locality' value in types array
      // we find the right city name by finding the obj that has the 'locality' value in types
      const locInfo = response.data.results[0].address_components;
      const city = locInfo.find(obj => obj.types.includes('locality'));

      // add the city to the req object to use in SERP API call
      req.userLocation = city.long_name;

      res.json(city.long_name); // in this object, long_name is the city name
    })
    .catch((err) => {
      console.error('error with reverse geolocation', err);
      res.status(500);
    });
});


// GET request to fetch event data from SERPAPI and save to our DB Event model
router.get("/events", (req, res) => {
  const { userLocation } = req.query;
  axios.get("https://serpapi.com/search", {
      params: {
        q: 'events',
        location: userLocation,
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
router.get("/stored-events", (req, res) => {
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