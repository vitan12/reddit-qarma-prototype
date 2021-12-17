import React from "react";

import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Box
} from "@mui/material";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

var url_base = "http://127.0.0.1:8000";

function Form({ ...props }) {
  const [textAnswer, setAnswer] = React.useState("");
  const [textQuestion, setQuestion] = React.useState("");

  const [postUrl, setPostUrl] = React.useState("Placeholder URL");
  const [frq, setFrq] = React.useState("Placeholder FRQ");
  const [mcqQuestions, setMcqQuestions] = React.useState(
    Array.from([...Array(props.length).keys()].map(() => ["", "", "", ""]))
  );
  const [submittedMCQ, setSubmittedMCQ] = React.useState(false);
  const [submittedFRQ, setSubmittedFRQ] = React.useState(false);

  function modifyState(question, index, value) {
    var newMcqQuestions = mcqQuestions.slice();
    newMcqQuestions[index][question] = value;
    setMcqQuestions(newMcqQuestions);
  }

  function renderRow(props) {
    const index = props;

    return (
      <ListItem key={index} component="div" disablePadding>
        <Box sx={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
          <TextField
            id="filled-multiline-static"
            multiline
            fullWidth
            rows={2}
            label={`Question ${index + 1}`}
            variant="standard"
            onChange={(event) => {
              const { value } = event.target;
              modifyState(0, index, value);
            }}
            disabled={submittedMCQ}
          />
          <Box sx={{ pl: 3, pt: 2 }}>
            <Grid item xs={10}>
              <TextField
                id="standard-helperText"
                helperText="A. (Answer)"
                variant="standard"
                onChange={(event) => {
                  const { value } = event.target;
                  modifyState(1, index, value);
                }}
                disabled={submittedMCQ}
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="standard-helperText"
                helperText="B."
                variant="standard"
                onChange={(event) => {
                  const { value } = event.target;
                  modifyState(2, index, value);
                }}
                disabled={submittedMCQ}
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="standard-helperText"
                helperText="C."
                variant="standard"
                onChange={(event) => {
                  const { value } = event.target;
                  modifyState(3, index, value);
                }}
                disabled={submittedMCQ}
              />
            </Grid>
          </Box>
        </Box>
      </ListItem>
    );
  }

  var submitMcqQuestions = function () {
    const data = {
      username: props.op,
      post_url: postUrl,
      submitted_questions: mcqQuestions
    };
    console.log('DATA', data);
    
    const response = fetch(url_base + "/submit_mcq_questions/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.log("Request Failed");
    }
    setSubmittedMCQ(true);
  };

  var submitFrqQuestion = function () {
    const data = {
      username: props.op,
      post_url: postUrl,
      frq_question: textQuestion,
      frq_answer: textAnswer
    };
    console.log(data);
    console.log(JSON.stringify(data));
    const response = fetch(url_base + "/submit_frq_question/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.log("Request Failed");
    }
    setSubmittedFRQ(true);
  };

  return (
    <span>
      <Box sx={style}>
        <Grid container alignItems="center">
          <TextField
            id="filled-multiline-static"
            multiline
            fullWidth
            rows={1}
            label="Post URL..."
            variant="standard"
            onChange={(event) => {
              const { value } = event.target;
              setPostUrl(value);
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: "3px"
            }}
            inputProps={{
              style: {
                paddingLeft: "10px"
              }
            }}

          />

          <Grid item xs={6} style={{ paddingRight: "2vh", paddingTop: "5vh" }}>
            <Grid item>
              <Typography variant="subtitle2" fontWeight="bold">
                Multiple choice questions
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                paddingTop: "10px",
                height: "50vh",
                overflow: "auto"
              }}
            >
              <FormControl>
                <List
                  sx={{
                    // width: "100%",
                    minWidth: "230px",
                    bgcolor: "background.paper",
                    borderRadius: "20px"
                  }}
                >
                  { [...Array(props.length).keys()].map((value) => (
                    <ListItem key={value} disableGutters>
                      {renderRow(value)}
                    </ListItem>
                  ))}
                </List>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: "10px" }}>
              <Button
                onClick={() => {
                  submitMcqQuestions();
                }}
                style={{ float: "right", backgroundColor: "#FFFFFF" }}
                color="primary"
                variant="outlined"
                disabled={submittedMCQ}
              >
                {submittedMCQ ? "Submited MCQ" : "Submit MCQ Questions"}
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={6} style={{ paddingRight: "1vh", paddingTop: "5vh" }}>
            <Grid item>
              <Typography variant="subtitle2" fontWeight="bold">
                Free response question
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                paddingTop: "10px",
                height: "50vh",
                overflow: "auto"
              }}
            >
              <TextField
                id="filled-multiline-static"
                multiline
                fullWidth
                rows={1}
                label="Your question"
                variant="standard"
                onChange={(event) => {
                  const { value } = event.target;
                  setQuestion(value);
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "3px"
                }}
                inputProps={{
                  style: {
                    paddingLeft: "10px"
                  }
                }}
                disabled={submittedFRQ || (props.qarma < props.threshold)}
              />
              <Grid item xs={12}>
                <Typography variant="subtitle4" fontWeight="bold">
                  {textQuestion.length}/75
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="filled-multiline-static"
                  multiline
                  fullWidth
                  rows={8}
                  label="Your answer"
                  sx={{
                    backgroundColor: "white"
                  }}
                  variant="filled"
                  onChange={(event) => {
                    const { value } = event.target;
                    setAnswer(value);
                  }}
                  disabled={submittedFRQ || (props.qarma < props.threshold)}
                  />
                <Grid item xs={12}>
                  <Typography variant="subtitle4" fontWeight="bold">
                    {textAnswer.length}/750
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: "10px" }}>
              <Button
                onClick={() => {
                  submitFrqQuestion();
                }}
                style={{ float: "right", backgroundColor: "#FFFFFF" }}
                color="primary"
                variant="outlined"
                disabled={submittedFRQ || (props.qarma < props.threshold)}
              >
                {submittedFRQ ? "Submitted FRQ" : "Submit FRQ Question"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </span>
  );
}

const style = {
  width: "550px",
  bgcolor: "#f9cb9c",
  p: 4
};

const input_style = {
  textField: {
    border: "0px solid #FFFFFF !important"
  }
};

export default Form;
