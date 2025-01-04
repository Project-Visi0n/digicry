import axios from "axios";
import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import Button from "@mui/material/Button";
import ArrowOutwardTwoToneIcon from "@mui/icons-material/ArrowOutwardTwoTone";


/**
 * This file handles the upcoming events feature.
 *
 * It includes a getUserLoc() function that uses the Geolocation API to retrieve the coordinates of the User.
 * Those coordinates are then used in the fetchEventsByLoc() function as part of an API call to Google Maps.
 * The Google Maps API performs a reverse geocoding of the coordinates to an address.
 * Through the Google Maps API response, we extract the User's city.
 * Lastly, we use the User's city in our SERP API call to retrieve upcoming events in the User's city.
 */

/**
 * getUserLoc - Retrieves User's coordinates via Geolocation API, returns a promise containing the User's coordinates
 * fetchEvents() - Receives a city name and retrieves upcoming events in the User's city via SERP API
 * fetchEventsByLoc - Main function purposed to take the User's coordinates and convert them to a city via Google Maps API and then invokes fetchEvents with the response (city).
 */



export default function RenderEvents() {
  const [events, setEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);


  // getUserLoc - Retrieves User's coordinates via Geolocation API, returns a promise containing the User's coordinates
  const getUserLoc = () => {
    return new Promise((resolve, reject) => {
      // If  browser supports Geolocation API
      if (navigator.geolocation) {
        // This will prompt User to accept sharing their location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Direct access to latitude and longitude values in position.coords object
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            resolve({ latitude, longitude });
          },
          // If User rejects browser prompt or an unknown bug is encountered
          (error) => {
            console.error(`Couldn't get the User's location`, error);
            reject(error);
          },
        );
      } else {
        // If browser doesn't support geolocation
        console.error("Geolocation not supported by browser");
        reject(new Error("Geolocation not supported by browser"));
      }
    });
  };


  // fetchEvents() - Receives a city name and retrieves upcoming events in User city via SERP API
  const fetchEvents = (city) => {
    // Parameter error handling
    if (!city) {
      console.error("Error: Missing city parameter in fetchEvents");
      return;
    }
    // SERP API - returns upcoming events
    return (
      axios
        .get("/api/events/events", {
          params: {
            userLocation: city,
          },
        })
        .then((response) => {
          const events = response.data; // A series of objects, each representing a unique event
          setEvents(events);
          return events;
        })
        .catch((err) => {
          console.error("Error fetching events", err);
          throw err;
        })
    );
  };

  // MAIN FUNCTION
  const fetchEventsByLoc = async () => {
    try {
      // Check if we have the User coordinates
      if (!userLocation) {
        // If we don't have User coordinates, invoke getUserLoc
        const location = await getUserLoc();
        // Use coordinates in API param to reverse geocode
        const city = await axios.get("/api/geolocate/location", {
          params: {
            latlng: `${location.latitude},${location.longitude}`, // Google Maps API expects 'latlng' instead of separate lat and long params
          },
        });
        // Retrieve upcoming events in User city via fetchEvents() function
        await fetchEvents(city.data); // city.data is the city name string response from Google Maps API
      } else {
        // If we already have User coords, we can immediately reverse geocode to get User city location and then invoke fetchEvents(city.data)
        const city = await axios.get("/api/geolocate/location", {
          params: {
            latlng: `${userLocation.latitude},${userLocation.longitude}`,
          },
        });
        await fetchEvents(city.data);
      }
    } catch (err) {
      console.error("Error in fetchEventsByLoc: ", err);
    }
  };

  // Retrieve User coordinates when component mounts / page loads
  useEffect(() => {
    getUserLoc();
  }, []);

  // Invoke fetchEventsByLoc() when userLocation state changes
  useEffect(() => {
    if (userLocation) {
      fetchEventsByLoc();
    }
  }, [userLocation]);





  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {events.map((event) => (
        <Box
          sx={{
            p: 3,
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          key={event._id}
          className="event-card-placeholder"
        >
          <Box
            component="img"
            src={event.image}
            alt={`Image promoting ${event.title}`}
            sx={{
              boxShadow: 3,
              objectFit: "cover",
              height: 150,
              width: 150,
              borderRadius: 4,
            }}
          />

          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="body2">{event.description}</Typography>

          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarMonthTwoToneIcon
              sx={{
                color: "#5E6472",
              }}
            />
            {event.date}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocationOnTwoToneIcon
              sx={{
                color: "#5E6472",
              }}
            />
            {event.location[0]}
          </Typography>
          <Button
            sx={{
              width: "50%",
            }}
            href={event.linkUrl}
            rel="noopener noreferrer"
            target="_noblank"
            className="glass-btn primary"
            startIcon={<ArrowOutwardTwoToneIcon />}
          >
            Learn More
          </Button>
          {/* <Typography variant="body2">{event.location[1]}</Typography> */}
          {/* <Typography variant="body2">{event.description}</Typography> */}
          {/* <Typography variant="body2">{event.venueName}</Typography> */}
          {/* <Typography variant="body2">{event.linkUrl}</Typography> */}
          {/* <Typography variant="body2">{event.thumbnail}</Typography> */}
        </Box>
      ))}
    </Box>
  );
}
