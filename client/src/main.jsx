import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: { main: "#0A9396" },
    secondary: { main: "#005F73" },
    danger: { main: "#AE2012" },
    alternate: { main: "#0077B6" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
