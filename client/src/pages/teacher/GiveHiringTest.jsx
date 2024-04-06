import React, { useEffect, useState } from "react";
import http from "../../utils/http";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboardContext } from "../DashboardLayout";
import {
  Button,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material";

const GiveHiringTest = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [jobData, setJobData] = useState(null);
  const { isTestMode, setIsTestMode } = useDashboardContext();
  const [view, setView] = useState("instructions");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [answers, setAnswers] = useState([
    {
      questionId: "",
      answer: "",
    },
  ]);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

  const getData = async (jobId) => {
    try {
      const { data } = await http.get(
        `/teacher/job-application/hiring-test/${jobId}`
      );
      setJobData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedTestDetails = localStorage.getItem("testDetails");
    const testDetails = JSON.parse(storedTestDetails);
    if (params.jobId && testDetails?.jobId === params.jobId) {
      const timeLeftInSeconds = calculateTimeLeft(testDetails.endTime);
      console.log(timeLeftInSeconds);
      if (timeLeftInSeconds > 0) {
        setIsTestMode(true);
        setView("test");
        setTimeLeft(timeLeftInSeconds);
      } else {
        localStorage.removeItem("testDetails");
        setTimeUp(() => true);
        submitTest();
      }
    }

    if (params.jobId) {
      getData(params.jobId);
      setIsTestMode(true);
    }
  }, [params.jobId]);

  useEffect(() => {
    if (timeLeft <= 0 && timeLeft !== null) {
      if (!timeUp) {
        setTimeUp(() => true);
        localStorage.removeItem("testDetails");
        submitTest();
      }
    }
  }, [timeLeft]);

  useEffect(() => {
    if (jobData) {
      if (jobData?.hiringTest.shuffleQuestions) {
        const shuffledArray = shuffle([...jobData.hiringTest.questions]);
        setQuestionsArray(shuffledArray);
      } else {
        setQuestionsArray([...jobData.hiringTest.questions]);
      }
    }
  }, [jobData]);

  const submitTest = async () => {
    try {
      if (hasBeenSubmitted) return;
      setHasBeenSubmitted(true);
      let correctAnswers = [];
      let wrongAnswers = [];

      console.log(questionsArray);

      questionsArray.forEach((question) => {
        const answerForQuestion = answers.find(
          (answer) => answer.questionId === question._id
        );

        if (answerForQuestion) {
          if (answerForQuestion.answer === question.correctOption) {
            correctAnswers.push({
              questionId: question._id,
              answer: answerForQuestion.answer,
            });
          } else {
            wrongAnswers.push({
              questionId: question._id,
              answer: answerForQuestion.answer,
            });
          }
        } else {
          wrongAnswers.push({
            questionId: question._id,
            answer: null,
          });
        }
      });

      const completedTime = new Date();
      const isTimeUp = Boolean(timeLeft <= 1);

      const testData = {
        correctAnswers,
        wrongAnswers,
        score: correctAnswers.length,
        completedTime,
        isTimeUp,
      };

      const response = await http.put(
        `/teacher/job-application/submit-test/${params.jobId}`,
        testData
      );
      console.log(response);
      localStorage.removeItem("testDetails");
      // setView("completed");
      setIsTestMode(false);
      if (response.data.lateEntry) {
        navigate(`/dashboard/success/${params.jobId}?status=applied`);
      } else {
        navigate(`/dashboard/success/${params.jobId}?status=submitted`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (view === "test" && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const updatedTime = prevTime - 1;
          if (updatedTime <= 0) {
            clearInterval(interval);
            setTimeUp(true);
            if (!hasBeenSubmitted) {
              submitTest();
            }
            return 0;
          }
          return updatedTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [view, timeLeft, hasBeenSubmitted]);

  const calculateTimeLeft = (dateTime) => {
    const endTime = new Date(dateTime).getTime();
    const currentTime = Date.now();
    const timeLeftInSeconds = Math.max(
      0,
      Math.floor((endTime - currentTime) / 1000)
    );
    return timeLeftInSeconds;
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startTest = async () => {
    try {
      const { data } = await http.put(
        `/teacher/job-application/start-test/${params.jobId}`
      );
      console.log(data);
      setIsTestMode(true);
      setView("test");

      const timeLeftInSeconds = calculateTimeLeft(data.endTime);
      setTimeLeft(timeLeftInSeconds);

      const testDetails = {
        jobId: jobData._id,
        testId: jobData.hiringTest._id,
        endTime: data.endTime,
      };
      localStorage.setItem("testDetails", JSON.stringify(testDetails));
    } catch (error) {
      console.log(error);
    }
  };

  const saveAnswer = async (updatedAnswers) => {
    const testDetails = JSON.parse(localStorage.getItem("testDetails"));
    testDetails.answers = updatedAnswers;
    localStorage.setItem("testDetails", JSON.stringify(testDetails));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // if (view === "completed") {
  //   return (
  //     <div className="container mx-auto my-3">
  //       <div className="bg-white py-4 rounded grey-border px-5">
  //         <h1>Test completed</h1>
  //       </div>
  //     </div>
  //   );
  // }

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
                Total questions: {jobData?.hiringTest.questions.length}
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
              {Boolean(error) && <Alert severity="error">{error}</Alert>}
              <div className="d-flex flex-column gap-2">
                {questionsArray?.[currentQuestionIndex]?.options.map(
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

                                saveAnswer(updatedAnswers);

                                return updatedAnswers;
                              });
                              setError(null);
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
                  onClick={() => {
                    setCurrentQuestionIndex((prev) => prev - 1);
                    setError(null);
                  }}
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
                      if (
                        answers[currentQuestionIndex] &&
                        answers[currentQuestionIndex]?.answer !== ""
                      ) {
                        setCurrentQuestionIndex((prev) => prev + 1);
                        setError(null);
                      } else {
                        setError("Option must be selected");
                      }
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (
                        answers[currentQuestionIndex] &&
                        answers[currentQuestionIndex]?.answer !== ""
                      ) {
                        submitTest();
                        setError(null);
                      } else {
                        setError("Option must be selected");
                      }
                    }}
                  >
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