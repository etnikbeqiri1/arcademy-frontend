export default function validateFormData(questionState) {
  let errorArray = []
  const questionValidated = validateQuestion(questionState.question)
  const explanationValidated = validateExplanation(questionState.explanation)
  const optionsValidated = validateOptions(questionState.options)
  if (questionValidated.error) errorArray.push(questionValidated)
  if (explanationValidated.error) errorArray.push(explanationValidated)
  if (optionsValidated.error) errorArray.push(optionsValidated)

  return errorArray
}
export function validateQuestion(question) {
  if (question === '')
    return {
      error: true,
      description: "Question can't be empty"
    }
  else if (question.length < 5)
    return {
      error: true,
      description: 'Question needs to be longer than 5 characters'
    }
  else
    return {
      error: false,
      description: 'Validated successfuly'
    }
}

export function validateExplanation(exp) {
  if (exp === '')
    return {
      error: true,
      description: "Explanation can't be empty"
    }
  else if (exp.length < 5)
    return {
      error: true,
      description: 'Explanation must be 5 characters or more'
    }
  else
    return {
      error: false,
      description: 'Validated Successfuly'
    }
}

export function validateOptions(options) {
  if (!Array.isArray(options))
    return {
      error: true,
      description: 'Options must be an array of elements!'
    }
  else if (options.length < 2)
    return {
      error: true,
      description: 'You need to have at least 2 options added to the question'
    }
  else if (checkCorrectOptions(options))
    return {
      error: true,
      description: 'You need to have at least 1 correct options'
    }
  else if (checkIfOneOptionsIsEmpty(options))
    return {
      error: true,
      description:
        'All options must contain text and must be 3 characters or longer.'
    }
  else
    return {
      error: false,
      description: 'Validated successfuly.'
    }
}

const checkIfOneOptionsIsEmpty = (options) => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].optionName === '' || options[i].optionName.length < 3)
      return true
  }
  return false
}

const checkCorrectOptions = (options) => {
  let i = 0
  options.forEach((option) => {
    if (option.correct) i++
  })
  return i == 0
}
