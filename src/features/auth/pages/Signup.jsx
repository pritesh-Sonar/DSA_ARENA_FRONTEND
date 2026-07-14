import { Link, Navigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">DSA Arena</h1>
          <p className="text-gray-400 mt-1">Create an account to get started</p>
        </div>

        <SignupForm />

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
