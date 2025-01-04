const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * This file contains the API handling for the upcoming events feature.
 *
 * API's Used:
 * SERP API - This API acts essentially like a Google Search Engine. SERP API scrapes the data from Google Search, and sends us back the results.
 * Google Maps API - This API performs reverse geocoding on User coordinates to User city. This is necessary as SERP API does not accept coordinates as a location parameter value.
 */


// GOOGLE MAPS API
router.get('/location', (req, res) => {
  // Access User coordinates
  const { latlng } = req.query
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      latlng: latlng,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  })
    .then((response) => {
      // Response is an array of objects where each object has the same key names - representing various formats of User location
      // Ex: { long_name: 'Saint Andrew Street', short_name: 'St Andrew St', types: ['route'] }
      // We need to access the object that has the long_name property assigned to a string representing a City name
      // Ex: { long_name: 'New Orleans', ... , types: ['locality'] }
      // Notice: That object with the city name has 'locality' in the types array.
      const locInfo = response.data.results[0].address_components;
      const city = locInfo.find(obj => obj.types.includes('locality'));
      res.json(city.long_name);
    })
    .catch((err) => {
      console.error('Error with reverse geolocation', err);
      res.status(500);
    });
});


// SERP API
router.get("/events", (req, res) => {
  // Access User city
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
      // The response has more data than we need
      // Ex: event.venue.name, event.ticket_info[0].link, event.thumbnail, etc...
        const mappedEvents = response.data.events_results.map((event) => ({
          title: event.title,
          date: event.date.when,
          location: event.address,
          description: event.description,
          linkUrl: event.link,
          image: event.image,
        }));
      res.json(mappedEvents);
    })
    .catch((err) => {
      console.error('Error getting upcoming event data', err);
      res.status(500);
    })
});

module.exports = router;