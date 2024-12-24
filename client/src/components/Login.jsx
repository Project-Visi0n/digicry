import { React, useState, useNavigate, useEffect } from "react";

function Login({ valid, validSession }) {
  const [login, setLogin] = useState(validSession);
  const [href, setHref] = useState(`http://localhost:5000/auth/google`);
  const [inOut, setInOut] = useState(`in`);

  useEffect(() => {
    if (validSession) {
      setLogin(true);
      setInOut("out");
      setHref("http://127.0.0.1:5000/logout");
    } else {
      setLogin(false);
      setInOut("in");
      setHref("http://127.0.0.1:5000/auth/google");
    }
    console.log(valid);
  }, []);

  return (
    <div>
      <h1>Sign {inOut} </h1>
      <a className="button google" href={href}>
        Sign {inOut} with Google
      </a>
    </div>
  );
}

export default Login;
