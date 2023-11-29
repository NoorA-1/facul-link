import React from "react";

const HomePageCard = ({ cardText, color, digit, children }) => {
  return (
    <div
      className="bg-white rounded"
      style={{
        padding: "0.5rem 2rem",
        width: "18rem",
        border: "1px solid #BDBBBB",
      }}
    >
      {children}
      <h6 className="fw-bold">{cardText}</h6>
      <h4 className="fw-bold" style={{ color }}>
        {digit}
      </h4>
    </div>
  );
};

export default HomePageCard;
