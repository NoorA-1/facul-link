import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  if (error.status === 404) {
    return <h1>404 Page Not Found.</h1>;
  } else {
    return <h1>Something Went Wrong.</h1>;
  }
};

export default ErrorPage;
