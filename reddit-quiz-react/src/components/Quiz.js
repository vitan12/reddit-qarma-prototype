import React from "react";
import Box from "@mui/material/Box";
import { Button, Divider, FormControl, FormControlLabel, FormLabel, Grid, Link, Modal, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import 'regenerator-runtime/runtime'

var url_base = 'http://127.0.0.1:8000'

function Quiz({...props}) {
  const [open, setOpen] = React.useState(false);
  const [textInput, setInput] = React.useState('');
  const [frq, setFrq] = React.useState('FRQ has been disabled for this post.');
  const [questionNumber, setQuestionNumber] = React.useState(1);
  const [questionArr, setQuestions] = React.useState([{question: 'Placeholder Question', answers: ['Placeholder Answer 1', 'Placeholder Answer 2', 'Placeholder Answer 3'], answer: "0"}])
  const [mcqState, setAnswer] = React.useState("0")
  const [submittedMCQ, setSubmittedMCQ] = React.useState(false)
  const [submittedFRQ, setSubmittedFRQ] = React.useState(false)
  const [numCorrectQuestions, setNumCorrectQuestions] = React.useState(0);
  const [quizResult, setQuizResult] = React.useState("");
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSubmittedMCQ(false)
    setNumCorrectQuestions(0)
    setQuestionNumber(1)
  }

  React.useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(url_base + '/mcq/' + props.op + '/' + btoa(props.url))
      const response_object = await response.json()
      setQuestions(response_object.mcq)

      const frq_response = await fetch(url_base + '/frq/' + props.op + '/' + btoa(props.url))
      const frq_response_object = await frq_response.json()
      setFrq(frq_response_object.frq.frq_question)
    }
    fetchQuestions()
  }, [open])

  React.useEffect(() => {
    console.log('HELLO', numCorrectQuestions);
    console.log(url_base + '/passing/' + props.cur_user + '/' + btoa(props.url) + '/' + '?correct=' + numCorrectQuestions);
    const response = fetch(url_base + '/passing/' + props.cur_user + '/' + btoa(props.url) + '/' + '?correct=' + numCorrectQuestions, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      }
    });
    if (submittedMCQ) {
      if (numCorrectQuestions >= props.minCorrect) {
        setQuizResult('Quiz passed!');
      } else {
        console.log('failed');
        setQuizResult('Quiz failed. Please retry the quiz for another chance.');
      }
    }
    console.log(numCorrectQuestions)
  }, [numCorrectQuestions])

  const setAnswerWrap = (event) => {
    setAnswer(event.target.value);
  };

  var handleNextQuestion = function() {
    if (questionArr[questionNumber - 1].answer == mcqState) setNumCorrectQuestions(numCorrectQuestions + 1)
    setQuestionNumber(questionNumber + 1)
  }
  
  var submitQuestions = function() {
    if (questionArr[questionNumber - 1].answer == mcqState) {
      setNumCorrectQuestions(numCorrectQuestions + 1);
    } else {
      setNumCorrectQuestions(-1);
    }
    setSubmittedMCQ(true)
  }

  var submitFrq = function() {
    const data = {
      username: props.cur_user,
      post_url: props.url, 
      frq_answer: textInput
    }
    const response = fetch(url_base + '/submit_frq_response/', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.log("Request Failed")
    }
    setSubmittedFRQ(true)
  }
  if (props.mcq) {
    return (
      <span>
        <Link style={quiz_link_style} onClick={handleOpen}>
          Take Quiz
        </Link>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container alignItems="center">
              <Grid item xs={7} style={{paddingRight: '20px'}}>
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    <Typography variant="subtitle2" fontWeight='bold'>
                      Knowledge Quiz
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle4" fontWeight='bold' style={{"float": "right"}} >
                      {questionNumber}/{questionArr.length}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{paddingTop: '10px'}}>
                  <FormControl component="fieldset">
                   <FormLabel component="legend">{questionArr[questionNumber - 1].question}</FormLabel>
                    <RadioGroup onChange={setAnswerWrap} value={mcqState} name="radio-buttons-group">
                      {questionArr[questionNumber - 1].answers.map(((answerVal, index) => <FormControlLabel value={index.toString()} control={<Radio />} label={answerVal} />))}
                    </RadioGroup>
                  </FormControl>
                  <Typography variant="subtitle2" fontWeight='bold'>
                      {quizResult}
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{'padding-top': "10px"}}>
                    {
                      submittedMCQ ? 
                        <Button style={{"float": "right"}}  color='primary' variant="disabled">Submitted</Button> :
                        questionNumber != questionArr.length ? 
                          <Button onClick={event=> {
                            handleNextQuestion()
                          }} style={{"float": "right"}}  color='primary' variant="text">Next Question</Button> :
                          <Button onClick={event=> {
                            submitQuestions()
                          }} style={{"float": "right"}}  color='primary' variant="contained">Submit Answers</Button>
  
                    }
                  </Grid>
              </Grid>
              <Grid item xs={5} style={{paddingLeft: '20px', borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderWidth: '0 0 0 1px'}}>
                <Grid container>
                  <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight='bold'>
                    {props.op} asks:
                  </Typography>
                  </Grid>
                  <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    {frq}
                  </Typography>
                  </Grid>
                  <Grid item xs={12}>
                  <Typography variant="subtitle4" fontWeight='bold'>
                    {textInput.length}/750
                  </Typography>
                </Grid>
                  <Grid item xs={12}>
                    {
                      submittedFRQ ? 
                        <TextField
                        disabled
                        id="filled-multiline-static"
                        multiline
                        fullWidth
                        rows={8}
                        label="Your answer"
                        variant="filled"
                        onChange={event => {
                          const { value } = event.target;
                          setInput(value);
                        }}
                      /> : 
                      <TextField
                        id="filled-multiline-static"
                        multiline
                        fullWidth
                        rows={8}
                        disabled={(!submittedMCQ || numCorrectQuestions < props.minCorrect) || !props.frq}
                        label="Your answer"
                        variant="filled"
                        onChange={event => {
                          const { value } = event.target;
                          setInput(value);
                        }}
                      />
                    }
                  </Grid>
                  <Grid item xs={12} style={{'padding-top': "10px"}}>
                    {
                      submittedFRQ ? 
                      <Button onClick={event=> {
                        submitFrq()
                      }} style={{"float": "right"}}  color='primary' variant="disabled">Submitted</Button> : 
                      <Button 
                        disabled={(!submittedMCQ || numCorrectQuestions < props.minCorrect) || !props.frq}
                        onClick={event=> {
                        submitFrq()
                      }} style={{"float": "right"}}  color='primary' variant="contained">Submit Answer</Button>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </span>
    );
  } else {
    return (
      <span></span>
    )
  }
}

const quiz_link_style = {
  "color": "orange",
  "font-weight": "bold",
  "font-style": "oblique",
  padding: "2px",
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const input_style = {
  textField: {
    border: "0px solid #FFFFFF !important"
  }
}

export default Quiz;
