import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import "../../assets/css/index.css";
import UsernameField from "../../components/UsernameField/UsernameField";
import { Backdrop, CircularProgress } from "@material-ui/core";
import axios from "axios";

export default function LoadGame(props) {
  const [userState, setUserState] = useState({
    loading: false,
  });

  const createQuiz = () => {
    const state = { ...userState };
    state.loading = true;
    setUserState(state);
    window.setTimeout(function () {
      axios.post("http://localhost:8081/quizzes").then(function (response) {
        props.history.push(
          "/quiz/" + response.data.id + "/?secret=" + response.data.secret
        );
      });
    }, 2000);
  };

  return (
    <React.Fragment>
      <Backdrop open={userState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        style={{
          backgroundColor: "#ecf0f1",
          height: "100vh",
        }}
      >
        <div
          style={{
            height: 300,
            marginBottom: -200,
            backgroundColor: "#e67e22",
          }}
        ></div>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container direction={"column"} spacing={2}>
                    <UsernameField></UsernameField>
                    <Grid item>
                      <TextField
                        id="quiz-field"
                        label="Quiz Code"
                        spacing={3}
                        fullWidth={true}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        fullWidth={true}
                        size="large"
                        color="primary"
                        style={{
                          color: "white",
                        }}
                      >
                        Start Game
                      </Button>
                    </Grid>
                    <Grid item>
                      <Divider variant="middle" />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        fullWidth={true}
                        size="large"
                        onClick={createQuiz}
                        color="secondary"
                        style={{
                          color: "white",
                        }}
                      >
                        Create Quiz
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={9}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Most Played Quizzes All Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  );
}
