import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
// import Signup from "../features/auth/pages/Signup"; // next step

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
