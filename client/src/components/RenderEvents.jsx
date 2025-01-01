import axios from "axios";
import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import Button from '@mui/material/Button';
import ArrowOutwardTwoToneIcon from '@mui/icons-material/ArrowOutwardTwoTone';
import { shadows } from '@mui/system';


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
    if (!userLocation) {
      console.error('Need users location!');
    }
    return axios.get('/api/events/', {
      params: {
        userLocation: `${userLocation.latitude}, ${userLocation.longitude}`
      }
    })
      .then((response) => {
        // console.log('sad face', userLocation)
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
      console.log('Starting getUserLoc');
      // if browser supports geolocation webextension
      if (navigator.geolocation) {
        // get user location obj
        navigator.geolocation.getCurrentPosition((position) => {
            // get access to lat and long values from GeoLocationCoordinates obj
            const { latitude, longitude } = position.coords;
            // console.log('Location accessed: ', {latitude, longitude})
            // set user location state
            setUserLocation({ latitude, longitude });
            // resolve promise
            resolve({ latitude, longitude });
          },
          // error case
          (error) => {
            console.error('Failed to get user location');
            reject(error);
          }
        );
      } else {
        console.error('Geolocation not supported by this browser');
        reject();
      }
    });
  };


  const fetchEventsByLoc = () => {
    // check if we have the user's location
    if (!userLocation) {
      // if not, request user to grant access
      getUserLoc()
        .then((location) => {
          axios.get('/api/geolocate/location', {
            params: {
              latlng: `${location.latitude},${location.longitude}`
            }
          })
            .then((city) => {
              return fetchEvents(city.data);
            })
            .catch((err) => {
              console.error('Error reverse geocoding location in fetchEventsByLoc'. err);
            })
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
    getUserLoc();
    fetchEventsByLoc();
  }, [])

  return (

    <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
    >
      {
        events.map((event) => (
          <Box
            sx={{
              p:3,
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
          }}

            key={event._id}
            className="event-card-placeholder">

            <Box
              component="img"
              src={event.image}
              alt={`Image promoting ${event.title}`}
              sx={{
                boxShadow: 3,
                objectFit: 'cover',
                height: 150,
                width: 150,
                borderRadius: 4,
            }}
          />

            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body2">{event.description}</Typography>

            <Typography variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            >
              <CalendarMonthTwoToneIcon
              sx={{
                color: '#5E6472',
              }}/>
              {event.date}</Typography>
            <Typography variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            >
              <LocationOnTwoToneIcon
              sx={{
                color: '#5E6472',
              }}
              />
              {event.location[0]}
            </Typography>
            <Button
              sx={{
                width: '50%',

              }}
              href={event.linkUrl}
              rel="noopener noreferrer"
              target="_noblank"
              className="glass-btn primary"
              startIcon={<ArrowOutwardTwoToneIcon />}
              >Learn More</Button>
            {/*<Typography variant="body2">{event.location[1]}</Typography>*/}
            {/*<Typography variant="body2">{event.description}</Typography>*/}
            {/*<Typography variant="body2">{event.venueName}</Typography>*/}
            {/*<Typography variant="body2">{event.linkUrl}</Typography>*/}
            {/*<Typography variant="body2">{event.thumbnail}</Typography>*/}


          </Box>
          ))}
    </Box>