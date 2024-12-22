import { React, useState, useNavigate } from "react";

function Login() {
  const [login, setLogin] = useState(false);
  const [href, setHref] = useState(`http://localhost:5000/auth/google`);
  const [inOut, setInOut] = useState(`in`);
 
  const handleClick = (event) => {
    event.preventDefault();
    if (!login) {
      setLogin(true);
      setInOut("out");
      // setHref("/");
      
    } else {
      setLogin(false);
      setInOut("in");
      setHref("http://localhost:5000/auth/google");
    }
  };

  return (
    <div>
      <h1>Sign {inOut} </h1>
      <a className="button google" href={href}  >
        Sign {inOut} with Google
      </a>
    </div>
  );
}

export default Login;
