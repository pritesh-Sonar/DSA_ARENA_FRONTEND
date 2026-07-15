import { useLocation, Navigate } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword = () => {
  const location = useLocation();
  const { email } = location.state || {};

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
        </div>

        <ResetPasswordForm email={email} />
      </div>
    </div>
  );
};

export default ResetPassword;
