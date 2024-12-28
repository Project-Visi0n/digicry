import { React, useState, useNavigate, useEffect } from "react";
import axios from "axios";

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
          console.log("You logged out!");
        })
        .catch((error) => {
          console.error("Failed to logout");
        });
    }
  };

  return (
    <div key={validSession}>
      <h1>Sign {inOut} </h1>
      <a onClick={handleLogout} className="button google" href={href}>
        Sign {inOut} with Google
      </a>
    </div>
  );
}

export default Login;
