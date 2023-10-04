import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="p-3 d-flex align-items-center justify-content-center col-12 ">
      <h6>
        © {year} <span className="fw-bold">Facul-Link</span>, All Rights
        Reserved
      </h6>
    </footer>
  );
};

export default Footer;
