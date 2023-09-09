import React from "react";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <nav>Nav Bar</nav>
      <Outlet />
    </>
  );
};

export default HomePage;
