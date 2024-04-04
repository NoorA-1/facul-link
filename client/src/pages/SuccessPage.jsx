import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "react-lottie";
import successLottie from "../assets/successLottie";

const SuccessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: successLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (status === "applied") {
    return (
      <div className="container mx-auto my-3">
        <div className="bg-white py-4 rounded grey-border px-5">
          <h4 className="fw-bold text-center">Already applied for this job</h4>
          <div className="d-flex justify-content-center mt-3">
            <Button onClick={() => navigate("/dashboard")} variant="outlined">
              Back to Home Page
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (status === "submitted") {
    return (
      <div className="container mx-auto my-3">
        <div className="bg-white py-4 rounded grey-border px-5">
          <h4 className="fw-bold text-center mt-3 mb-5">
            Job Application Successfully Submitted
          </h4>
          <Lottie options={defaultOptions} height={150} width={150} />
          <div className="d-flex justify-content-center mt-5">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outlined"
              sx={{
                border: 2,
                ":hover": {
                  border: 2,
                },
              }}
            >
              Back to Home Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <div>SuccessPage</div>;
};

export default SuccessPage;
