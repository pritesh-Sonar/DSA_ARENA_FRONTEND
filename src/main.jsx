import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/ui/ToastContainer";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
