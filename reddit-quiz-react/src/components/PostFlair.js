import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Link } from "@mui/material";

function UserFlair({ should_render }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log('im called', should_render);
  if (should_render) {
    return (
      <span style={low_point_style}>
        <Link onClick={handleOpen}>Quiz enabled</Link>
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Post Report
            </Typography>
            <Link href={post_url}>This is a link to what the post was linking to</Link>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {(post_url.includes("w")
                ? ": Post statistics show that a low percent of people have answered the quiz"
                : "Post statistics show that a high percent of people have answered the quiz")}
            </Typography>
          </Box>
        </Modal> */}
      </span>
  )
    } else {
      return (<span></span>)
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


export default UserFlair;
