import axios from "axios";
import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import Button from "@mui/material/Button";
import ArrowOutwardTwoToneIcon from "@mui/icons-material/ArrowOutwardTwoTone";

// UPCOMING EVENTS FEATURE
/**
 * getUserLoc - gets user location, returns a promise
 * fetchEvents() - fetches all events from db
 * fetchEventsByLoc - checks for user location before calling fetchEvents
 */

/**
 * CURRENTLY HAVE THIS COMMENTED OUT TO AVOID HITTING ANY API RATE LIMITS
 * NOT A HUGE ISSUE - FEEL FREE TO UNCOMMENT AND RUN THE CODE TO SEE HOW IT LOOKS
 * JUST PLS TRY TO AVOID LOADING THIS EVERY TIME YOU'RE TESTING A FEATURE TO AVOID US HITTING API LIMITS
 */

export default function RenderEvents() {
  const [events, setEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
/*
  // use geolocation webextension api to get users lat and long
  // we will take the response and use it as a param for our reverse geocoding to get the user's city
  const getUserLoc = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        // get users lat and long coords
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // set user location
            setUserLocation({ latitude, longitude });
            // resolve promise
            resolve({ latitude, longitude });
          },
          // on error
          (error) => {
            console.error(`Couldn't getUserLoc`);
            reject(error);
          },
        );
      } else {
        // if browser doesn't support geolocation
        console.error("Geolocation not supported by browser");
        reject(new Error("Geolocation not supported by browser"));
      }
    });
  };

  // fetches events from SERP API
  // city param is the returned value from our reverse geocoding - ex: New Orleans
  const fetchEvents = (city) => {
    // if we don't have a city value
    if (!city) {
      console.error("Need city name to fetchEvents");
      return;
    }
    // use city param for SERP API call to get events relevent to user's city
    return (
      axios
        .get("/api/events/events", {
          params: {
            userLocation: city,
          },
        })
        // response is a series of objects each representing a unique event from the API
        .then((response) => {
          const events = response.data;
          // update state
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
      // if we don't have the lat and long values in userLocation state
      if (!userLocation) {
        // invoke getUserLoc to get coordinates
        const location = await getUserLoc();
        // use coordinates in API call param to reverse geocode
        const city = await axios.get("/api/geolocate/location", {
          params: {
            latlng: `${location.latitude},${location.longitude}`,
          },
        });
        // once we have the user's city, invoke the SERP API helper function passing in the user's city
        await fetchEvents(city.data);
      } else {
        // if we already have the user's coords, we can immediately reverse geocode
        const city = await axios.get("/api/geolocate/location", {
          params: {
            latlng: `${userLocation.latitude},${userLocation.longitude}`,
          },
        });
        // when reverse geocode response is returned, use it to fetchEvents from SERP API
        await fetchEvents(city.data);
      }
    } catch (err) {
      console.error("Error in fetchEventsByLoc: ", err);
    }
  };

  // get users coordinates when component mounts / page loads
  useEffect(() => {
    getUserLoc();
  }, []);

  // invoke fetchEventsByLoc() when userLocation state changes
  useEffect(() => {
    console.log("userLocation state updated: ", userLocation);
    if (userLocation) {
      fetchEventsByLoc();
    }
  }, [userLocation]);
*/
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
