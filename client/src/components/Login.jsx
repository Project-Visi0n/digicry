import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import PropTypes from "prop-types";

function Login({ validSession, setValidSession, setUser }) {
  const [login, setLogin] = useState(validSession);
  const [href, setHref] = useState(`${process.env.AUTH_PREFIX}/auth/google`);
  const [inOut, setInOut] = useState(`in`);

  // set component for login/out based on validSession bool.
  useEffect(() => {
    if (validSession) {
      setLogin(true);
      setInOut("out");
      setHref(`${process.env.AUTH_PREFIX}/logout`); // /authorization/logout while in development
    } else {
      setLogin(false);
      setInOut("in or Sign Up");
      setHref(`${process.env.AUTH_PREFIX}/auth/google`); // /authorization/auth/google while in development
    }
  }, [validSession]);

  return (
    <Button
      variant="contained"
      size="large"
      href={href}
      startIcon={<GoogleIcon />}
      className="glass-btn primary"
      style={{
        background: "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
        color: "white",
        textTransform: "none",
      }}
    >
      Sign {inOut} with Google
    </Button>
  );
}

Login.propTypes = {
  validSession: PropTypes.bool.isRequired,
  setValidSession: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Login;
