import React from "react";
import { Wrapper, BigSidebar, Header } from "../components";
import { Outlet } from "react-router-dom";

//TODO: Add dashboard context

const DashboardLayout = () => {
  return (
    <>
      <div className="min-vh-100 sign-up-bg">
        <Header homeDisabled={true} />
        <div className="row w-100">
          <div className="col-2 sidebar">
            <BigSidebar />
          </div>
          <div
            className="col-10 px-5 py-4 dashboard-page"
            style={{ overflowY: "auto" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
