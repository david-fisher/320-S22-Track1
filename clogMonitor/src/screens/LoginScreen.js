import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardScreen from "./DashboardScreen";
import "./LoginScreen.css";
import App from "../App";
import Home from "../components/Home/Home";

function LoginScreen({ setLoggedIn }) {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  // User Login info
  const database = [
    {
      username: "Mark",
      password: "12345",
    },
    {
      username: "user1",
      password: "pass1",
    },
    {
      username: "user2",
      password: "pass2",
    },
  ];
  const errors = {
    uname: "invalid username",
    pass: "invalid password",
    forgot: "Please contact support at xxx-xxx-xxxx or at example@email.com",
  };
  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { uname, pass } = document.forms[0];
    // Find user login info
    const userData = database.find((user) => user.username === uname.value);
    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        // setIsSubmitted(true);
        setLoggedIn(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  function help() {
    alert("Please contact support at xxx-xxx-xxxx or at example@email.com.");
  }

  function success() {
    alert("Successful Login!");
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );
  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
      <br></br>
      <div className="button-container">
        <button onClick={help}> Forgot Password? </button>
      </div>
    </div>
  );
  return (
    <div className="app">
      <div className="login-form">
        <div className="title"> CLOG Monitor Sign In</div>
        {isSubmitted ? (
          <div>
            {success()}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </BrowserRouter>
          </div>
        ) : (
          renderForm
        )}
      </div>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<LoginScreen />, rootElement);
export default LoginScreen;
