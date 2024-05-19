import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Switch,
  Modal,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useFormik } from "formik";
import { hiringTestAddQuestionSchema, hiringTestSchema } from "../schemas";
import http from "../utils/http";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

const questionInitialValues = {
  question: "",
  options: [
    { optionLabel: "A", optionValue: "" },
    { optionLabel: "B", optionValue: "" },
  ],
  correctOption: "",
};

const testInitialValues = {
  title: "",
  duration: "",
  shuffleQuestions: false,
  questions: [],
};

const AdminHiringTestForm = ({ testId, onClose, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [message, setMessage] = useState({ message: "", error: 0 });

  const getData = async () => {
    try {
      const response = await http.get(`admin/get-hiring-test/${testId}`);
      const data = response.data;
      setQuestionsArray(data.questions);
      testFormik.setValues({
        title: data.title,
        duration: data.duration,
        shuffleQuestions: data.shuffleQuestions,
        questions: data.questions,
      });
      setEditMode(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (testId) {
      getData();
    }
  }, [testId]);

  const handleClose = () => {
    setOpen(false);
    questionFormik.resetForm();
  };

  useEffect(() => {
    testFormik.setFieldValue("questions", questionsArray);
  }, [questionsArray]);

  const questionFormik = useFormik({
    initialValues: questionInitialValues,
    validationSchema: hiringTestAddQuestionSchema,
    onSubmit: (values) => {
      if (editingIndex !== null) {
        const updatedQuestions = questionsArray.map((item, index) =>
          index === editingIndex ? values : item
        );
        setQuestionsArray(updatedQuestions);
        testFormik.setFieldValue("questions", updatedQuestions);
      } else {
        setQuestionsArray([...questionsArray, values]);
      }
      handleClose();
    },
  });

  const handleOpen = (index = null) => {
    setOpen(true);
    if (index !== null) {
      questionFormik.setValues(questionsArray[index]);
      setEditingIndex(index);
    } else {
      setEditingIndex(null);
      questionFormik.resetForm();
    }
  };

  const submitTest = async (values) => {
    try {
      let response;
      if (editMode) {
        response = await http.put(`admin/edit-hiring-test/${testId}`, values);
      } else {
        // response = await http.post("admin/add-hiring-test", values);
      }
      if (response.status === 200) {
        onSave();
        setMessage({ message: "", error: 0 });
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setMessage({ message: error.response.data.message, error: 1 });
      }
    }
  };

  const testFormik = useFormik({
    initialValues: testInitialValues,
    validationSchema: hiringTestSchema,
    onSubmit: (values) => {
      submitTest(values);
      handleClose();
    },
  });

  const deleteQuestion = (indexToDelete) => {
    setQuestionsArray(
      questionsArray.filter((_, index) => index !== indexToDelete)
    );
  };

  const MessageBox = () =>
    message.error === 1 && (
      <Alert variant="filled" severity="error">
        {message.message}
      </Alert>
    );

  const handleAddOption = () => {
    const nextLabel = "ABCDE"[questionFormik.values.options.length];
    if (questionFormik.values.options.length < 5) {
      questionFormik.setFieldValue("options", [
        ...questionFormik.values.options,
        { optionLabel: nextLabel, optionValue: "" },
      ]);
    }
  };

  const handleRemoveOption = (index) => {
    questionFormik.setFieldValue(
      "options",
      questionFormik.values.options.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <h4 className="fw-bold text-center mt-4">Add Hiring Test</h4>
      <MessageBox />
      <form onSubmit={testFormik.handleSubmit}>
        <div className="d-flex align-items-start justify-content-center gap-3">
          <TextField
            className="w-25"
            label="Test Title"
            variant="outlined"
            name="title"
            value={testFormik.values.title}
            onChange={testFormik.handleChange}
            onBlur={testFormik.handleBlur}
            helperText={
              testFormik.errors.title &&
              testFormik.touched.title &&
              testFormik.errors.title
            }
            error={testFormik.touched.title && Boolean(testFormik.errors.title)}
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
              testFormik.errors.duration &&
              testFormik.touched.duration &&
              testFormik.errors.duration
            }
            error={
              testFormik.touched.duration && Boolean(testFormik.errors.duration)
            }
          >
            <MenuItem value="1">1 Minute (for testing)</MenuItem>
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
        <div className="d-flex justify-content-end mb-2">
          <Button
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={() => handleOpen(null)}
          >
            Add Question
          </Button>
        </div>
        {testFormik.touched.questions && testFormik.errors.questions && (
          <p className="text-center" style={{ color: "#d32f2f" }}>
            {testFormik.errors.questions}
          </p>
        )}
        <div>
          {testFormik.values.questions.length > 0 &&
            testFormik.values.questions.map((e, index) => (
              <div
                className="bg-light-gray rounded shadow-sm px-5 py-3 mb-3"
                style={{ border: "1px solid #0a9396" }}
                key={index}
              >
                <p className="mb-2">
                  <span className="fw-bold">Question {index + 1}:</span>{" "}
                  {e.question}
                </p>
                {e.options.map((option, optionIndex) => (
                  <p className="mb-2" key={optionIndex}>
                    <span className="fw-medium">
                      Option {option.optionLabel}:
                    </span>{" "}
                    {option.optionValue}
                  </p>
                ))}
                <p className="mb-2">
                  <span className="fw-bold" style={{ color: "#0A9396" }}>
                    Correct Answer:
                  </span>
                  {e.correctOption}
                </p>
                <div className="d-flex justify-content-end">
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpen(index)}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    color="danger"
                    onClick={() => deleteQuestion(index)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            ))}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button
            type="submit"
            className="w-50"
            variant="contained"
            color="secondary"
            disabled={!testFormik.isValid}
          >
            Save
          </Button>
        </div>
      </form>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={questionFormik.handleSubmit}>
            <div className="primary-bg mb-5 p-3 rounded-top-2">
              <h3 className="text-center text-white">Add Question</h3>
            </div>
            <div className="d-flex flex-column gap-3 mb-5 px-4">
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
                  questionFormik.errors.question &&
                  questionFormik.touched.question &&
                  questionFormik.errors.question
                }
                error={
                  questionFormik.touched.question &&
                  Boolean(questionFormik.errors.question)
                }
              />
              {questionFormik.values.options.map((option, index) => (
                <div key={index}>
                  <TextField
                    fullWidth
                    label={`Option ${option.optionLabel}`}
                    variant="outlined"
                    name={`options[${index}].optionValue`}
                    value={option.optionValue}
                    onChange={questionFormik.handleChange}
                    onBlur={questionFormik.handleBlur}
                    error={
                      questionFormik.touched.options?.[index]?.optionValue &&
                      Boolean(
                        questionFormik.errors.options?.[index]?.optionValue
                      )
                    }
                    helperText={
                      questionFormik.errors.options?.[index]?.optionValue &&
                      questionFormik.touched.options?.[index]?.optionValue &&
                      questionFormik.errors.options[index].optionValue
                    }
                  />
                  {index === questionFormik.values.options.length - 1 &&
                    questionFormik.values.options.length > 2 && (
                      <Button onClick={() => handleRemoveOption(index)}>
                        Remove Option
                      </Button>
                    )}
                </div>
              ))}
              {questionFormik.values.options.length < 5 && (
                <Button onClick={handleAddOption}>Add Option</Button>
              )}
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
                  questionFormik.errors.correctOption &&
                  questionFormik.touched.correctOption &&
                  questionFormik.errors.correctOption
                }
                error={
                  questionFormik.touched.correctOption &&
                  Boolean(questionFormik.errors.correctOption)
                }
              >
                {questionFormik.values.options.map((option, index) => (
                  <MenuItem key={index} value={option.optionLabel}>
                    {option.optionLabel}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="d-flex justify-content-center gap-3 px-4 py-3">
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

export default AdminHiringTestForm;
