import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/error/NotFound";
import AuthCardSkeleton from "../components/ui/skeletons/AuthCardSkeleton";
import DashboardSkeleton from "../components/ui/skeletons/DashboardSkeleton";
import GameArenaSkeleton from "../components/ui/skeletons/GameArenaSkeleton";

// Lazy-loaded pages — each becomes its own JS chunk, downloaded only
// when the user actually navigates to that route.
const Login = lazy(() => import("../features/auth/pages/Login"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const VerifyOtp = lazy(() => import("../features/auth/pages/VerifyOtp"));
const ForgotPassword = lazy(
  () => import("../features/auth/pages/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("../features/auth/pages/ResetPassword"),
);
const OAuthSuccess = lazy(() => import("../features/auth/pages/OAuthSuccess"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const TicTacToeArena = lazy(
  () => import("../games/tictactoe/pages/TicTacToeArena"),
);
const TicTacToeBotArena = lazy(
  () => import("../games/tictactoe/pages/TicTacToeBotArena"),
);

// Small helper so each route wraps its lazy component with the
// matching skeleton — keeps the JSX below readable.
const withSuspense = (Component, Fallback) => (
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={withSuspense(Login, AuthCardSkeleton)} />
      <Route path="/signup" element={withSuspense(Signup, AuthCardSkeleton)} />
      <Route
        path="/verify-otp"
        element={withSuspense(VerifyOtp, AuthCardSkeleton)}
      />
      <Route
        path="/forgot-password"
        element={withSuspense(ForgotPassword, AuthCardSkeleton)}
      />
      <Route
        path="/reset-password"
        element={withSuspense(ResetPassword, AuthCardSkeleton)}
      />
      <Route
        path="/oauth-success"
        element={withSuspense(OAuthSuccess, AuthCardSkeleton)}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/game/tictactoe/:roomId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<GameArenaSkeleton />}>
              <TicTacToeArena />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/game/tictactoe/bot"
        element={
          <ProtectedRoute>
            <Suspense fallback={<GameArenaSkeleton />}>
              <TicTacToeBotArena />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all — must stay last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
