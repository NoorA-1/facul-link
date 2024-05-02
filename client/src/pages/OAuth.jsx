import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../utils/http";

const OAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authCode = searchParams.get("code");
  const navigate = useNavigate();

  const connectToZoom = async (authCode) => {
    try {
      const response = await http.post("/employer/connect-zoom", { authCode });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (authCode) {
      console.log(authCode);
      connectToZoom(authCode);
      navigate(-2);
    }
  }, [authCode]);

  if (!authCode) {
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>;
  }

  return <div>OAuth</div>;
};

export default OAuth;
