import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import JournalEntryList from "./JournalEntryList";

function Journal() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container maxWidth="xl" className="dashboard-container">
      {/* Header Section */}
      <Box className="dashboard-main">
        <Box
          className="glass-panel"
          sx={{
            mb: 4,
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            Your Journal
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Search Bar */}
            <TextField
              className="glass-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search entries..."
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* New Entry Button */}
            <Button
              component={Link}
              to="/journal/new"
              className="glass-btn primary"
              startIcon={<AddIcon />}
            >
              New Entry
            </Button>
          </Box>
        </Box>

        {/* Journal Entries */}
        <JournalEntryList searchQuery={searchQuery} />
      </Box>
    </Container>
  );
}

export default Journal;
