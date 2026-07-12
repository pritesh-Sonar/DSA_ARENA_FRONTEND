import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">DSA Arena</h1>
          <p className="text-gray-400 mt-1">
            Sign in to challenge your friends
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
