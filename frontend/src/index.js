import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "assets/theme";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <SoftUIControllerProvider>
        <App />
      </SoftUIControllerProvider>
    </ThemeProvider>
  </BrowserRouter>
);
