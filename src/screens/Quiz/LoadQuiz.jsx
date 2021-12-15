import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { useToasts } from "react-toast-notifications";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import "../../assets/css/index.css";
import {
  CircularProgress,
  IconButton,
  ListItemSecondaryAction,
  List,
  ListItem,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useParams } from "react-router";
import queryString from "query-string";
import QuestionEditCard from "../../components/QuestionEditCard/QuestionEditCard";
import Delete from "@material-ui/icons/Delete";
const axios = require("axios");

export default function LoadGame(props) {
  let { quizId } = useParams();
  let params = queryString.parse(props.location.search);

  const { addToast } = useToasts();
  const [quizState, setQuizState] = useState({});
  const [questionState, setQuestionState] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] = useState(0);

  const getQuizData = async () => {
    await axios
      .get(`http://localhost:8081/quizzes/${quizId}?secret=${params.secret}`)
      .then((response) => {
        let quizData = {
          id: response.data.id,
          name: response.data.name ? response.data.name : "",
          secret: response.data.secret,
          quizCode: response.data.quizCode,
        };
        setQuizState(quizData);
        for (let i in response.data.questions) {
          delete response.data.questions[i].id;
          for (let j in response.data.questions[i].options) {
            delete response.data.questions[i].options[j].id;
          }
        }
        setQuestionState(response.data.questions);
      })
      .catch((err) => {
        if (err.response && "message" in err.response.data) {
          alert(err.response.data.message);
        }
        props.history.push("/");
      });
  };

  useEffect(() => {
    if (!("secret" in params)) {
      props.history.push("/");
    }
    getQuizData();
  }, []);

  const listClickHandler = (data) => {
    setSelectedQuestion(data);
  };

  const deleteQuestionHandler = (index) => {
    let deleteQuestionIndex = selectedDeleteQuestion;
    axios.delete(
        `http://localhost:8081/quizzes/${quizState.id}/${deleteQuestionIndex}?secret=${quizState.secret}`
    ).then((response) => {
      addToast("You have successfuly deleted the question", {
        appearance: "success",
        autoDismiss: true,
      });
      let questions = [...questionState];
      questions.splice(deleteQuestionIndex,1);
      setQuestionState(questions);
      closeDialogHandler();
    }).catch(reason => {
      addToast("Failed deleting the question", {
        appearance: "error",
        autoDismiss: true,
      });
    });
  };

  const quizNameHandler = (event) => {
    setQuizState((prevState) => {
      return { ...prevState, name: event.target.value };
    });
  };

  const editQuestion = (position, dataArray) => {
    let allData = [...questionState];
    allData[position] = dataArray;
    setQuestionState(allData);
  };

  const handleSaveName = async () => {
    await axios
      .put(
        `http://localhost:8081/quizzes/${quizState.id}/name`,
        `secret=${quizState.secret}&name=${quizState.name}`
      )
      .then(() => {
        addToast("You have successfuly saved the name of this quiz", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((err) => {
        if (err.response && "message" in err.response.data) {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      });
  };

  const closeDialogHandler = () => {
    setConfirmDialog(false);
  }

  const openDialogHandler = (index) => {
    setSelectedDeleteQuestion(index);
    setConfirmDialog(true);
  }

  const addNewQuestion = () => {
    setLoadingButton(true);
    let questions = [...questionState];
    let emptyQuestionTemplate = {
      question: "Question Here",
      options: [
        {
          optionName: "Option 1",
          correct: true,
        },
        {
          optionName: "Option 2",
          correct: false,
        },
      ],
      explanation: "Explanation Here",
      timeToAnswer: 180,
    };
    axios
      .post(
        `http://localhost:8081/quizzes/${quizId}/?secret=${params.secret}`,
        emptyQuestionTemplate
      )
      .then(() => {
        questions.push(emptyQuestionTemplate);
        setQuestionState(questions);
        setSelectedQuestion(questionState.length - 1);
      })
      .catch((err) => {
        if (err.response && "message" in err.response.data) {
          alert(err.response.data.message);
        }
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };

  return Object.keys(quizState).length > 0 ? (
    <React.Fragment>
      <div
        style={{
          height: 300,
          marginBottom: -200,
          backgroundColor: "#e67e22",
        }}
      ></div>
      <Container maxWidth="lg">
        <Dialog
            open={confirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Question
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialogHandler} color="primary">
              Disagree
            </Button>
            <Button onClick={deleteQuestionHandler} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <CardContent>
            <TextField
              id="filled-basic"
              label="Quiz name"
              variant="filled"
              onChange={quizNameHandler}
              value={quizState.name}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSaveName}>
                    <SaveIcon />
                  </IconButton>
                ),
              }}
            />
          </CardContent>
        </Card>
        <br></br>
        <Grid container spacing={3}>
          <Grid item md={3}>
            <Card>
              <CardContent>
                <List component="nav" aria-label="Questions">
                  {questionState.map((question, index) => (
                    <ListItem
                      key={index}
                      button
                      selected={index === selectedQuestion}
                      onClick={() => listClickHandler(index)}
                    >
                      <ListItemText primary={"Question " + (index + 1)} />
                      <ListItemSecondaryAction onClick={() => openDialogHandler(index)}>
                        <IconButton edge="end" aria-label="delete">
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="outlined"
                  size="large"
                  style={{ width: "100%" }}
                  onClick={addNewQuestion}
                  disabled={loadingButton}
                >
                  {loadingButton ? <CircularProgress /> : "Add Question"}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item md={9}>
            {questionState[selectedQuestion] ? (
              <QuestionEditCard
                quizId={quizId}
                secret={params.secret}
                question={questionState[selectedQuestion]}
                changeQuestionData={editQuestion}
                position={selectedQuestion}
              />
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  ) : null;
}
