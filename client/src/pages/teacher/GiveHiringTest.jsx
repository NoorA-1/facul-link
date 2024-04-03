import React, { useEffect, useState } from "react";
import http from "../../utils/http";
import { useParams } from "react-router-dom";
import { useDashboardContext } from "../DashboardLayout";
import {
  Button,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";

const GiveHiringTest = () => {
  const params = useParams();
  const [jobData, setJobData] = useState(null);
  const { isTestMode, setIsTestMode } = useDashboardContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [answers, setAnswers] = useState([
    {
      questionId: "",
      answer: "",
    },
  ]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUp, setTimeUp] = useState(null);
  const [view, setView] = useState("instructions");

  const getData = async () => {
    try {
      const { data } = await http.get(
        `/teacher/job-application/hiring-test/${params.jobId}`
      );
      setJobData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.jobId) {
      getData();
      setIsTestMode(true);
    }
  }, [params.jobId]);

  // useEffect(() => {
  //   let interval = null;

  //   if (!showInstructions && timeLeft > 0) {
  //     interval = setInterval(() => {
  //       setTimeLeft((prevTime) => prevTime - 1);
  //     }, 1000);
  //   } else if (timeLeft === 0) {
  //     clearInterval(interval);
  //     // Submit logic
  //   }

  //   return () => clearInterval(interval);
  // }, [timeLeft, showInstructions]);

  const submitTest = () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questionsArray.forEach((e, index) => {
        if (
          e._id === answers[index].questionId &&
          e.correctOption === answers[index].answer
        ) {
          correctAnswers.push(e);
        } else {
          wrongAnswers.push(e);
        }
      });
      console.log("result:" + correctAnswers.length);
      setView("completed");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let interval = null;

    if (view === "test" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimeUp(true);
            submitTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [view, timeLeft, submitTest]);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startTest = () => {
    if (jobData?.hiringTest.shuffleQuestions) {
      const shuffledArray = shuffle([...jobData.hiringTest.questions]);
      setQuestionsArray(shuffledArray);
    } else {
      setQuestionsArray([...jobData.hiringTest.questions]);
    }
    setIsTestMode(true);
    setView("test");
    setTimeLeft(jobData?.hiringTest.duration * 60);
    startTimer();
  };

  const saveAnswer = async (id, answer) => {
    try {
      const data = {
        questionId: id,
        answer,
      };
      const response = await http.put(
        `/teacher/job-application/submit-answer/${jobData._id}`,
        data
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(questionsArray);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  if (view === "completed") {
    return (
      <div className="container mx-auto my-3">
        <div className="bg-white py-4 rounded grey-border px-5">
          <h1>Test completed</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-3">
      <div className="bg-white py-4 rounded grey-border px-5">
        {view === "instructions" ? (
          <div className="d-flex justify-content-center flex-column align-items-center gap-3">
            <h2 className="text-center fw-semibold">Instructions</h2>
            <ul>
              <li className="mb-3">
                Test must be completed in {jobData?.hiringTest.duration} minutes
              </li>
              <li className="mb-3">
                Test will be automatically submitted after{" "}
                {jobData?.hiringTest.duration} minutes
              </li>
              <li className="mb-3">
                Total questions: {questionsArray?.length}
              </li>
              <li className="mb-3">
                You can use the "Previous" and "Next" buttons to navigate
                between questions.
              </li>
              <li className="mb-3">
                Once submitted, you cannot review your answers.
              </li>
              <li className="mb-3">
                Once submitted, you cannot retake the test.
              </li>
            </ul>
            <Button variant="contained" onClick={() => startTest()}>
              Start Test
            </Button>
          </div>
        ) : (
          view === "test" && (
            <>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-normal">
                  <span className="fw-semibold"> Total Questions:</span>{" "}
                  {questionsArray?.length}
                </h6>
                <h6 className="fw-semibold">{formatTime(timeLeft)}</h6>
              </div>
              <h5>
                Q{currentQuestionIndex + 1} :{" "}
                {questionsArray[currentQuestionIndex]?.question}
              </h5>
              <div className="d-flex flex-column gap-2">
                {questionsArray?.[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div
                      className="border border-1 border-secondary-subtle rounded p-2 px-4 mt-3"
                      key={index}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={
                              answers[currentQuestionIndex]?.answer ===
                              option.optionLabel
                            }
                            onChange={() => {
                              setAnswers((prevAnswers) => {
                                const updatedAnswers = [...prevAnswers];
                                updatedAnswers[currentQuestionIndex] = {
                                  ...updatedAnswers[currentQuestionIndex],
                                  questionId:
                                    questionsArray[currentQuestionIndex]._id,
                                  answer: option.optionLabel,
                                };

                                return updatedAnswers;
                              });
                            }}
                            value={option.optionValue}
                            name="radio-buttons"
                            color="primary"
                          />
                        }
                        label={`${option.optionLabel}) ${option.optionValue}`}
                        className="w-100"
                      />
                    </div>
                  )
                )}
              </div>
              <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
                <Button
                  variant="outlined"
                  disabled={currentQuestionIndex <= 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  sx={{
                    border: 2,
                    ":hover": {
                      border: 2,
                    },
                  }}
                >
                  Previous
                </Button>
                {currentQuestionIndex < questionsArray.length - 1 && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => prev + 1);
                      saveAnswer(
                        questionsArray[currentQuestionIndex]._id,
                        answers[currentQuestionIndex].answer
                      );
                    }}
                    sx={{
                      border: 2,
                      ":hover": {
                        border: 2,
                      },
                    }}
                  >
                    Next
                  </Button>
                )}

                {currentQuestionIndex === questionsArray.length - 1 && (
                  <Button variant="contained" onClick={() => submitTest()}>
                    Submit
                  </Button>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default GiveHiringTest;
