import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromOAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const role = searchParams.get("role");

    if (token && username && role) {
      setUserFromOAuth({ token, username, role });
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <p className="text-gray-400">Signing you in...</p>
    </div>
  );
};

export default OAuthSuccess;
