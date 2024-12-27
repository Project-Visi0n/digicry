import React, { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  return (
    <div>
      <h1>Sign in</h1>
      <a className="button google" href="http://localhost:5001/auth/google">
        Sign in with Google
      </a>
    </div>
  );
}

export default Login;
