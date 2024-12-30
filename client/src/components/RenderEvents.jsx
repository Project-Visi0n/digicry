import axios from "axios";
import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";

// UPCOMING EVENTS FEATURE
/**
 * fetchEvents() - fetches all events from db
 * getUserLoc - gets user location, returns a promise
 * fetchEventsByLoc - checks for user location before calling fetchEvents
 */

export default function RenderEvents() {
  const [events, setEvents] = useState([])
  const [userLocation, setUserLocation] = useState(null);

  const fetchEvents = () => {
    return axios.get('/api/events/all')
      .then((response) => {
        // assign variable to response data - eventData is used to map over data in render
        const events = response.data;
        // update state
        setEvents(events);
      })
      .catch((err) => {
        console.error('Error fetching events from DB', err);
      })
  };

  const getUserLoc = () => {
    return new Promise((resolve, reject) => {
      // if browser supports geolocation webextension
      if (navigator.geolocation) {
        // get user location obj
        navigator.geolocation.getCurrentPosition((position) => {
            // get access to lat and long values from GeoLocationCoordinates obj
            const { latitude, longitude } = position.coords;
            // set user location state
            setUserLocation({ latitude, longitude });
            // resolve promise
            resolve();
          },
          // error case
          (error) => {
            console.error('Failed to get user location');
            reject(error);
          }
        );
      } else {
        console.error('Geolocation not supported by this browser');
        reject(error);
      }
    });
  };

  const fetchEventsByLoc = () => {
    // check if we have the user's location
    if (!userLocation) {
      // if not, request user to grant access
      getUserLoc()
        .then(() => {
          fetchEvents()
        })
        .catch((err) => {
          console.error('Error getting user location and fetching events', err);
        })
    } else {
      // if we already have the user's location
      fetchEvents()
        .catch((err) => {
          console.error('Error fetching events by location', err);
        })
    };
  };


  useEffect(() => {
    fetchEventsByLoc();
  })

  return (

    <Box>
      {
        events.map((event) => (
          <Box
            key={event._id}
            className="event-card-placeholder">

            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body2">{event.date}</Typography>
            <Typography variant="body2">{event.location[0]}</Typography>
            <Typography variant="body2">{event.location[1]}</Typography>
            <Typography variant="body2">{event.description}</Typography>
            <Typography variant="body2">{event.venueName}</Typography>
            <Typography variant="body2">{event.linkUrl}</Typography>
            <Typography variant="body2">{event.thumbnail}</Typography>


          </Box>
          ))}
    </Box>




        )
      }
