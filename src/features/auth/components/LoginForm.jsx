import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid username or password";
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
          placeholder="Enter your username"
          autoComplete="username"
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
          placeholder="Enter your password"
          autoComplete="current-password"
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
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
