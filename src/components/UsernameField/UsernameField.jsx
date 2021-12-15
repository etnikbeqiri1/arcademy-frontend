import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import "../../assets/css/index.css";
const axios = require("axios");

export default function UsernameField() {
  const [userState, setUserState] = useState({
    username: "",
    token: "",
    saved: true,
  });

  const getToken = async () => {
    if (localStorage.getItem("token") === null) {
      const tokenRequest = await axios.get(
        "http://localhost:8081/user/initializeSession"
      );
      localStorage.setItem("token", tokenRequest.data.token);
      localStorage.setItem("username", tokenRequest.data.username);
    }

    setUserState({
      username: localStorage.getItem("username"),
      token: localStorage.getItem("token"),
      saved: true,
    });
  };

  useEffect(() => {
    getToken();
  }, []);

  const handleChange = (event) => {
    const state = { ...userState };
    state.username = event.target.value;
    state.saved = false;
    setUserState(state);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const updateName = async () => {
        const state = { ...userState };
        let response = await axios.post(
          "http://localhost:8081/user/changeName",
          {
            username: state.username,
          },
          {
            headers: {
              token: state.token,
            },
          }
        );

        state.saved = true;
        localStorage.setItem("username", state.username);
        setUserState(state);
      };

      updateName();
    }
  };

  return (
    <Grid item>
      <TextField
        id="username-field"
        label="Username"
        spacing={3}
        fullWidth={true}
        variant="outlined"
        value={userState.username}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        helperText={userState.saved ? "" : "Press enter to save changes"}
      />
    </Grid>
  );
}
