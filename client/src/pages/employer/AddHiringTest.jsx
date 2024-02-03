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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hiringTestAddQuestionSchema, hiringTestSchema } from "../../schemas";
import { useFormik } from "formik";

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

const questionInitialValues = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "",
};

const testInitialValues = {
  title: "",
  duration: "",
  shuffleQuestions: false,
  questions: [],
};

const AddHiringTest = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    questionFormik.resetForm();
  };
  const [questionsArray, setQuestionsArray] = useState([]);
  useEffect(() => {
    console.log(questionsArray);
    testFormik.setFieldValue("questions", questionsArray);
  }, [questionsArray]);

  const questionFormik = useFormik({
    initialValues: questionInitialValues,
    validationSchema: hiringTestAddQuestionSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      setQuestionsArray((prev) => [...prev, values]);
      handleClose();
    },
  });

  const testFormik = useFormik({
    initialValues: testInitialValues,
    validationSchema: hiringTestSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      handleClose();
    },
  });

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
        <TextField
          className="w-25"
          label="Test Title"
          variant="outlined"
          name="title"
          value={testFormik.values.title}
          onChange={testFormik.handleChange}
          onBlur={testFormik.handleBlur}
          helperText={
            Boolean(testFormik.errors.title) &&
            Boolean(testFormik.touched.title) &&
            testFormik.errors.title
          }
          error={
            Boolean(testFormik.touched.title) &&
            Boolean(testFormik.errors.title)
          }
        />
        <TextField
          className="w-25"
          select
          label="Duration"
          variant="outlined"
          name="duration"
          value={testFormik.values.duration}
          onChange={testFormik.handleChange}
          onBlur={testFormik.handleBlur}
          helperText={
            Boolean(testFormik.errors.duration) &&
            Boolean(testFormik.touched.duration) &&
            testFormik.errors.duration
          }
          error={
            Boolean(testFormik.touched.duration) &&
            Boolean(testFormik.errors.duration)
          }
        >
          <MenuItem value="5">5 Minutes</MenuItem>
          <MenuItem value="10">10 Minutes</MenuItem>
          <MenuItem value="15">15 Minutes</MenuItem>
          <MenuItem value="20">20 Minutes</MenuItem>
          <MenuItem value="25">25 Minutes</MenuItem>
          <MenuItem value="30">30 Minutes</MenuItem>
        </TextField>
        <div className="d-flex align-items-center">
          <Switch
            name="shuffleQuestions"
            checked={testFormik.values.shuffleQuestions}
            onChange={testFormik.handleChange}
          />
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
      <div>
        {testFormik.values.questions.length > 0 &&
          testFormik.values.questions.map((e, i, a) => (
            <div key={i}>{e.question}</div>
          ))}
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={questionFormik.handleSubmit}>
            <h3 className="text-center mb-3">Add Question</h3>
            <div className="d-flex flex-column gap-3 mb-5">
              <TextField
                fullWidth
                className="mb-4"
                label="Question"
                variant="outlined"
                multiline
                name="question"
                value={questionFormik.values.question}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                helperText={
                  Boolean(questionFormik.errors.question) &&
                  Boolean(questionFormik.touched.question) &&
                  questionFormik.errors.question
                }
                error={
                  Boolean(questionFormik.touched.question) &&
                  Boolean(questionFormik.errors.question)
                }
              />
              <TextField
                fullWidth
                label="Option A"
                variant="outlined"
                name="optionA"
                value={questionFormik.values.optionA}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                helperText={
                  Boolean(questionFormik.errors.optionA) &&
                  Boolean(questionFormik.touched.optionA) &&
                  questionFormik.errors.optionA
                }
                error={
                  Boolean(questionFormik.touched.optionA) &&
                  Boolean(questionFormik.errors.optionA)
                }
              />
              <TextField
                fullWidth
                label="Option B"
                variant="outlined"
                name="optionB"
                value={questionFormik.values.optionB}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                helperText={
                  Boolean(questionFormik.errors.optionB) &&
                  Boolean(questionFormik.touched.optionB) &&
                  questionFormik.errors.optionB
                }
                error={
                  Boolean(questionFormik.touched.optionB) &&
                  Boolean(questionFormik.errors.optionB)
                }
              />
              <TextField
                fullWidth
                label="Option C"
                variant="outlined"
                name="optionC"
                value={questionFormik.values.optionC}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                helperText={
                  Boolean(questionFormik.errors.optionC) &&
                  Boolean(questionFormik.touched.optionC) &&
                  questionFormik.errors.optionC
                }
                error={
                  Boolean(questionFormik.touched.optionC) &&
                  Boolean(questionFormik.errors.optionC)
                }
              />
              <TextField
                fullWidth
                label="Option D"
                variant="outlined"
                name="optionD"
                value={questionFormik.values.optionD}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                helperText={
                  Boolean(questionFormik.errors.optionD) &&
                  Boolean(questionFormik.touched.optionD) &&
                  questionFormik.errors.optionD
                }
                error={
                  Boolean(questionFormik.touched.optionD) &&
                  Boolean(questionFormik.errors.optionD)
                }
              />
            </div>
            <div className="d-flex mb-4 justify-content-center">
              <TextField
                className="w-50"
                select
                label="Correct Answer"
                variant="outlined"
                name="correctOption"
                value={questionFormik.values.correctOption}
                onChange={questionFormik.handleChange}
                onBlur={questionFormik.handleBlur}
                helperText={
                  Boolean(questionFormik.errors.correctOption) &&
                  Boolean(questionFormik.touched.correctOption) &&
                  questionFormik.errors.correctOption
                }
                error={
                  Boolean(questionFormik.touched.correctOption) &&
                  Boolean(questionFormik.errors.correctOption)
                }
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </TextField>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
              >
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
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddHiringTest;
