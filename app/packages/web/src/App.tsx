import { useState } from "react";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Link as MaterialLink,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import Home from "./Home/Home";

import SignUp from "./Users/SignUp";

import Login from "./Users/Login";
import Profile from "./Users/Profile";

import "./App.css";

const { VITE_APP_API_URL } = import.meta.env;

function App() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("Hi 👋");

  const isLoggedIn = (user) =>
    !(Object.entries(user).length === 0 && user.constructor === Object);

  function onClick() {
    fetch(VITE_APP_API_URL)
      .then((response) => response.text())
      .then(setMessage);
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography className="full-width" variant="h6">
            <MaterialLink component={Link} to="/" style={{ color: "white" }}>
              Home
            </MaterialLink>
          </Typography>
          <Typography className="full-width" variant="h6">
            <MaterialLink href={`/oauth/connect`} style={{ color: "white" }}>
              Connect to HS
            </MaterialLink>
          </Typography>
          {user.email ? (
            <MaterialLink
              component={Link}
              to="/profile"
              style={{ color: "white" }}
            >
              <Button color="inherit">{`${user.firstName} ${user.lastName}`}</Button>
            </MaterialLink>
          ) : (
            <MaterialLink
              component={Link}
              to="/login"
              style={{ color: "white" }}
            >
              <Button color="inherit">Login</Button>
            </MaterialLink>
          )}
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/login">
          <Login setUser={setUser} />
        </Route>
        <Route path="/signup">
          <SignUp setUser={setUser} />
        </Route>
        <Route path="/profile">
          {isLoggedIn(user) ? (
            <Profile user={user} setUser={setUser} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/">
          {isLoggedIn(user) ? <Home user={user} /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
