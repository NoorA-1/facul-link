import React from "react";

const FormWrapper = ({ children }) => {
  return (
    <div className="min-vh-100 sign-up-bg d-flex align-items-center justify-content-center">
      {children}
    </div>
  );
};

export default FormWrapper;
