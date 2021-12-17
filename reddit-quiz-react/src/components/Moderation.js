import React from "react";

import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Box
} from "@mui/material";

import { useEffect } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

var url_base = "http://127.0.0.1:8000";

function Moderation({ ...props }) {
  const [lengthQuiz, setLength] = React.useState(props.length);
  const [minCorrect, setMin] = React.useState(props.min);
  const [qarmaThreshold, setThreshold] = React.useState(props.threshold);

  var subreddit = props.subreddit;

  var submitQuizSettings = function () {
    const data = {
      subreddit: subreddit,
      lengthQuiz: lengthQuiz,
      minCorrect: minCorrect,
      qarmaThreshold: qarmaThreshold
    };

    console.log(JSON.stringify(data));
    const response = fetch(url_base + "/put_subreddit_options/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.log("Request Failed");
    }
  };


  return (
    <span>
      <Box sx={style}>
        <Grid>
          <Grid
            container
            alignItems="center"
            style={{ backgroundColor: "white", borderRadius: "10px" }}
          >
            <Grid style={{ padding: "2vh" }}>
              <TextField
                id="outlined-number"
                label="Length of Quiz"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                defaultValue={lengthQuiz}
                sx={textstyle}
                onChange={(event) => {
                  const { value } = event.target;
                  setLength(value);
                }}
              ></TextField>
            </Grid>

            <Grid style={{ padding: "2vh" }}>
              <TextField
                id="outlined-number"
                label="Correct Question Minimum"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                sx={textstyle}
                defaultValue={minCorrect}
                onChange={(event) => {
                  const { value } = event.target;
                  setMin(value);
                }}
              >
                {minCorrect}
              </TextField>
            </Grid>

            <Grid style={{ padding: "2vh" }}>
              <TextField
                id="outlined-number"
                label="Qarma Threshold for FRQ"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                sx={textstyle}
                defaultValue={qarmaThreshold}
                onChange={(event) => {
                  const { value } = event.target;
                  setThreshold(value);
                }}
              ></TextField>
            </Grid>
          </Grid>
          <Button
            onClick={() => {
              submitQuizSettings();
            }}
            style={{ marginTop: "2vh", backgroundColor: "#FFFFFF" }}
            color="primary"
            variant="outlined"
          >
            Submit Quiz Settings
          </Button>
        </Grid>
      </Box>
    </span>
  );
}

const style = {
  width: "200px",
  bgcolor: "#f9cb9c",
  p: 4,
  borderRadius: "5px"
};

const textstyle = {
  minWidth: "170px",
};

export default Moderation;
