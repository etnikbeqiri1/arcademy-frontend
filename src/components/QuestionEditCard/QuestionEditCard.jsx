import React, { useEffect, useState, forceUpdate } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import '../../assets/css/index.css'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import OptionCard from '../OptionCard/OptionCard'
import { CardActions } from '@material-ui/core'
import validateEditQuestion from '../../helpers/validateEditQuestion'
import { useToasts } from 'react-toast-notifications'

const axios = require('axios')

export default function QuestionEditCard(props) {
  const [userState, setUserState] = useState({})
  const { addToast } = useToasts()
  useEffect(() => {
    setUserState({
      question: { ...props.question },
      isSaved: true
    })
  }, [props])

  const optionChangeHandler = (event) => {
    let newState = { ...userState }
    newState.question.options[event.index] = event.option
    newState.isSaved = false
    setUserState(newState)
  }

  const formHandler = (event) => {
    const target = event.target
    let question = { ...userState.question, [target.name]: target.value }
    setUserState((prevState) => {
      return { ...prevState, question: question, isSaved: false }
    })
  }

  const optionDeleteHandler = (index) => {
    let newState = { ...userState }
    newState.question.options.splice(index, 1)
    newState.isSaved = false
    setUserState(newState)
  }

  const handleAddOption = (event) => {
    let newState = { ...userState }
    let newOptions = newState.question.options.concat([
      {
        optionName: 'Enter text here',
        correct: false
      }
    ])
    newState.question.options = newOptions
    newState.isSaved = false
    setUserState(newState)
  }

  const saveChanges = (event) => {
    const errors = validateEditQuestion(userState.question)
    if (errors.length >= 1) {
      errors.forEach((err) => {
        addToast(err.description, {
          appearance: 'error',
          autoDismiss: true
        })
      })
    } else {
      axios
        .put(
          `http://localhost:8081/quizzes/${props.quizId}/${props.position}?secret=${props.secret}`,
          userState.question
        )
        .then(() => {
          props.changeQuestionData(props.position, userState.question)
        })
        .catch((err) => {
          if (err.response && 'message' in err.response.data) {
            alert(err.response.data.message)
          }
        })
      setUserState((prevState) => {
        return { ...prevState, isSaved: true }
      })
      addToast('You have successfuly saved question data', {
        appearance: 'success',
        autoDismiss: true
      })
    }
  }

  return Object.keys(userState).length > 0 ? (
    <Card>
      <CardContent>
        <Grid container direction={'column'} spacing={2}>
          <Grid item>
            <TextField
              label='Question'
              multiline
              rows={2}
              onChange={formHandler}
              style={{
                width: '100%'
              }}
              name='question'
              variant='outlined'
              spacing={3}
              value={userState.question.question}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Explanation'
              name='explanation'
              multiline
              onChange={formHandler}
              rows={2}
              style={{
                width: '100%'
              }}
              variant='outlined'
              value={userState.question.explanation}
            />
          </Grid>
          <Grid item>
            <Divider variant='middle' />
          </Grid>
          <Grid item>
            <Grid container spacing={3}>
              {userState.question.options.map(function (name, index) {
                return (
                  <OptionCard
                    key={index}
                    index={index}
                    option={userState.question.options[index]}
                    onChange={optionChangeHandler}
                    onDelete={optionDeleteHandler}
                  />
                )
              })}
              <Grid item xs={6}>
                <Button
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  variant='outlined'
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Divider component='br' absolute={true} variant='fullWidth' />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          variant='contained'
          color='secondary'
          size='large'
          style={{
            color: 'white',
            float: 'right'
          }}
          onClick={saveChanges}
        >
          Save
        </Button>
      </CardActions>
    </Card>
  ) : null
}
