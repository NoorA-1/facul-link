import {
  TextField,
  Button,
  MenuItem,
  Switch,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const AddHiringTest = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createQuestion = () => {
    return {};
  };

  return (
    <div className="col-8 mx-auto my-3 bg-white py-3 px-5 rounded grey-border">
      <Button
        variant="outlined"
        startIcon={<ArrowBackOutlinedIcon />}
        sx={{
          border: 2,
          ":hover": {
            border: 2,
          },
        }}
        onClick={() => navigate("/dashboard/hiring-tests")}
      >
        Back
      </Button>
      <h4 className="fw-bold text-center mt-4">Add Hiring Test</h4>
      <hr className="mb-5" />
      <div className="d-flex align-items-center justify-content-center gap-3">
        <TextField className="w-25" label="Test Title" variant="outlined" />
        <TextField className="w-25" select label="Duration" variant="outlined">
          <MenuItem value="5">5 Minutes</MenuItem>
          <MenuItem value="10">10 Minutes</MenuItem>
          <MenuItem value="15">15 Minutes</MenuItem>
          <MenuItem value="20">20 Minutes</MenuItem>
          <MenuItem value="25">25 Minutes</MenuItem>
          <MenuItem value="30">30 Minutes</MenuItem>
        </TextField>
        <div className="d-flex align-items-center">
          <Switch />
          Shuffle Questions
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-end">
        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          sx={{
            border: 2,
            ":hover": {
              border: 2,
            },
          }}
          onClick={handleOpen}
        >
          Add Question
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3 className="text-center mb-3">Add Question</h3>
          <div className="d-flex flex-column gap-3 mb-5">
            <TextField
              fullWidth
              className="mb-4"
              label="Question"
              variant="outlined"
              multiline
            />
            <TextField fullWidth label="Option A" variant="outlined" />
            <TextField fullWidth label="Option B" variant="outlined" />
            <TextField fullWidth label="Option C" variant="outlined" />
            <TextField fullWidth label="Option D" variant="outlined" />
          </div>
          <div className="d-flex mb-4 justify-content-center">
            <TextField
              className="w-50"
              select
              label="Correct Answer"
              variant="outlined"
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
            </TextField>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <Button fullWidth variant="contained" color="secondary">
              Save
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                border: 2,
                borderColor: "#AE2012",
                color: "#AE2012",
                ":hover": {
                  border: 2,
                  borderColor: "#AE2012",
                },
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddHiringTest;
