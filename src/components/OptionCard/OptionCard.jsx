import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import "../../assets/css/index.css";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import { Checkbox, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
const axios = require("axios");

export default function OptionCard(props) {
  const [optionState, setOptionState] = useState(null);

  useEffect(() => {
    setOptionState({
      option: props.option,
      index: props.index,
    });
  }, [props]);

  const checkBoxHandler = (event) => {
    let newState = { ...optionState };
    newState.option.correct = event.target.checked;
    setOptionState(newState);
    triggerOptionChange();
  };

  const inputChangeHandler = (event) => {
    let newState = { ...optionState };
    newState.option.optionName = event.target.value;
    setOptionState(newState);
    triggerOptionChange();
  };

  const triggerOptionChange = () => {
    props.onChange(optionState);
  };

  const triggerOptionDelete = () => {
    props.onDelete(optionState.index);
  };

  return optionState != null ? (
    <Grid item lg={6} md={6} xs={12}>
      <Card elevation={3}>
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Checkbox
            onChange={checkBoxHandler}
            checked={optionState.option.correct}
            value={optionState.option.correct}
          />
          <TextField
            label={"Option " + (optionState.index + 1)}
            variant="outlined"
            onChange={inputChangeHandler}
            value={optionState.option.optionName}
            style={{
              width: "100%",
            }}
          />
          <IconButton aria-label="delete" onClick={triggerOptionDelete}>
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Grid>
  ) : null;
}
