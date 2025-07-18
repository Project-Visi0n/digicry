const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * This file contains the API handling for the upcoming events feature.
 *
 * APIs Used:
 * - SERP API: Google Events scraping
 * - Google Maps API: Reverse geocoding coordinates to city names
 */

// 🌍 GOOGLE MAPS API — Reverse Geolocation
router.get("/location", async (req, res) => {
  const { latlng } = req.query;

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        latlng,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const results = response.data.results;

    // 🛡️ Check that the data we need exists
    if (!results || !results[0] || !results[0].address_components) {
      console.error("[ERROR] No valid geolocation results found.");
      return res.status(500).json({ error: "Could not determine city from location." });
    }

    const locInfo = results[0].address_components;
    const city = locInfo.find((obj) => obj.types.includes("locality"));

    if (!city) {
      console.error("[ERROR] Locality not found in address_components.");
      return res.status(500).json({ error: "City not found in location data." });
    }

    res.json(city.long_name);
  } catch (err) {
    console.error("Error with reverse geolocation", err);
    res.status(500).json({ error: "Geolocation API failed." });
  }
});

// 🎟️ SERP API — Event Fetching
router.get("/events", (req, res) => {
  const { userLocation } = req.query;

  axios
    .get("https://serpapi.com/search", {
      params: {
        q: "events",
        location: userLocation,
        engine: "google_events",
        api_key: process.env.EVENTS_API_KEY,
      },
    })
    .then((response) => {
      const mappedEvents = response.data.events_results.map((event) => ({
        title: event.title,
        date: event.date?.when || "Date not available",
        location: event.address || "Location not listed",
        description: event.description || "No description available",
        linkUrl: event.link,
        image: event.image,
      }));

      res.json(mappedEvents);
    })
    .catch((err) => {
      console.error("Error getting upcoming event data", err);
      res.status(500).json({ error: "Failed to fetch events." });
    });
});

module.exports = router;
