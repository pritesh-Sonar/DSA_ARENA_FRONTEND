import { useLocation, Navigate } from "react-router-dom";
import OtpVerificationForm from "../components/OtpVerificationForm";

const VerifyOtp = () => {
  const location = useLocation();
  const { email, pendingSignup } = location.state || {};

  if (!email) {
    // No email in state means someone landed here directly — send them back
    return <Navigate to="/signup" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Verify your email</h1>
          <p className="text-gray-400 mt-1">
            We sent a 6-digit code to <span className="text-gray-200">{email}</span>
          </p>
        </div>

        <OtpVerificationForm email={email} pendingSignup={pendingSignup} />
      </div>
    </div>
  );
};

export default VerifyOtp;