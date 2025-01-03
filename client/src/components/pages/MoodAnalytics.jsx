import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

function MoodAnalytics() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch journal data
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/api/journal');
        setEntries(response.data);
      } catch (err) {
        setError('Failed to fetch journal entries');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);




  return (
<>
</>
  )
}

export default MoodAnalytics;
