import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import PropTypes from "prop-types";

// PROXY TEST WILL REMOVE WHEN BUGS ARE FIXED!!

const testProxy = async () => {
  try {
    const response = await axios.get("/api/test"); // This will go through the proxy
    console.log(response.data); // Should log `{ message: "Proxy is working!" }`
  } catch (error) {
    console.error("Proxy test failed:", error);
  }
};

function Login({ validSession, setValidSession, setUser }) {
  const [login, setLogin] = useState(validSession);
  const [href, setHref] = useState(`http://localhost:5000/auth/google`);
  const [inOut, setInOut] = useState(`in`);

  // set component for login/out based on validSession bool.
  useEffect(() => {
    if (validSession) {
      setLogin(true);
      setInOut("out");
      setHref("http://127.0.0.1:5000/logout");
    } else {
      setLogin(false);
      setInOut("in or Sign Up");
      setHref("http://127.0.0.1:5000/auth/google");
    }
  }, [validSession]);

  // if login is true attempt to log out the user
  const handleLogout = () => {
    if (login) {
      axios
        .post("http://127.0.0.1:5000/logout")
        .then((success) => {
          setLogin(false);
          setValidSession(false);
          setUser(null);
          setInOut("in or Sign Up");
          setHref("http://127.0.0.1:5000/auth/google");
          console.log("You logged out!", success);
        })
        .catch((error) => {
          console.error("Failed to logout", error);
        });
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        size="large"
        href={href}
        onClick={login ? handleLogout : undefined}
        startIcon={<GoogleIcon />}
        sx={{
          background:
            "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
          color: "white",
          px: 4,
          py: 1.5,
          borderRadius: "12px",
          textTransform: "none",
          fontSize: "1.1rem",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            background:
              "linear-gradient(45deg, var(--pink) 50%, var(--blue) 110%)",
          },
        }}
      >
        Sign {inOut} with Google
      </Button>

      {/* Proxy Test Button */}
      <Button
        variant="outlined"
        size="medium"
        onClick={testProxy}
        sx={{
          mt: 2,
          color: "white",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(5px)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        Test Proxy
      </Button>
    </div>
  );
}

Login.propTypes = {
  validSession: PropTypes.bool.isRequired,
  setValidSession: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Login;
