import * as React from "react";
import { Button, IconButton, Link } from "@mui/material";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import { render } from "react-dom";

var url_base = 'http://127.0.0.1:8000'
const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

function UserFlair({...props}) {
  var username = props.username
  var op = props.op
  const [frq, setFrq] = React.useState('Placeholder FRQ');
  const [userfrq, usersetFrq] = React.useState('Placeholder Response');
  const [userfrqScore, usersetFrqScore] = React.useState(props.upvotes);
  const [usermcqScore, usersetmcqScore] = React.useState(0);
  const [selffrq, selfsetFrq] = React.useState('Placeholder Response 2');
  const [upvote, setUpvote] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const fetchQuestions = async () => {
    const frq_response = await fetch(url_base + '/frq/' + props.op + '/' + btoa(props.url))
    if (frq_response.ok) {
      // console.log('test`1234873794')
      const frq_response_object = await frq_response.json()
      setFrq(frq_response_object.frq.frq_question)
    }

    console.log('lol')
    const frq_response_two = await fetch(url_base + '/frq_response/' + props.username + '/' + btoa(props.url))
    const frq_response_two_upvotes = await fetch(url_base + '/upvotes/' + props.username + '/' + btoa(props.url))
    const frq_response_two_passing = await fetch(url_base + '/passing/' + props.username + '/' + btoa(props.url))

    const frq_response_object_thing = await frq_response_two.json()
    const frq_response_object_upvotes = await frq_response_two_upvotes.json()
    const frq_response_object_passing = await frq_response_two_passing.json()

    // console.log(frq_response_object_thing)
    usersetFrq(frq_response_object_thing.frq_response.frq_responses)
    usersetFrqScore(frq_response_object_upvotes.upvotes.upvotes)
    usersetmcqScore(frq_response_object_passing.passing.passing)

    const frq_response_three = await fetch(url_base + '/frq_response/' + props.cur_user + '/' + btoa(props.url))
    const frq_response_object_iuh = await frq_response_three.json()
    selfsetFrq(frq_response_object_iuh.frq_response.frq_responses)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    fetchQuestions()
    setOpen(true);
  };
  const upvoteButton = () => {
    setUpvote(!upvote)
    !upvote ? usersetFrqScore(userfrqScore + 1) : usersetFrqScore(userfrqScore - 1)
  }

  React.useEffect(() => {
    console.log('tepp')
    const response = fetch(url_base + '/upvotes/' + props.username + '/' + btoa(props.url) + '/?upvotes=' + userfrqScore, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
    });
  }, [userfrqScore])
  console.log(props)
  if (!props.should_render && props.opponent_responded) {
    return (
      <Tooltip title="Please take the quiz and answer the FRQ to see other users' responses." arrow placement="right">
          <span style={props.opponent_responded ? high_point_style : (props.opponent_quiz_score >= props.minCorrect ? low_point_style : {})}>
            <Link>{props.opponent_responded ? "Answered Quiz & FRQ" : (props.opponent_quiz_score >= props.minCorrect ? "Answered Quiz" : "")}</Link>
          </span>
      </Tooltip>
    )
  } else if (props.should_render && props.opponent_responded) {
      return (
        <NoMaxWidthTooltip open={open} onClose={handleClose} onOpen={handleOpen} arrow placement="right" title={
            <div style={bgdiv}>
              <h1>
                <i>{op}</i>: {frq}
              </h1>
              <div style={row}>
                <div style={col}><h3><i>{username}: {userfrqScore} Qarma</i></h3></div>
                <div style={col}><h3><i>{props.cur_user} (you)</i></h3></div>
              </div>
              <div style={row}>
                <div style={col}>{userfrq}</div>
                <div style={col}>{selffrq}</div>
              </div>
              <div style={row}>
                <div style={col}>
                  {
                    upvote ?
                    <IconButton onClick={upvoteButton}><ArrowUpward style={{ fill: '#FF4500' }}/></IconButton> :  
                    <IconButton onClick={upvoteButton}><ArrowUpward style={{ fill: '#FFFFFF' }}/></IconButton>
                  }
                  
                </div>
                <div style={col}></div>
              </div>
            </div>
          }>
            <span style={high_point_style}>
              <Link>{"Answered Quiz & FRQ"}</Link>
            </span>
        </NoMaxWidthTooltip>
      );
  } else if (!props.opponent_responded) {
    console.log("orange", props.opponent_quiz_score, props.minCorrect)
      return (
          <span style={props.opponent_quiz_score >= props.minCorrect ? low_point_style : {}}>
            <Link>{props.opponent_quiz_score >= props.minCorrect ? "Answered Quiz" : "" }</Link>
          </span>
      );
  } 
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const low_point_style = {
  "background-color": "orange",
  "border-radius": "5px",
  padding: "2px",
  margin: "3px",
};

const high_point_style = {
  "background-color": "lawngreen",
  "border-radius": "5px",
  padding: "2px",
  margin: "3px",
};

const row = {
  "display": "flex"
};

const col = {
  "flex": "50%"
};

const bgdiv = {
  "width": "500px",
}

export default UserFlair;

{/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Report: {username + (op ? ' OP' : '')}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {username.includes("x")
              ? "This user has a pretty bad rating when it comes to answering quizzes"
              : "This user has a pretty great rating when it comes to answering quizzes"}
          </Typography>
        </Box>
      </Modal> */}