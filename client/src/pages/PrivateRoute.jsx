import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const token = Cookies.get("token");
if (token) {
  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
}

const PrivateRoute = () => {
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
