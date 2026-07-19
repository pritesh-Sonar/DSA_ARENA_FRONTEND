import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import OAuthSuccess from "../features/auth/pages/OAuthSuccess";
import TicTacToeArena from "../games/tictactoe/pages/TicTacToeArena";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route
        path="/game/tictactoe/:roomId"
        element={
          <ProtectedRoute>
            <TicTacToeArena />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
