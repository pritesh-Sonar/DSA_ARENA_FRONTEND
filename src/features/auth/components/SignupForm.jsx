import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return "Please fill in all fields";
    }
    if (username.trim().length < 3 || username.trim().length > 20) {
      return "Username must be 3-20 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await sendOtp(username.trim(), email.trim(), password);
      navigate("/verify-otp", {
        state: {
          email: email.trim(),
          pendingSignup: {
            username: username.trim(),
            email: email.trim(),
            password,
          },
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Choose a username"
          autoComplete="username"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors"
      >
        {loading ? "Sending OTP..." : "Continue"}
      </button>
    </form>
  );
};

export default SignupForm;
