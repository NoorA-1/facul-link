import React from "react";

const InitialForm = ({ children, noColoredLine, className }) => {
  return (
    <div
      className={`form bg-white p-3 col-lg-4 col-md-6 col-10 rounded shadow-lg position-relative
        ${className}`}
    >
      {noColoredLine ? null : <span className="colored-line"></span>}
      {children}
    </div>
  );
};

export default InitialForm;
