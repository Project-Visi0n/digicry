
import { Typography, Box, Paper, Stack } from '@mui/material';
//import Login from "./Login";


// Define the App component
const Home = () => {
 
  // Render the homepage
  return (
    <Box className="main-container">
        {/* Quote Section */}
        <Box className="glass-panel quote-panel" sx={{ mb: 4 }}>
          <Typography variant="h4" className="section-title">
            Daily Inspiration
          </Typography>
          <Typography variant="body1" className="quote-text">
            "The only way to do great work is to love what you do."
          </Typography>
        </Box>

        {/* Voice Analytics Section */}
        <Box className="glass-panel voice-panel" sx={{ mb: 4 }}>
          <Typography variant="h4" className="section-title">
            Mood Analytics
          </Typography>
          <Box className="voice-analytics-container">
            {/* Placeholder for voice analytics */}
            <Box className="voice-visualization-placeholder">
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                Share how you're feeling...
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content Stack */}
        <Stack spacing={4} className="content-stack">

        {/* Mood Tracking Section */}
        <Box className="glass-panel mood-panel">
          <Typography variant="h4" className="section-title">
            Track Your Mood
          </Typography>
          <Typography variant="body1" className="section-description">
            Document your emotional journey and gain insights into your well-being
          </Typography>
          <Box className="mood-preview">
            {/* Placeholder for mood tracking visualization */}
            <div className="mood-graph-placeholder"></div>
          </Box>
        </Box>

        {/* Events Section */}
        <Box className="glass-panel events-panel">
          <Typography variant="h4" className="section-title">
            Local Events
          </Typography>
          <Typography variant="body1" className="section-description">
            Connect with your community
          </Typography>
          <Box className="events-preview">
            {/* Event cards will go here */}
            <div className="event-card-placeholder"></div>
            <div className="event-card-placeholder"></div>
          </Box>
        </Box>

      </Stack>
    </Box>
);
};


// Export the App component
export default Home;
