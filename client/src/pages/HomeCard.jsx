import React from "react";

const HomeCard = ({ children, heading, text }) => {
  return (
    <div className="card px-3 shadow-sm col-lg-3 col-12 d-flex align-items-center justify-content-center ">
      {children}
      <h2 className="fw-bold mt-2 mb-2">{heading}</h2>
      <p className="h6 fw-normal text-center">{text}</p>
    </div>
  );
};

export default HomeCard;
