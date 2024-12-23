import { React, useState, useNavigate } from "react";

function Login({ valid, validSession }) {
  const [login, setLogin] = useState( validSession);
  const [href, setHref] = useState(`http://localhost:5000/auth/google`);
  const [inOut, setInOut] = useState(`in`);
 
  const handleClick = (event) => {
    
    if (!login) {
  
      setLogin(true);
      setInOut("out");
      setHref("http://localhost:5000/auth/google");
      valid(true);
    } else {
      
      setLogin(false);
      valid(false)
      setInOut("in");
      setHref("/");
    }
    console.log(valid)
  };

  return (
    <div>
      <h1>Sign {inOut} </h1>
      <a className="button google" onClick={handleClick} href={href}  >
        Sign {inOut} with Google
      </a>
    </div>
  );
}

export default Login;
