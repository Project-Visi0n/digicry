/* eslint-disable import/no-extraneous-dependencies */
import { NavLink, Outlet } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Layout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Background elements */}
      <div className="gradient-animation" />
      <div className="gradient-overlay" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <Container maxWidth="lg">
        <Box className="layout-container">
          {/* App Title */}
          <Typography variant="h2" component="h1" className="main-title">
            Digi-Cry
          </Typography>

          {/* Navigation Bar */}
          <nav className="nav-container">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/journal"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Journal
                </NavLink>

                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Mood Analytics
                </NavLink>

                <NavLink
                  to="/forums"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Forums
                </NavLink>

                <NavLink
                  to="/breathe"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Breathe
                </NavLink>

                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Events
                </NavLink>

                <NavLink to="#" onClick={logout} className="nav-link">
                  Logout
                </NavLink>
              </>
            )}

            {!user && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>

          {/* Main Content */}
          <Box className="main-content">
            <Outlet />
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Layout;
